// yatri/server/src/controllers/booking.js

import Booking from "../models/booking.js";
import Bus from "../models/bus.js";
import Stop from "../models/stops.js";

export const createBooking = async (req, res) => {
    try {
        const { userId, busName, seatId, date, time, from ,to } = req.body;
        const pickupStop =await  Stop.findOne({ stopName: from.toLowerCase() });
        const dropStop = await Stop.findOne({ stopName: to.toLowerCase() });
        const bus = await Bus.find({busNumber: busName});
        const booking = new Booking({
            userId: userId,
            seat: seatId,
            date,
            time,
            bus: bus._id,
            pickupStop: pickupStop._id,
            dropStop: dropStop._id,
        });

        await booking.save();
        res.status(201).json({ message: "Booking created successfully", booking });
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('userId', 'phoneNumber email')
        .populate('pickupStop', 'stopName')
        .populate('dropStop', 'stopName')
        res.status(200).json({ bookings });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('user', 'name email')
            .populate('bus', 'busNumber')
            .populate('seat', 'seatNumber');

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json({ booking });
    } catch (error) {
        console.error("Error fetching booking:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true}
        );

        if (!booking){
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json({ message: "Booking status updated successfully", booking });
    } catch (error) {
        console.error("Error updating booking status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.status(200).json({ message: "Booking deleted successfully" });
        
    } catch (error) {
        console.error("Error deleting booking:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

