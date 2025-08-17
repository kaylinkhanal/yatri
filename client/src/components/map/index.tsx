"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from 'leaflet';
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import L from "leaflet";
import { toast } from "sonner";
import { GlobeIcon, MapPinIcon, Navigation, TrashIcon } from "lucide-react";

interface MapProps {
    posix: LatLngExpression | LatLngTuple,
    zoom?: number,
}

const defaults = {
  zoom: 13,
}

const stopIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const Map = (Map: MapProps) => {
    const { zoom = defaults.zoom, posix } = Map
    const [placesSearchResult, setPlacesSearchResult] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [stopLists, setStopLists] = useState<any[]>([]);
  const [newStopAssign, setNewStopAssign] = useState(false);
  const [searchTargetCoords, setSearchTargetCoords] = useState(posix);
  const [stop, setStop] = useState("");

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      try {
                const { data } = await axios.get(`https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&apiKey=ca280bd166fe4bad980b29d1c675409e&filter=countrycode:np`);
        setPlacesSearchResult(data.features);
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    } else {
      setPlacesSearchResult([]);
    }
  };

    const handleDragEnd = (e) => {
    setSearchTargetCoords(Object.values(e.target._latlng));
  };

  const fetchStopLists = async () => {
    try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/stops`);
      setStopLists(data);
    } catch (error) {
      console.error("Error fetching stop lists:", error);
    }
    }

    useEffect(()=>{
    fetchStopLists();
    },[])

    const handleSelectPlace = (item) => {
        setSearchTargetCoords([item.geometry.coordinates[1], item.geometry.coordinates[0]]);
    setPlacesSearchResult([]); // Clear results after selection
    setSearchQuery(item.properties.formatted);
  };

  const handleConfirmStop = async () => {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/stops`,
      {
        stopName: stop,
        location: { coordinates: searchTargetCoords, 
         },
      }
    );
    setNewStopAssign(false);
    setStop("");
    setSearchTargetCoords(posix);
    fetchStopLists();
  };

  const handleCancelStop = () => {
    setNewStopAssign(false);
    setSearchTargetCoords(posix);
    setStop("");
  };

  

  useEffect(() => {
     // A better check to see if the position has changed from the initial posix
    const hasChanged =JSON.stringify
    (searchTargetCoords) !== JSON.stringify
    (posix);
    setNewStopAssign(hasChanged);
  }, [searchTargetCoords, posix]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/delete`, {
        params: { id: id },
      });
      fetchStopLists();
    } catch (err) {
      console.log(err);
      toast(`${err?.response?.status} - ${err?.response?.statusText}`, {
        position: "top-right",
      });
    }
  };

  return (
    <div className="relative h-screen w-full">
      
      {newStopAssign && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] bg-white p-5 rounded-xl shadow-2xl border border-gray-200 flex flex-col gap-3 w-[350px]">
          <h3 className="text-lg font-semibold text-gray-900">
            Assign New Stop
          </h3>
          <p className="text-sm text-gray-600">
            Please give this stop a name before saving.
          </p>
          <Input
            placeholder="Enter Stop/stop name"
            value={stop}
            onChange={(e) => setStop(e.target.value)}
          />
          <div className="flex gap-2 justify-end mt-2">
            <Button onClick={handleCancelStop} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleConfirmStop} disabled={!stop}>
              Confirm Stop
            </Button>
          </div>
        </div>
      )}

      <MapContainer
        center={searchTargetCoords}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        className="relative z-0"
      >
       
        <div className="absolute top-2 left-16 z-[1000] bg-white p-3 rounded-xl shadow-lg w-72">
          <Input
            onChange={handleChange}
            value={searchQuery}
            placeholder=" Search a location..."
            className="w-full"
          />
          {placesSearchResult?.length > 0 && (
            <ul className="mt-2 max-h-60 overflow-y-auto border rounded-md shadow-sm bg-white">
              {placesSearchResult.map((item) => (
                <li
                  key={item.properties.place_id}
                  onClick={() => handleSelectPlace(item)}
                  className="cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-colors duration-150 text-sm"
                >
                  {item.properties.formatted}
                </li>
              ))}
            </ul>
          )}
        </div>
        <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          eventHandlers={{
            dragend: handleDragEnd,
          }}
          position={searchTargetCoords}
          draggable={true}
        >
          <Popup>📍Drag me to set a new stop location</Popup>
        </Marker>
       
        {stopLists.map((stop) => (
          <Marker
            key={stop.id}
            position={[
              stop.location.coordinates[0],
              stop.location.coordinates[1],
            ]}
            icon={stopIcon}
          >
            <Popup>
            
              <div className="mb-2 border-b pb-2">
                <h3 className="font-bold text-lg text-gray-800 truncate">
                  {stop.stopName}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${
                      stop.status === "Active"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  ></span>
                  <span className="text-xs font-medium text-gray-500 capitalize">
                    {stop.status || "unknown"}
                  </span>
                </div>
              </div>

             
              <div className="mb-3 space-y-1">
                <div className="flex items-center gap-1">
                  <MapPinIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-xs text-gray-600">
                    {stop.city || "Unknown city"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <GlobeIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-xs text-gray-600">
                    Lat: {stop.location.coordinates[1].toFixed(6)}, Lon:{" "}
                    {stop.location.coordinates[0].toFixed(6)}
                  </span>
                </div>
              </div>

              {/* Delete button */}
              <button
                className="w-full py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                onClick={() => handleDelete(stop._id)}
              >
                <TrashIcon className="w-4 h-4" />
                <span>Delete Stop</span>
              </button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;