import express from 'express';
import { addNewBus, getAllBuses} from '../controllers/bus.js';
const router = express.Router();


router.get('/bus', getAllBuses)
router.post('/bus', addNewBus)




export default router;