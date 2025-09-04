// yatri/server/src/models/booking.js

import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    bus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bus',
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    pickupStop : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stop',
    },
    dropStop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stop',
    },
    route: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
    },
    seats: {
        type: [Number],
    },
    journeyDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending',
    },
    price: {
        type: Number,
        min: 0,
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid', 'refunded'],
        default: 'unpaid',
    },
    // ticketNumber: {
    //     type: String,
    // },
 },
 {
     timestamps: true,
 }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;