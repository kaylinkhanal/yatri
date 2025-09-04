// yatri/server/src/routes/booking.js

import express from 'express';
import { createBooking, deleteBooking, getAllBookings, getBookingById, updateBookingStatus } from '../controllers/booking.js';

const router = express.Router();

router.post('/', createBooking);

router.get('/', getAllBookings);

router.patch('/:id/status', updateBookingStatus);


router.get('/:id', getBookingById);



router.delete('/:id', deleteBooking);

export default router;