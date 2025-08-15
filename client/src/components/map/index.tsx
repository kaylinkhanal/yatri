"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from 'leaflet';

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import axios from "axios";
import { useState } from "react";

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
    const handleChange =async (e) => {
        const {data} = await axios.get(`https://api.geoapify.com/v1/geocode/autocomplete?text=${e.target.value}%20mall&apiKey=ca280bd166fe4bad980b29d1c675409e&filter=countrycode:np`)
        setPlacesSearchResult(data)
    }
    const [stopLists, setStopLists] = useState([])
    const [searchTargetCoords, setSearchTargetCoords] = useState(posix)
    return (
        <>
        {JSON.stringify(searchTargetCoords)}
             <MapContainer
            center={searchTargetCoords}
            zoom={zoom}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
        >
            <div className="absolute top-5 left-12 z-10 bg-white p-2 rounded shadow z-1000">
               <input onChange={handleChange}/>
               {placesSearchResult?.features?.length > 0 && placesSearchResult.features.map((item)=>{
                return (
                    <ul>
                        <li key={item.properties.place_id} onClick={()=>setSearchTargetCoords(item.geometry.coordinates.reverse())} className="cursor-pointer hover:bg-gray-100 p-1">
                           {item.properties.formatted}
                        </li>
                    </ul>
                )
               })}
            </div>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={searchTargetCoords} draggable={true}>
                <Popup>Hey ! I study here</Popup>
            </Marker>
        </MapContainer>
        </>
   
    )
}

export default Map