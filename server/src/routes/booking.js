// yatri/server/src/routes/booking.js

import express from 'express';
import { createBooking, deleteBooking, getAllBookings, getBookingById, updateBookingStatus } from '../controllers/booking';

const router = express.Router();

router.post('/', createBooking);

router.get('/', getAllBookings);

router.get('/:id', getBookingById);

router.put('/:id', updateBookingStatus);

router.delete('/:id', deleteBooking);

export default router;