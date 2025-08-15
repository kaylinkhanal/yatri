// yatri/server/src/models/stops.js

import mongoose from 'mongoose';

const stopSchema = new mongoose.Schema({
    stopName: {
        type: String,
        required: true,
        unique: true,
    },
    stopCode: {
        type: String,
        required: true,
        unique: true,
    },
    location: {
        address: {
            type: String,
            required: true,
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0],
        },
        city: {
            type: String,
            required: true,
        },
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active",
    },
    isTerminal: {
        type: Boolean,
        default: false,
    },
    operatingHours: {
        openTime: {
            type: String,
            default: "00:00",
        },
        closeTime: {
            type: String,
            default: "23:59",
        }
    }
}, {
    timestamps: true
});

// Create index for location-based queries
stopSchema.index({ "location.coordinates": "2dsphere" });

const Stop = mongoose.model('Stop', stopSchema);
export default Stop;
