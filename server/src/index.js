import dotenv from 'dotenv';
dotenv.config();
import { Server } from 'socket.io';
import express from 'express';
import cors from 'cors';
import { createServer } from 'node:http';
import userRoutes from './routes/user.js';
import busRoutes from './routes/bus.js';
import stopRoutes from './routes/stops.js';
import routeRoutes from './routes/routes.js';
import bookingRoutes from './routes/booking.js';
import notificationsRoutes from './routes/notifications.js';

import connect from './db/connect.js';
import Notification from './models/notification.js';

const app = express();
const server = createServer(app);
const io = new Server(server,{
    cors: {
      origin: "*"
    }
  });
app.use(cors())
app.use(express.json());
app.use('/uploads', express.static('uploads'));



connect();

const PORT = process.env.PORT || 8000;


app.use(userRoutes)
app.use(busRoutes)
app.use(stopRoutes)
app.use(routeRoutes)
app.use('/booking',bookingRoutes);
app.use(notificationsRoutes);




io.on('connection', (socket) => {

    socket.on('message', (message) => {
       io.emit('message', message);
    });


    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});


server.listen(PORT, ()=> {
    console.log(`Server is running on http://localhost:${PORT}`);
})

