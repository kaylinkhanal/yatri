'use client'

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { SendHorizonal, CircleX, Bot, User } from "lucide-react";
import { BusSearchCard } from "./BusSearchCard";
import { useSelector } from "react-redux";

interface Location {
  lat: number;
  lng: number;
}

interface RouteData {
  stops: any[];
  bus: any[];
  [key: string]: any;
}

interface AiOutput {
  intent: "BOOK_TICKET" | "GENERAL_QUERY";
  from: string | null;
  to: string | null;
  date: string | null;
  passengers: number | null;
  extras?: string[] | null;
  distance?: string | null;
  originalQuery: string;
  ai_suggestion: string | null;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

const newId = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2));

// Basic title-case for nicer display of place names
function toTitleCase(input: string) {
  return input
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(w => w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w)
    .join(' ');
}

// Parse very simple "X to Y" or "from X to Y" queries containing only letters/spaces
function parseSimpleRouteQuery(text: string): { from: string; to: string } | null {
  const t = text.trim();
  // from X to Y
  let m = t.match(/^from\s+([a-zA-Z][a-zA-Z\s']*?)\s+(?:to|->|→)\s+([a-zA-Z][a-zA-Z\s']*?)$/i);
  if (m) {
    return { from: toTitleCase(m[1]), to: toTitleCase(m[2]) };
  }
  // X to Y (letters/spaces only to avoid capturing dates/extras)
  m = t.match(/^([a-zA-Z][a-zA-Z\s']*?)\s+(?:to|->|→)\s+([a-zA-Z][a-zA-Z\s']*?)$/i);
  if (m) {
    return { from: toTitleCase(m[1]), to: toTitleCase(m[2]) };
  }
  return null;
}

// Detect simple greetings to avoid duplicate AI greetings
function isGreeting(text: string) {
  const t = text.trim().toLowerCase();
  return /^(hi|hello|hey|namaste|good\s*(morning|afternoon|evening))\b/.test(t);
}

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

async function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

async function callGeminiWithRetry(body: any, apiKey: string, maxRetries = 2, onRetry?: (attempt: number) => void) {
  let attempt = 0;
  // small jitter base: 800ms
  while (true) {
    try {
      const response = await axios.post(GEMINI_URL, body, { headers: { 'X-goog-api-key': apiKey } });
      return response;
    } catch (err: any) {
      const status = err?.response?.status;
      if (attempt < maxRetries && (status === 503 || status === 500 || status === 429)) {
        attempt += 1;
        onRetry?.(attempt);
        const backoff = 800 * Math.pow(2, attempt - 1) + Math.floor(Math.random() * 250);
        await sleep(backoff);
        continue;
      }
      throw err;
    }
  }
}


