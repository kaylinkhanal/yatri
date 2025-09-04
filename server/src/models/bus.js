// yatri/server/src/models/bus.js

import mongoose from 'mongoose';
import Seat from './seat.js';

const busSchema = new mongoose.Schema({
    busNumber: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    image: {
        type: String
    },
    plateNumber: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    totalSeats: {
        type: Number,
        required: true,
    },
    occupiedSeats: {
        type: Number,
        default: 0,
    },
    busType: {
        type: String,
        enum: ["Standard", "Premium", "Luxury"],
        default: "Standard",
    },
    farePerKm: {
        type: Number,
        required: true,
        min: 0,
    },
    canBeRented: {
        type: Boolean,
        default: false,
    },
  

    status: {
        type: String,
        enum: ["Active", "Inactive", "Maintenance"],
        default: "Active",
    },
    currentLocation: {
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0],
        },
    },
    seatLayout: {
        type: [[Seat.schema]], // Array of Seat subdocuments
        default: [],
    }
});

const Bus = mongoose.model('Bus', busSchema); 
export default Bus;