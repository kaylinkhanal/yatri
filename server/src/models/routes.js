// yatri/server/src/models/stops.js

import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema({
    routesName: {
        type: String,
        required: true,
    },
    stopsCoords: {
        type: Array,
    },
    startStop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stop',
    },
    endStop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stop',
    },
    bus: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bus',
    }],
    stops: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stop',
    }],
  
});



const Route = mongoose.model('Route', routeSchema);
export default Route;
