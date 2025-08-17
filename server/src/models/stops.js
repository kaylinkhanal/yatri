// yatri/server/src/models/stops.js

import mongoose from 'mongoose';

const stopSchema = new mongoose.Schema({
    stopName: {
        type: String,
        required: true,
        unique: true,
    },
    location: {
        address: {
            type: String,
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0],
        },
        city: {
            type: String,
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
}, {
    timestamps: true
});

// Create index for location-based queries
stopSchema.index({ "location.coordinates": "2dsphere" });

const Stop = mongoose.model('Stop', stopSchema);
export default Stop;
