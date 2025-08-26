'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { CircleX, SendHorizonal } from "lucide-react";
import { useEffect, useState } from "react";
import { BusSearchCard } from "./BusSearchCard";

export default function SearchForm() {
  const chips = [
    "Where are we?",
    "Book Pokhara tomorrow from Kathmandu",
    "AC buses?",
    "Pokhara for 3, non-veg food & coke",
  ];
  const [aiInput, setAiInput] = useState("");

  const [results, setResults] = useState([]);
  const [distance, setDistance] = useState(null);
  const [aiOutput, setAiOutput] = useState(null);
  const API_KEY = 'AIzaSyCcyqJvpKGzw9Lv8a7s_rVlwerLR0LR7_s'; // Replace with your actual API key
  
  const fetchRoutes = async () => {
    if (!aiOutput) return; // Stop if no AI output is available
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/routes?stop1=${aiOutput.from || ''}&stop2=${aiOutput.to || ''}`
      );
      setResults(data.routes);
      setDistance(data.distance);
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };
  useEffect(()=>{
    fetchRoutes()
  },[aiOutput])

  const handleAiSubmit = async () => {
    if (!aiInput) {
      console.error('Error: User input is empty.');
      return; // Stop the function if there's no input
    }
  
    const prompt = `You are an AI assistant for a bus ticket booking service called Yatri AI. Your task is to extract booking details or identify general queries from user input and format them into a JSON object.
  
   Date format is YYYY-MM-DD. If the user mentions relative terms like 'day after tomorrow', 'tomorrow', 'next week', 'today', convert them to the appropriate date format based on the current date. For specific dates (e.g., '25th December'), assume the current year for a future date, or the next year if the date has passed in the current year.
    todays date timestamp is ${Date.now()} GMT+5:45. Get the date accordingly.
    Instructions:
    1. Determine the intent of the user's request. It can be BOOK_TICKET if the user is asking to find or book tickets, or GENERAL_QUERY for other types of questions (e.g., about bus features, current location).
    2. If intent is BOOK_TICKET, extract the following:
        * from: The origin city or stop. If not specified, infer from context or leave as null.
        * to: The destination city or stop. If not specified, infer from context or leave as null.
        * date: The desired departure date. Parse relative terms like 'tomorrow', 'next week', 'today' into a YYYY-MM-DD format based on the current date. For specific dates (e.g., '25th December'), assume the current year for a future date, or the next year if the date has passed in the current year. If not specified, leave as null.
        * passengers: The number of passengers. Default to 1 if not specified.
    3. originalQuery: Always include the full, original user input string.
    4. ai_suggestion: If the intent is BOOK_TICKET and either from or date is null, generate a concise follow-up question to ask the user for the missing information. Otherwise, set it to null.
  
    Output Format: JSON object. If a field cannot be extracted for a BOOK_TICKET intent, set its value to null. For GENERAL_QUERY intent, from, to, date, passengers, and ai_suggestion should be null.
  
    Examples:
    User: 'Book me ticket for kathmandu to pokhara'
    Output:
    {
      "intent": "BOOK_TICKET",
      "from": "Kathmandu",
      "to": "Pokhara",
      "date": null,
      "passengers": 1,
      "originalQuery": "Book me ticket for kathmandu to pokhara",
      "ai_suggestion": "When would you like to travel?"
    }
  
    User: 'I want to book ticket for pokhara tomorrow from kathmandu.'
    Output:
    {
      "intent": "BOOK_TICKET",
      "from": "Kathmandu",
      "to": "Pokhara",
      "date": "2025-08-25" ,
      "passengers": 1,
      "originalQuery": "I want to book ticket for pokhara tomorrow from kathmandu.",
      "ai_suggestion": null
    }
  
    User: 'Do we have AC buses?'
    Output:
    {
      "intent": "GENERAL_QUERY",
      "from": null,
      "to": null,
      "date": null,
      "passengers": null,
      "originalQuery": "Do we have AC buses?",
      "ai_suggestion": null
    }
  
    User: 'Book me pokhara bus for 3 people, include me non-veg food and coke for 3 people'
    Output:
    {
      "intent": "BOOK_TICKET",
      "from": null,
      "to": "Pokhara",
      "date": null,
      "passengers": 3,
      "originalQuery": "Book me pokhara bus for 3 people, include me non-veg food and coke for 3 people",
      "ai_suggestion": "From where are you traveling and when would you like to depart?"
    }

    User: ${aiInput}`;
  
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
                "originalQuery": { "type": "STRING" },
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
  
      // The Gemini API response is in a specific structure.
      // The data we want is often nested within the `candidates` array.
      const result = response.data.candidates[0].content.parts[0].text;
     setAiOutput(JSON.parse(result))
      console.log('Successfully received AI response:', result);
      return JSON.parse(result);
    } catch (error) {
      console.error('Error fetching data from the API:', error.response?.data || error.message);
      return null;
    }
  };
  const handleChipClick = (chipText) => {
    // In a real app, you might set the input value,
    // or trigger a search directly based on the chipText.
    console.log(`Chip clicked: ${chipText}`);
    // Example: You could update a state variable to set the input field's value
    // setInputValue(chipText);
  };

  return (
    <div className="relative z-10 w-full max-w-6xl mx-auto px-4 pb-12 md:px-8 lg:px-12">
      {/* AI Search Bar */}
      <div className="rounded-lg p-4 md:p-6 flex items-center justify-center">
        <div className="relative w-full max-w-3xl">
          <Input
            onChange={(e)=> setAiInput(e.target.value)}
            className="w-full h-16 bg-white/90 border-none text-xl text-black placeholder:text-gray-600 pl-6 pr-16 rounded-full shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F6C433]"
            placeholder="Ask Yatri AI"
          />
          <Button
            type="submit"
            size="icon"
            onClick={handleAiSubmit}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-[#F6C433] text-white hover:bg-[#F6C433]/90"
          >
            <SendHorizonal className="h-6 w-6 text-black" />
          </Button>
        </div>
      </div>

      {/* Custom Chips */}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {chips.map((chip, index) => (
          <Button
            key={index}
            variant="outline"
            className="bg-white/20 backdrop-blur-sm text-white border-white/40 hover:bg-white/30 hover:border-white/60 transition-colors duration-200 rounded-full px-5 py-2 text-sm md:text-base"
            onClick={() => handleChipClick(chip)}
          >
            {chip}
          </Button>
        ))}
      </div>

      {results.length > 0 && (
              <div className=" relative mt-6 bg-white/20 backdrop-blur-sm rounded-lg p-4 md:p-6 space-y-4">
                <button
                  className="absolute top-2 right-2 text-white/80 hover:text-white/40"
                  onClick={() => setResults([])}
                >
                  <CircleX className="w-5 h-5" />
                </button>
                {results.map((route, index) => (
                  <BusSearchCard
                  distance={distance}
                    key={index}
                    {...route}
                    from={"test"}
                    to={"Test"}
                  />
                ))}
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