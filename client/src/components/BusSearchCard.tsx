
import { useEffect, useState } from "react";
import {
  Clock,
  MapPin,
  Users,
  ChevronDown,
  ChevronUp,
  Bus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import axios from "axios";

interface BusStop {
  stopName: string;
}

interface Bus {
  busNumber: string;
  busType: string;
  image: string;
  occupiedSeats: number;
  farePerKm: number;
  totalSeats: number;
}

interface BusRouteCardProps {
  stops: BusStop[];
  bus: Bus[];
  from: string;
  to: string;
  distance?: string | null;
}
const API_KEY = 'AIzaSyCcyqJvpKGzw9Lv8a7s_rVlwerLR0LR7_s'; 
export const BusSearchCard = ({ stops, bus, from, to,distance }: BusRouteCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const [placesDetails, setPlacesDetails] = useState<any>(null);
  
  // Function to calculate travel time from distance
  const calculateTravelTime = (distanceStr: string | null | undefined): string => {
    if (!distanceStr) return "N/A";
    
    // Extract numeric value from distance string (e.g., "200 km" -> 200)
    const distanceMatch = distanceStr.match(/(\d+)/);
    if (!distanceMatch) return "N/A";
    
    const distanceKm = parseInt(distanceMatch[1]);
    if (distanceKm <= 0) return "N/A";
    
    // Average bus speed in Nepal: ~40-50 km/h (considering stops, traffic, mountain roads)
    const averageSpeed = 45; // km/h
    const travelTimeHours = distanceKm / averageSpeed;
    
    const hours = Math.floor(travelTimeHours);
    const minutes = Math.round((travelTimeHours - hours) * 60);
    
    if (hours === 0) {
      return `${minutes}m`;
    } else if (minutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${minutes}m`;
    }
  };

  const handlePlacesInfo = async(placename: string) => {
      
    const prompt = `give me details of ${placename}`;

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
    // "generationConfig": {
    //   "responseMimeType": "application/json",
    //   "responseSchema": {
    //     "type": "OBJECT",
    //     "properties": {
    //       "intent": { "type": "STRING", "enum": ["BOOK_TICKET", "GENERAL_QUERY"] },
    //       "from": { "type": "STRING", "nullable": true },
    //       "to": { "type": "STRING", "nullable": true },
    //       "date": { "type": "STRING", "nullable": true },
    //       "passengers": { "type": "NUMBER", "nullable": true },
    //       "originalQuery": { "type": "STRING" },
    //       "ai_suggestion": { "type": "STRING", "nullable": true }
    //     },
    //     "required": ["intent", "originalQuery"]
    //   }
    // }
  },
  {
    headers: {
      "X-goog-api-key": API_KEY
    }
  }

);
const result = response.data.candidates[0].content.parts[0].text;
setPlacesDetails(result)

  }
  return (
    <Card className="bg-white/90 shadow-card hover:shadow-elegant transition-all duration-300 border-0 overflow-hidden">
      {/* Clickable Compact View */}
      <div
        className="p-4 cursor-pointer hover:bg-accent/5 transition-colors "
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {bus.map((busValue, index) => (
          <div key={`${busValue.busNumber}-${index}`} className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${busValue.image}`}
                alt="Bus"
                className=" rounded-lg h-10 w-12"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 ">
                  <h3 className="font-semibold text-foreground text-sm">
                    {busValue.busNumber}
                  </h3>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    {busValue.busType}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">8:30</p>
                <p className="text-xs font-semibold text-muted-foreground">
                  {from}
                </p>
              </div>

              <div className="flex flex-col items-center gap-1 px-2">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span className="text-xs">{calculateTravelTime(distance)}</span>
                </div>
                <div className="w-8 h-px bg-border"></div>
              </div>

              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">1:30</p>
                <p className="text-xs font-semibold text-muted-foreground">
                  {to}
                </p>
              </div>

              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-3 w-3" />
                <span className="text-xs">
                  {busValue.totalSeats - busValue.occupiedSeats}
                </span>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-primary">
                  ${busValue.farePerKm}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="bg-[#f4c534] text-white hover:opacity-90"
                  onClick={(e) => e.stopPropagation()}
                >
                  Book
                </Button>
                <div className="p-1">
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
{/* {JSON.stringify(placesDetails)} */}
      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t-2 bg-accent/5 animate-fade-in">
          <div className="pt-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
              <span className="font-medium">Route Details</span>
              <span>{stops.length} stops total</span>
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-2">
              {stops.map((stop, index) => {
                const isFromStop = stop.stopName === from;
                const isToStop = stop.stopName === to;

                return (
                  <div
                    key={`${stop.stopName}-${index}`}
                    onClick={()=> handlePlacesInfo(stop.stopName)}
                    className="flex items-center gap-1 flex-shrink-1"
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`p-1 rounded-full ${
                          isFromStop || isToStop
                            ? "bg-[#f4c534] text-white"
                            : "bg-muted"
                        }`}
                      >
                        <MapPin className="h-3 w-3" />
                      </div>
                      <span
                        className={`text-xs mt-1 max-w-16 text-center ${
                          isFromStop || isToStop
                            ? "text-[#f4c534] font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        {stop.stopName}
                      </span>
                    </div>

                    {index < stops.length - 1 && (
                      <div className="w-6 h-px bg-border mt-[-20px]"></div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm mt-4">
              <div>
                <span className="text-muted-foreground">Distance:</span>
                <span className="ml-2 font-medium">{distance || "N/A"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Stops:</span>
                <span className="ml-2 font-medium">{stops.length}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Seats:</span>
                <span className="ml-2 font-medium">
                  {bus[0].totalSeats - bus[0].occupiedSeats} available
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
