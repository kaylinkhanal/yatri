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
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

interface MapProps {
    posix: LatLngExpression | LatLngTuple,
    zoom?: number,
}

const defaults = {
    zoom: 13,
}

const Map = (Map: MapProps) => {
    const { zoom = defaults.zoom, posix } = Map
    const [placesSearchResult, setPlacesSearchResult] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [stopLists, setStopLists] = useState([])
    const [newRouteAssign, setNewRouteAssign] = useState(false)
    const [searchTargetCoords, setSearchTargetCoords] = useState(posix)
    const [route, setRoute] = useState("");

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

    const handleConfirmRoute =async () => {
       const {data} =await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/stops`, {
        stopName: route,
            location: {coordinates: searchTargetCoords},
        })
        setNewRouteAssign(false);
        setRoute("");
        setSearchTargetCoords(posix);
        fetchStopLists();
    };

    const handleCancelRoute = () => {
        setNewRouteAssign(false);
        setSearchTargetCoords(posix);
        setRoute("");
    };

  

    useEffect(() => {
        // A better check to see if the position has changed from the initial posix
        const hasChanged = JSON.stringify(searchTargetCoords) !== JSON.stringify(posix);
        setNewRouteAssign(hasChanged);
    }, [searchTargetCoords, posix]);

    return (
        <div className="relative h-screen w-full">
            {newRouteAssign && (
                <div className="absolute top-5 left-1/2 -translate-x-1/2 z-[1000] bg-white p-4 rounded-lg shadow-xl border border-gray-200 flex flex-col gap-2 min-w-[300px]">
                    <h3 className="text-lg font-semibold text-gray-800">Assign New Route</h3>
                    <p className="text-sm text-gray-600">Please name this new route.</p>
                    <Input
                        placeholder="Enter name of this route"
                        value={route}
                        onChange={(e) => setRoute(e.target.value)}
                    />
                    <div className="flex gap-2 justify-end mt-2">
                        <Button onClick={handleCancelRoute} variant="secondary">Cancel</Button>
                        <Button onClick={handleConfirmRoute} disabled={!route}>Confirm this stop</Button>
                    </div>
                </div>
            )}
            <MapContainer
                center={searchTargetCoords}
                zoom={zoom}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
                className="relative z-0"
            >
                <div className="absolute top-5 left-5 z-[1000] bg-white p-2 rounded-lg shadow-lg max-w-sm">
                    <Input
                        onChange={handleChange}
                        value={searchQuery}
                        placeholder="Search for a place..."
                    />
                    {placesSearchResult?.length > 0 && (
                        <ul className="mt-2 max-h-60 overflow-y-auto">
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
                    <Popup>Hey! This is your location</Popup>
                </Marker>

                {stopLists.map((stop) => (
                    <Marker
                        key={stop.id}
                        position={[stop.location.coordinates[0], stop.location.coordinates[1]]}
                    >
                        <Popup>
                            <div className="text-sm">
                                <strong>{stop.stopName}</strong><br />
                                {stop.location.coordinates[1]}, {stop.location.coordinates[0]}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer> 
        </div>
    );
};

export default Map;