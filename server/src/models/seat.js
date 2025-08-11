
import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    isOccupied: { type: Boolean, default: false },
    seatNumber: { type: String, required: true },
    occupant: { type: String }, // Can be 'driver', 'conductor', 'door-left', etc.
    color: { type: String }, // Optional, for UI purposes
});


const Seat = mongoose.model('Seat', seatSchema);
export default Seat;