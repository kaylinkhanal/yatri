'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { SendHorizonal, CircleX } from "lucide-react";
import { BusSearchCard } from "./BusSearchCard";

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

export default function SearchForm() {
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
  const [allQuestionsAnswers, setAllQuestionsAnswers] = useState([]);
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

  const handleGeneralQuery = async () => {
    if (!aiOutput || !aiOutput.originalQuery) return;

    const locationContext = currentLocation 
      ? `User's current location: latitude ${currentLocation.lat}, longitude ${currentLocation.lng}. 
         If the user is asking about their location or "where are we", use these coordinates to identify the nearest city, district, or landmark in Nepal and provide a helpful response.`
      : "User location is not available.";

    const prompt = `You are Yatri AI, a helpful assistant for bus travel in Nepal.

${locationContext}

User question: "${aiOutput.originalQuery}"

Please provide a brief, helpful answer. If the user is asking about their current location and you have coordinates, identify the nearest city or area in Nepal and provide useful information about that location.`;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
        {
          "contents": [
            {
              "role": "user",
              "parts": [
                { "text": prompt }
              ]
            }
          ]
        },
        {
          headers: {
            "X-goog-api-key": API_KEY
          }
        }
      );
      
      const answer = response.data.candidates[0].content.parts[0].text;
      setGeneralQueryAnswer(answer);
    } catch (err: any) {
      setGeneralQueryAnswer("Sorry, I couldn't find an answer to that right now. Please try again.");
      setError("Failed to get response from AI. Please try again.");
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
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        
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
        (err) => {
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
      (err) => {
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
      navigator.permissions.query({ name: 'geolocation' }).then((permission) => {
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

  useEffect(() => {
    if (!aiOutput) return;

    const timeoutId = setTimeout(() => {
      if (aiOutput.intent === 'BOOK_TICKET') {
        setGeneralQueryAnswer(""); 
        if (aiOutput.ai_suggestion) {
          setResults([]);
        } else {
          fetchRoutes();
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

    const locationText = currentLocation 
      ? `User's current location: lat=${currentLocation.lat}, lng=${currentLocation.lng} (Permission: GRANTED)
         If "from" location is missing, infer the nearest major city/town from these coordinates.
         User has enabled location sharing for better travel suggestions.` 
      : locationPermission === 'denied' 
        ? "User location: UNAVAILABLE (Permission denied by user. Cannot infer departure location automatically.)"
        : "User location: UNAVAILABLE (Permission not granted. Cannot infer departure location automatically.)";

    const prompt = `
You are Yatri AI, an intelligent assistant for Nepal's premier bus booking service.

Current Context:
- ${locationText}
- Today's date: ${todayISO} (Nepal Time, GMT+5:45)
- Current time: ${todayNepal.toLocaleTimeString('en-US', { timeZone: 'Asia/Kathmandu' })}

Your task: Analyze the user query and extract booking information OR classify as general query.

SPECIAL HANDLING FOR LOCATION QUERIES:
- If user asks "where are we?", "what's my location?", "where am I?" etc.:
  ${currentLocation 
    ? `→ Use coordinates lat=${currentLocation.lat}, lng=${currentLocation.lng} to identify the nearest city/area and provide a helpful response about their current location.`
    : '→ Respond that location access is needed and guide them to enable it.'
  }

INTENT CLASSIFICATION:
- BOOK_TICKET: User wants to search/book bus tickets
- GENERAL_QUERY: User asking about bus services, facilities, locations, current location, etc.

CRITICAL RULES FOR DATE PARSING:
- "today" → ${todayISO}
- "tomorrow" → ${tomorrowISO}
- "day after tomorrow" → add 2 days to ${todayISO}
- "next week" → add 7 days to ${todayISO}
- "this weekend" → upcoming Saturday
- Specific dates (e.g., "25th December"): assume current year if still upcoming, otherwise next year
- Always return in YYYY-MM-DD format
- If no date mentioned, set to null

Rules for Fields (BOOK_TICKET only):
- pendingPrompt: If user enters from, to, date, passengers, extras but hasn't confirmed booking, set to a prompt like "Do you want to book this?" If user has not provided enough info to search, set it to something like "How many people are you?" or "Where are you traveling to?" or "When do you want to travel?" based on missing info. If user has provided enough info to search, confirm the booking by typing Yes.
- from: Origin city/stop. If not specified, infer from user's current location if available, otherwise null.
- to: Destination city/stop. If not specified, null.
- date: Must be normalized to YYYY-MM-DD using today's date context.
- passengers: Number of passengers. Default = 1.
- extras: Array of preferences (food, drinks, seat type, bus type, etc.). If none, set to null.
- distance: Estimated road travel distance between "from" and "to" cities in Nepal, expressed as a string in kilometers (e.g., "200 km"). 
  Use your knowledge of Nepal geography and major bus routes. Common distances:
  * Kathmandu to Pokhara: ~200 km
  * Kathmandu to Chitwan: ~150 km  
  * Kathmandu to Butwal: ~280 km
  * Pokhara to Chitwan: ~120 km
  If both from/to are missing, set to null. If only one location is provided, estimate based on common routes.
- originalQuery: Always echo full user query.
- ai_suggestion: 
   - Only ask follow-up questions if BOTH from AND to are missing, or if the query is too vague
   - If user has provided from OR to, proceed with the search without asking more questions
   - If user provides clear booking intent with route information, set ai_suggestion to null
   - Examples of when NOT to ask questions: "Book Kathmandu to Pokhara", "I want to go to Pokhara", "Bus to Chitwan tomorrow"
   - Only ask when query is very vague like: "I want to book bus", "Travel somewhere"

instead of asking somthing like do you want to book this? we can ask user to confirm your booking by typing "Which Bus you like to book?" or "Please enter the bus name you want to book?"
Rules for GENERAL_QUERY:
- from, to, date, passengers, extras, distance,pendingPrompt, ai_suggestion  → always null.

User Query: "${submissionText}"
`;

  const existingQuestsionAnswers = [...allQuestionsAnswers]
  existingQuestsionAnswers.push(submissionText)
  setAllQuestionsAnswers(existingQuestsionAnswers);
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
        {
          "contents": [
            {
              "role": "user",
              "parts": [
                { "text": prompt }
              ]
            }
          ],
          "generationConfig": {
            "responseMimeType": "application/json",
            "responseSchema": {
              "type": "OBJECT",
              "properties": {
                "intent": { "type": "STRING", "enum": ["BOOK_TICKET", "GENERAL_QUERY"] },
                "from": { "type": "STRING", "nullable": true },
                "to": { "type": "STRING", "nullable": true },
                "date": { "type": "STRING", "nullable": true },
                "passengers": { "type": "NUMBER", "nullable": true },
                "extras": { "type": "ARRAY", "items": { "type": "STRING" }, "nullable": true },
                "distance": { "type": "STRING", "nullable": true },
                "originalQuery": { "type": "STRING" },
                "pendingPrompt": { "type": "STRING" },
                "ai_suggestion": { "type": "STRING", "nullable": true }
              },
              "required": ["intent", "originalQuery"]
            }
          }
        },
        {
          headers: {
            "X-goog-api-key": API_KEY
          }
        }
      );
  
      const result = response.data.candidates[0].content.parts[0].text;
      const parsedResult = JSON.parse(result);
      setAiOutput(parsedResult);
      setPromptPendingReply(parsedResult.pendingPrompt || '');
      
      if (!query) {
        setAiInput("");
      }
      
      return parsedResult;
    } catch (err: any) {
      setError("Failed to process your request. Please try again.");
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

  return (
    <div className="relative z-10 w-full max-w-6xl mx-auto px-4 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pt-4 pb-24">
        {generalQueryAnswer && (
          <div className="relative mt-6 bg-white/20 backdrop-blur-sm rounded-lg p-4 md:p-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <button
              className="absolute top-2 right-2 text-white/80 hover:text-white/40"
              onClick={() => setGeneralQueryAnswer("")}
            >
              <CircleX className="w-5 h-5" />
            </button>
            <p className="text-white">{generalQueryAnswer}</p>
          </div>
        )}

        {error && (
          <div className="relative mt-6 bg-red-500/20 backdrop-blur-sm rounded-lg p-4 md:p-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <button
              className="absolute top-2 right-2 text-white/80 hover:text-white/40"
              onClick={clearError}
            >
              <CircleX className="w-5 h-5" />
            </button>
            <div className="pr-8">
              <p className="text-white mb-3">{error}</p>
              {aiOutput?.originalQuery && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={retryLastQuery}
                  disabled={isLoading}
                  className="bg-white/10 text-white border-white/40 hover:bg-white/20"
                >
                  Try Again
                </Button>
              )}
            </div>
          </div>
        )}

        {showLocationPrompt && (
          <div className="relative mt-6 bg-blue-500/20 backdrop-blur-sm rounded-lg p-4 md:p-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <button
              className="absolute top-2 right-2 text-white/80 hover:text-white/40"
              onClick={dismissLocationPrompt}
            >
              <CircleX className="w-5 h-5" />
            </button>
            <div className="pr-8">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">Enable Location Access</h3>
                  <p className="text-white/80 mb-3">
                    Allow location access to get better travel suggestions and automatically detect your departure location.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={requestLocationPermission}
                      disabled={isRequestingLocation}
                      className="bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                    >
                      {isRequestingLocation ? "Requesting..." : "Enable Location"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={dismissLocationPrompt}
                      className="bg-white/10 text-white border-white/40 hover:bg-white/20"
                    >
                      Maybe Later
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {aiOutput?.ai_suggestion && (
          <div className="relative mt-6 bg-blue-500/20 backdrop-blur-sm rounded-lg p-4 md:p-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <button
              className="absolute top-2 right-2 text-white/80 hover:text-white/40"
              onClick={clearAISuggestion}
            >
              <CircleX className="w-5 h-5" />
            </button>
            <p className="text-white font-medium">💡 {aiOutput.ai_suggestion}</p>
          </div>
        )}

        {isLoading && (
          <div className="relative mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4 md:p-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              <span className="ml-2 text-white">Processing request...</span>
            </div>
          </div>
        )}

        {results.length > 0 && !isLoading && (
          <div className="relative mt-6 bg-white/20 backdrop-blur-sm rounded-lg p-4 md:p-6 space-y-4 animate-in fade-in-50 slide-in-from-bottom-4 duration-300">
            <button
              className="absolute top-2 right-2 text-white/80 hover:text-white/40"
              onClick={() => setResults([])}
            >
              <CircleX className="w-5 h-5" />
            </button>
            {results.map((route, index) => (
              <BusSearchCard
                distance={aiOutput?.distance || "N/A"}
                key={`route-${index}-${route.bus?.[0]?.busNumber || 'unknown'}`}
                {...route}
                from={aiOutput?.from || "N/A"}
                to={aiOutput?.to || "N/A"}
              />
            ))}
          </div>
        )}

     {promptPendingReply && <div className="mt-4 bg-white text-black m-4 p-4 w-full italic rounded-lg">
      {promptPendingReply}
        </div>  }

      {allQuestionsAnswers.length > 0 && (

          <ul className="list-disc list-inside space-y-1">
            {allQuestionsAnswers.map((qa, index) => (
                      <div key={index} className="mt-4 bg-white text-black m-4 p-4 w-full rounded-lg">
                      <li >{qa}</li>
                      </div>
            ))}
          </ul>
      )}
        {!isLoading && results.length === 0 && aiOutput?.intent === 'BOOK_TICKET' && !error && (aiOutput?.from || aiOutput?.to) && (
          <div className="relative mt-6 bg-yellow-500/20 backdrop-blur-sm rounded-lg p-4 md:p-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <button
              className="absolute top-2 right-2 text-white/80 hover:text-white/40"
              onClick={() => setAiOutput(null)}
            >
              <CircleX className="w-5 h-5" />
            </button>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <svg className="w-5 h-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">No buses found</h3>
                <p className="text-white/80">
                  We couldn't find any bus routes {aiOutput?.from && `from ${aiOutput.from}`}{aiOutput?.from && aiOutput?.to && ' '}
                  {aiOutput?.to && `to ${aiOutput.to}`}. Try searching for a different route or check with us later for new routes.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="pb-12 md:px-8 lg:px-12">
        <div className="mb-4 flex flex-wrap justify-center gap-3">
          {chips.map((chip, index) => (
            <Button
              key={index}
              variant="outline"
              disabled={isLoading}
              className={`bg-white/20 backdrop-blur-sm text-white border-white/40 hover:bg-white/30 hover:border-white/60 rounded-full px-5 py-2 text-sm md:text-base transition-all duration-500 ease-out disabled:opacity-50 ${chipsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onClick={() => handleChipClick(chip)}
            >
              {chip}
            </Button>
          ))}
        </div>

        {locationPermission !== 'prompt' && (
          <div className="mb-2 flex justify-center">
            <div className="flex items-center gap-2 text-xs text-white/60">
              {locationPermission === 'granted' && currentLocation ? (
                <>
                  <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>Location enabled: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}</span>
                </>
              ) : locationPermission === 'denied' ? (
                <>
                  <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Location disabled - manual location entry required</span>
                </>
              ) : locationPermission === 'unsupported' ? (
                <>
                  <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>Location not supported by your browser</span>
                </>
              ) : null}
            </div>
          </div>
        )}

        <div className="rounded-lg flex items-center justify-center">
          <div className="relative w-full max-w-3xl">
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
        </div>
      </div>
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