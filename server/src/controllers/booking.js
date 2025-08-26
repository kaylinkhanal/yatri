// yatri/server/src/controllers/booking.js

import Booking from "../models/booking";
import Bus from "../models/bus";
import Seat from "../models/seat";
import User from "../models/user.js";

export const createBooking = async (req, res) => {
    try {
        const { userId, busId, seatId, date, time } = req.body;

        const existingBooking = await Booking.findOne ({
            bus: busId,
            seat: seatId,
            date,
            status: "confirmed",
        });

        if (existingBooking){
            return res.status(400).json({ message: "Seat already booked." });
        }

        const booking = new Booking({
            user: userId,
            bus: busId,
            seat: seatId,
            date,
            time,
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
        const bookings = await Booking.find()
            .populate('user', 'name email')
            .populate('bus', 'busNumber')
            .populate('seat', 'seatNumber');

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