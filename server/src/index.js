import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

import userRoutes from './routes/user.js';
import busRoutes from './routes/bus.js';
import stopRoutes from './routes/stops.js';
import routeRoutes from './routes/routes.js';
import bookingRoutes from './routes/booking.js';

import connect from './db/connect.js';

const app = express();

app.use(cors())
app.use(express.json());
app.use('/uploads', express.static('uploads'));

import Stop from './models/stops.js';
import Route from './models/routes.js';


connect();

const PORT = process.env.PORT || 8000;


app.use(userRoutes)
app.use(busRoutes)
app.use(stopRoutes)
app.use(routeRoutes)
app.use('/booking',bookingRoutes);

app.listen(PORT, ()=> {
    console.log(`Server is running on http://localhost:${PORT}`);
})

