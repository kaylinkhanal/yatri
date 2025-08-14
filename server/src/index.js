import express from 'express';
import userRoutes from './routes/user.js';
import busRoutes from './routes/bus.js';

import cors from 'cors';

const app = express();
app.use(cors())
app.use(express.json());
import dotenv from 'dotenv';
import connect from './db/connect.js';
app.use('/uploads', express.static('uploads'))

connect()
dotenv.config()
const PORT = process.env.PORT || 8000;


app.use(userRoutes)
app.use(busRoutes)

app.listen(PORT, ()=> {
    console.log(`Server is running on http://localhost:${PORT}`);
})