export default function SearchForm() {
  const {userDetails} = useSelector(state=>state.user)
  const chips = [
    "Where are we?",
    "Book Pokhara tomorrow from kalanki",
    "AC buses?",
    "Pokhara for 3, non-veg food & coke",
  ];
  
  const [aiInput, setAiInput] = useState("");
  const [chipsVisible, setChipsVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [results, setResults] = useState<RouteData[]>([]);
  const [aiOutput, setAiOutput] = useState<AiOutput | null>(null);
  const [generalQueryAnswer, setGeneralQueryAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt' | 'unsupported'>('prompt');
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [promptPendingReply, setPromptPendingReply] = useState('');
  const API_KEY = 'AIzaSyCcyqJvpKGzw9Lv8a7s_rVlwerLR0LR7_s';
  const [allQuestionsAnswers, setAllQuestionsAnswers] = useState<string[]>([]);
  const [transcript, setTranscript] = useState<ChatMessage[]>([]);
  const [hasInteracted, setHasInteracted] = useState(false);

  const endRef = useRef<HTMLDivElement | null>(null);
  const buildGeneralPrompt = (originalQuery: string, currentLocation: Location | null) => {
    const locationContext = currentLocation
      ? `User's current location: latitude ${currentLocation.lat}, longitude ${currentLocation.lng}. If the user asks for their location, resolve to the nearest city/district/landmark in Nepal.`
      : 'User location is not available.';
  
    return `You are Yatri AI, a helpful travel assistant for Nepal.\n\n${locationContext}\n\nUser question: "${originalQuery}"\n\nInstructions:\n- Be concise, friendly, and factual.\n- If asked about current location and you have coordinates, resolve to the nearest known place in Nepal.\n- If you don't have enough info, be honest and invite a quick follow-up. Avoid sounding robotic.`;
  };
  
  const buildClassificationPrompt = (params: {
    submissionText: string;
    todayISO: string;
    tomorrowISO: string;
    currentTimeNepal: string;
    currentLocation: Location | null;
    locationPermission: 'granted' | 'denied' | 'prompt' | 'unsupported';
  }) => {
    const { submissionText, todayISO, tomorrowISO, currentTimeNepal, currentLocation, locationPermission } = params;
    const locationText = currentLocation
      ? `User's current location: lat=${currentLocation.lat}, lng=${currentLocation.lng} (Permission: GRANTED). If "from" is missing, infer nearest major city/town from these coordinates.`
      : locationPermission === 'denied'
      ? 'User location: UNAVAILABLE (Permission denied). Do not infer departure automatically.'
      : 'User location: UNAVAILABLE (Permission not granted). Do not infer departure automatically.';
  
    const examples = `\n\nExamples (follow exactly):\n1) Input: "Book Kathmandu to Pokhara tomorrow for 2 on AC bus"\nOutput: {\n  "intent": "BOOK_TICKET",\n  "from": "Kathmandu",\n  "to": "Pokhara",\n  "date": "${tomorrowISO}",\n  "passengers": 2,\n  "extras": ["AC"],\n  "distance": "200 km",\n  "originalQuery": "Book Kathmandu to Pokhara tomorrow for 2 on AC bus",\n  "pendingPrompt": "Please enter the bus name you want to book",\n  "ai_suggestion": null\n}\n\n2) Input: "I want to book bus"\nOutput: {\n  "intent": "BOOK_TICKET",\n  "from": null,\n  "to": null,\n  "date": null,\n  "passengers": 1,\n  "extras": null,\n  "distance": null,\n  "originalQuery": "I want to book bus",\n  "pendingPrompt": "Got it! Where are you starting from, and where would you like to go?",\n  "ai_suggestion": "Could you share your departure city and destination (e.g., Kathmandu to Pokhara)?"\n}\n\n3) Input: "Bus to Chitwan tomorrow" (location not granted)\nOutput: {\n  "intent": "BOOK_TICKET",\n  "from": null,\n  "to": "Chitwan",\n  "date": "${tomorrowISO}",\n   "passengers": 1,\n  "extras": null,\n  "distance": null,\n  "originalQuery": "Bus to Chitwan tomorrow",\n  "pendingPrompt": "Where are you traveling from?",\n  "ai_suggestion": null\n}\n)`;
  
    return `You are Yatri AI, an accurate and friendly assistant for Nepal's bus booking.\nAnalyze the user query and output STRICT JSON only, following the schema. Do not wrap JSON in markdown or add commentary.\n\nContext:\n- ${locationText}\n- Today's date: ${todayISO} (Nepal Time, GMT+5:45)\n- Current time: ${currentTimeNepal}\n\nIntent types:\n- BOOK_TICKET: user wants to search/book buses\n- GENERAL_QUERY: questions about services/locations/current location etc.\n\nDate rules (normalize to YYYY-MM-DD):\n- today => ${todayISO}; tomorrow => ${tomorrowISO}; day after tomorrow => +2 days; next week => +7 days; this weekend => upcoming Saturday\n- Specific dates like "25th December": use current year if upcoming, else next year\n- If no date, set null\n\nField rules for BOOK_TICKET:\n- from: origin stop/city; infer from location ONLY if available, else null\n- to: destination; if not specified, null\n- date: normalized date or null\n- passengers: default 1\n- extras: array of preferences or null (e.g., "AC", "Sleeper", "Window seat", "Food", "Drinks"). If not requested, set null.\n- distance: estimated Nepal road distance as a string like "200 km" for common pairs (Kathmandu–Pokhara ~200 km; Kathmandu–Chitwan ~150 km; Kathmandu–Butwal ~280 km; Pokhara–Chitwan ~120 km). If unsure, use null.\n- pendingPrompt: Ask ONE short, friendly question (from → to → date → passengers → extras). Keep it natural, e.g., "Great — what date would you like to travel?" If enough info, set to "Please enter the bus name you want to book".\n- ai_suggestion: Only set when BOTH from AND to are missing or the query is vague.  make sure pendingPrompt: "booked" if to and from was provided in users previously provided details. Previously provided details were: ${allQuestionsAnswers.join(', ')}\n\n4). If Previously provided details already has some texts that starts from YTR, know that bus details has also been provided. Do not ask for bus name again. Just confirm the booking by setting pendingPrompt to "booked".\n Keep it friendly, e.g., "Could you share your departure city and destination?"  Otherwise null.\n- originalQuery: echo full user text.\n\nGeneral queries: set from, to, date, passengers, extras, distance, pendingPrompt, ai_suggestion to null.\n\nOutput policy:\n- Return ONLY valid JSON matching the schema. Use null for missing. Do not invent cities or distances.\n- Never set both pendingPrompt and ai_suggestion at the same time — prefer pendingPrompt.\n\nUser Query: "${submissionText}"${examples}"`;
  };
  
  function safeParseJSON(text: string) {
    try { return JSON.parse(text); } catch (e) {
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      if (start !== -1 && end !== -1 && end > start) {
        const candidate = text.slice(start, end + 1);
        try { return JSON.parse(candidate); } catch {}
      }
      return null;
    }
  }
  
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, results, isLoading]);

  const fetchRoutes = async () => {
    if (!aiOutput || aiOutput.intent !== 'BOOK_TICKET' || (!aiOutput.from && !aiOutput.to)) {
      setResults([]); 
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/routes?stop1=${aiOutput.from || ''}&stop2=${aiOutput.to || ''}`
      );
      
      if (aiOutput?.from === aiOutput.from && aiOutput?.to === aiOutput.to) {
        debugger;
        setResults(data.routes || []);
        
        if (data.distance) {
          const distanceKm = `${Math.round(data.distance)} km`;
          setAiOutput(prev => prev ? { ...prev, distance: distanceKm } : prev);
        }
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        const fromText = aiOutput.from || "origin";
        const toText = aiOutput.to || "destination";
        setError(`No buses available for the route from ${fromText} to ${toText}. Please try a different route.`);
      } else {
        setError("Failed to fetch bus routes. Please check your connection and try again.");
      }
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!promptPendingReply) return;
    setTranscript((prev) => {
      if (prev.length && prev[prev.length - 1].role === 'assistant' && prev[prev.length - 1].text === promptPendingReply) return prev;
      return [...prev, { id: newId(), role: 'assistant', text: promptPendingReply }];
    });
  }, [promptPendingReply]);

  const handleGeneralQuery = async () => {
    if (!aiOutput || !aiOutput.originalQuery) return;
  const prompt = buildGeneralPrompt(aiOutput.originalQuery, currentLocation);

    setIsLoading(true);
    setError(null);

    try {
      const body = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, topP: 0.9, maxOutputTokens: 256 },
      };
      let retryNotified = false;
      const response = await callGeminiWithRetry(body, API_KEY, 2, (attempt) => {
        if (!retryNotified) {
          setTranscript((prev) => [...prev, { id: newId(), role: 'assistant', text: 'Service is busy, retrying…' }]);
          retryNotified = true;
        }
      });

  const answer = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      setGeneralQueryAnswer(answer);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 503 || status === 500) {
        setGeneralQueryAnswer('I\'m a bit busy right now. Please give me a moment and try again.');
      } else {
        setGeneralQueryAnswer("I couldn\'t find that just now. Mind trying again in a moment?");
      }
      setError('Having trouble reaching the assistant right now.');
    } finally {
      setIsLoading(false);
    }
  };

  const requestLocationPermission = async () => {
    if (!("geolocation" in navigator)) {
      setLocationPermission('unsupported');
      setShowLocationPrompt(false);
      return;
    }

    setIsRequestingLocation(true);
    
    try {
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        
        if (permission.state === 'granted') {
          getCurrentLocation();
          return;
        } else if (permission.state === 'denied') {
          setLocationPermission('denied');
          setShowLocationPrompt(false);
          setIsRequestingLocation(false);
          return;
        }
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setLocationPermission('granted');
          setShowLocationPrompt(false);
        },
        () => {
          setLocationPermission('denied');
          setShowLocationPrompt(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000,
        }
      );
    } catch (error) {
      setLocationPermission('denied');
      setShowLocationPrompt(false);
    } finally {
      setIsRequestingLocation(false);
    }
  };

  const getCurrentLocation = () => {
    if (!("geolocation" in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationPermission('granted');
      },
      () => {
        setLocationPermission('denied');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const dismissLocationPrompt = () => {
    setShowLocationPrompt(false);
    setLocationPermission('denied');
  };

  useEffect(() => {
    const timer = setTimeout(() => setChipsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setLocationPermission('unsupported');
      return;
    }

    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' as PermissionName }).then((permission) => {
        if (permission.state === 'granted') {
          getCurrentLocation();
        } else if (permission.state === 'denied') {
          setLocationPermission('denied');
        } else {
          setTimeout(() => setShowLocationPrompt(true), 2000);
        }
      }).catch(() => {
        setTimeout(() => setShowLocationPrompt(true), 2000);
      });
    } else {
      setTimeout(() => setShowLocationPrompt(true), 2000);
    }
  }, []);

  const createBooking = async(details)=> {
    const { from, to, date, originalQuery: busName , passengers, extras } = details;
    debugger;

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/booking`, {busName, from, to, date, passengers, userId: userDetails?.user?._id });
      return response.data;
    } catch (error) {
      console.error("Booking creation failed:", error);
      throw error;
    }

  }
  useEffect(() => {
    if (!aiOutput) return;

    const timeoutId = setTimeout(() => {
      if (aiOutput.intent === 'BOOK_TICKET') {
        setGeneralQueryAnswer(""); 
        if (aiOutput.ai_suggestion) {
          setResults([]);
        } else {
          if(aiOutput.from && aiOutput.to && promptPendingReply === 'booked') {
            setPromptPendingReply('Your bus has been booked! Safe travels. 🚌✨');
            debugger;
            
          }else{
            fetchRoutes();
          }
       
        }
      } else if (aiOutput.intent === 'GENERAL_QUERY') {
        setResults([]);
        handleGeneralQuery();
      }
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [aiOutput?.intent, aiOutput?.from, aiOutput?.to, aiOutput?.ai_suggestion, aiOutput?.originalQuery]);

  const handleAiSubmit = async (query?: string) => {
    const submissionText = query || aiInput;
    if (!submissionText) return; 
    
    if (isLoading) return;
    
    setHasInteracted(true);
    setTranscript((prev) => [...prev, { id: newId(), role: 'user', text: submissionText }]);

    if (isGreeting(submissionText)) {
      setGeneralQueryAnswer('Hi there! How can I help you plan your trip in Nepal today?');

      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneralQueryAnswer("");
    setResults([]);
  
    const today = new Date();
    const todayNepal = new Date(today.getTime() + (5.75 * 60 * 60 * 1000)); 
    const todayISO = todayNepal.toISOString().split("T")[0];

    const tomorrow = new Date(todayNepal);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowISO = tomorrow.toISOString().split('T')[0];

    const currentTimeNepal = todayNepal.toLocaleTimeString('en-US', { timeZone: 'Asia/Kathmandu' });
    const prompt = buildClassificationPrompt({
      submissionText,
      todayISO,
      tomorrowISO,
      currentTimeNepal,
      currentLocation,
      locationPermission,
    });

    const existingQuestsionAnswers = [...allQuestionsAnswers]
    existingQuestsionAnswers.push(submissionText)
    setAllQuestionsAnswers(existingQuestsionAnswers);
    try {
      const body = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          topP: 0.9,
          maxOutputTokens: 512,
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              intent: { type: 'STRING', enum: ['BOOK_TICKET', 'GENERAL_QUERY'] },
              from: { type: 'STRING', nullable: true },
              to: { type: 'STRING', nullable: true },
              date: { type: 'STRING', nullable: true },
              passengers: { type: 'NUMBER', nullable: true },
              extras: { type: 'ARRAY', items: { type: 'STRING' }, nullable: true },
              distance: { type: 'STRING', nullable: true },
              originalQuery: { type: 'STRING' },
              pendingPrompt: { type: 'STRING' },
              ai_suggestion: { type: 'STRING', nullable: true }
            },
            required: ['intent', 'originalQuery']
          }
        }
      };

      let retryNotified = false;
      const response = await callGeminiWithRetry(body, API_KEY, 2, (attempt) => {
        if (!retryNotified) {
          setTranscript((prev) => [...prev, { id: newId(), role: 'assistant', text: 'Service is busy, retrying…' }]);
          retryNotified = true;
        }
      });

      const result = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      let parsedResult = safeParseJSON(result);
      if (!parsedResult) {
        const simple = parseSimpleRouteQuery(submissionText);
        if (simple) {
          parsedResult = {
            intent: 'BOOK_TICKET',
            from: simple.from,
            to: simple.to,
            date: null,
            passengers: 1,
            extras: null,
            distance: null,
            originalQuery: submissionText,
            pendingPrompt: 'Great — what date would you like to travel?',
            ai_suggestion: null,
          };
        } else {
          setError('Hmm, I couldn\'t process that. Could you share a bit more detail (e.g., "Kalanki to Chandragiri tomorrow")?');
          return null;
        }
      }
      setAiOutput(parsedResult);
      if (parsedResult.intent === 'BOOK_TICKET') {
        debugger;
        setPromptPendingReply(parsedResult.pendingPrompt || '');
        if(parsedResult.pendingPrompt === 'booked') {
          setResults([]);
          createBooking(parsedResult)

        }
      } else {
        setPromptPendingReply('');
      }
      setAiInput('');
      
      // if (!query) {
      //   setAiInput("");
      // }
      
      return parsedResult;
   
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 503 || status === 500) {
        setError('I\'m a bit busy right now. Please try again in a moment.');
      } else if (status === 429) {
        setError('Too many requests at once — a short pause should fix it.');
      } else {
        setError('I couldn\'t process that just now. Please try again.');
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);
  
  const clearAISuggestion = () => {
    setAiOutput(prev => prev ? { ...prev, ai_suggestion: null } : null);
  };

  const retryLastQuery = () => {
    if (aiOutput?.originalQuery) {
      handleAiSubmit(aiOutput.originalQuery);
    }
  };

  const handleChipClick = (chipText: string) => {
    if (isLoading) return;
    
    setAiInput(chipText);
    handleAiSubmit(chipText);
  };

  useEffect(() => {
    const suggestion = aiOutput?.ai_suggestion ?? '';
    if (!suggestion) return;
    // Only surface ai_suggestion for booking flow to avoid duplicate greetings on GENERAL_QUERY
    if (aiOutput?.intent !== 'BOOK_TICKET') return;
    setTranscript((prev) => {
      if (prev.length && prev[prev.length - 1].role === 'assistant' && prev[prev.length - 1].text === suggestion) return prev;
      return [...prev, { id: newId(), role: 'assistant', text: suggestion }];
    });
  }, [aiOutput?.ai_suggestion]);

  useEffect(() => {
    if (generalQueryAnswer) {
      setTranscript((prev) => {
        if (prev.length && prev[prev.length - 1].role === 'assistant' && prev[prev.length - 1].text === generalQueryAnswer) return prev;
        return [...prev, { id: newId(), role: 'assistant', text: generalQueryAnswer }];
      });
    }
  }, [generalQueryAnswer]);

  useEffect(() => {
    if (error) {
      const msg = error.startsWith('Error: ') ? error.slice(7) : error;
      setTranscript((prev) => [...prev, { id: newId(), role: 'assistant', text: msg }]);
    }
  }, [error]);

  return (
    <div className="absolute inset-0 flex flex-col">
      Hi {JSON.stringify(userDetails?.user?.lastName)}
      {/* Scrollable chat area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 md:px-10 lg:px-14 xl:px-20 py-8">
        {/* If not interacted yet, center input and hide chat list */}
        {!hasInteracted ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="w-full max-w-3xl">
              <div className="relative">
                <Input
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  disabled={isLoading}
                  className="w-full h-16 bg-white/90 border-none text-xl text-black placeholder:text-gray-600 pl-6 pr-16 rounded-full shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F6C433] disabled:opacity-50"
                  placeholder={isLoading ? "Processing..." : "Ask Yatri AI"}
                  onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleAiSubmit()}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading}
                  onClick={() => handleAiSubmit()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-[#F6C433] text-white hover:bg-[#F6C433]/90 disabled:opacity-50"
                >
                  <SendHorizonal className="h-6 w-6 text-black" />
                </Button>
              </div>
              {/* quick chips under center input */}
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                {chips.map((chip, index) => (
                  <Button key={index} variant="outline" disabled={isLoading} className={`bg-white/20 backdrop-blur-sm text-white border-white/40 hover:bg-white/30 hover:border-white/60 rounded-full px-5 py-2 text-sm md:text-base transition-all duration-500 ease-out disabled:opacity-50 ${chipsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: `${index * 100}ms` }} onClick={() => { setAiInput(chip); handleAiSubmit(chip); }}>
                    {chip}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Transcript (user right, assistant left) */}
            <div className="mx-auto w-full max-w-4xl space-y-4">
              {transcript.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-end gap-2 max-w-[80%] ${m.role === 'user' ? '' : ''}`}>
                    {m.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center backdrop-blur-sm"><Bot className="w-4 h-4" /></div>
                    )}
                    <div className={`${m.role === 'user' ? 'bg-[#F6C433] text-black' : 'bg-white/15 text-white'} rounded-2xl px-4 py-3 shadow whitespace-pre-wrap break-words`}>{m.text}</div>
                    {m.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-[#F6C433] text-black flex items-center justify-center"><User className="w-4 h-4" /></div>
                    )}
                  </div>
                </div>
              ))}

              {/* Assistant typing indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-end gap-2 max-w-[80%]">
                    <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center backdrop-blur-sm"><Bot className="w-4 h-4" /></div>
                    <div className="rounded-2xl px-4 py-3 bg-white/10 text-white/90 backdrop-blur-sm shadow">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <span className="ml-2">Thinking…</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Results cards below messages when present */}
              {results.length > 0 && !isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2 w-full max-w-4xl">
                    <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center backdrop-blur-sm mt-1"><Bot className="w-4 h-4" /></div>
                    <div className="flex-1 space-y-4">
                      {results.map((route, index) => (
                        <BusSearchCard
                          distance={aiOutput?.distance || 'N/A'}
                          key={`route-${index}-${route.bus?.[0]?.busNumber || 'unknown'}`}
                          {...route}
                          from={aiOutput?.from || 'N/A'}
                          to={aiOutput?.to || 'N/A'}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div ref={endRef} />
            </div>
          </>
        )}
      </div>

      {/* Bottom-fixed input once user has interacted */}
      {hasInteracted && (
        <div className="pl-0 md:pl-0 border-t border-white/10 bg-transparent">
          <div className="mx-auto w-full max-w-4xl px-6 md:px-10 py-3 md:py-4">
            <div className="relative">
              
              <Input
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                disabled={isLoading}
                className="w-full h-14 md:h-16 bg-white/90 border-none text-base md:text-xl text-black placeholder:text-gray-600 pl-6 pr-16 rounded-full shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F6C433] disabled:opacity-50"
                placeholder={isLoading ? 'Processing...' : 'Ask Yatri AI'}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleAiSubmit()}
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading}
                onClick={() => handleAiSubmit()}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 rounded-full bg-[#F6C433] text-white hover:bg-[#F6C433]/90 disabled:opacity-50"
              >
                <SendHorizonal className="h-5 w-5 md:h-6 md:w-6 text-black" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



// 'use client'
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import axios from "axios";
// import {
//   MapPin,
//   ArrowRightLeftIcon as ArrowsRightLeft,
//   Calendar,
//   Users,
//   CircleX,
// } from "lucide-react";
// import { Formik, Form, useField } from "formik";
// import * as Yup from "yup";
// import { useState } from "react";
// import { BusSearchCard } from "./BusSearchCard";

// // This is a custom component to simplify connecting Formik to Shadcn UI inputs.
// // It handles the field props and displays validation errors.
// const FormikInput = ({ label, icon: Icon, ...props }) => {
//   const [field, meta] = useField(props);
//   const isError = meta.touched && meta.error;

//   return (
//     <div className="flex flex-col space-y-1">
//       <label htmlFor={props.id || props.name} className="text-sm text-white flex items-center gap-1">
//         {Icon && <Icon className="h-4 w-4 text-gold" />}
//         {label}:
//       </label>
//       <Input
//         className={`bg-white/80 border-none text-black placeholder:text-gray-600 ${isError ? 'border-red-500' : ''}`}
//         {...field}
//         {...props}
//       />
//       {isError && (
//         <div className="text-red-500 text-xs mt-1">{meta.error}</div>
//       )}
//     </div>
//   );
// };

// export default function SearchForm() {
//   const [results, setResults] = useState([]);
//   const validationSchema = Yup.object({
//     from: Yup.string().required("Origin is required"),
//     to: Yup.string().required("Destination is required"),
//     date: Yup.string(),
//     passengers: Yup.number().min(1, 'Must be at least 1').integer(),
//   });

//   const handleSubmit = async (values, { setSubmitting }) => {
//     try {
//       const {data} = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/routes?stop1=${values.from}&stop2=${values.to}` );

//       setResults(data)
      
//       // You can handle the response here (e.g., set search results in state, redirect, etc.)
//     } catch (error) {
//       console.error("Error fetching routes:", error);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="relative z-10 w-full max-w-6xl mx-auto px-4 pb-12 md:px-8 lg:px-12">
//       <Formik
//         initialValues={{
//           from: "",
//           to: "",
//           date: "",
//           passengers: 1,
//         }}
//         validationSchema={validationSchema}
//         onSubmit={handleSubmit}
//       >
//         {({values, isSubmitting }) => (
//           <>
//           <Form className="bg-white/20 backdrop-blur-sm rounded-lg p-4 md:p-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
//             <FormikInput
//               name="from"
//               id="from"
//               label="From"
//               icon={MapPin}
//               placeholder="Select location"
//             />
//             <div className="flex items-center justify-center md:col-span-1">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="text-white hover:text-gold"
//               >
//                 <ArrowsRightLeft className="h-6 w-6" />
//               </Button>
//             </div>
//             <FormikInput
//               name="to"
//               id="to"
//               label="To"
//               icon={MapPin}
//               placeholder="Select destination"
//             />
//             <FormikInput
//               name="date"
//               id="date"
//               label="Date"
//               icon={Calendar}
//               type="text"
//               placeholder="Departure"
//             />
//             <FormikInput
//               name="passengers"
//               id="passengers"
//               label="Passengers"
//               icon={Users}
//               type="number"
//               placeholder="1 adult"
//             />
//             <Button
//               type="submit"
//               className="col-span-1 md:col-span-5 bg-[#f4c534] text-white hover:bg-gold/90 h-12 text-lg font-semibold"
//               disabled={isSubmitting}
//             >
//               SEARCH
//             </Button>
//           </Form>
                      
        //    </>
        // )}

//       </Formik>
      
//     </div>
//   );
// }