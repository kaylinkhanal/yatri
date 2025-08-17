import express from 'express';
import { getAllStops, addNewStop} from '../controllers/stops.js';
const router = express.Router();


router.get('/stops', getAllStops)
router.post('/stops', addNewStop)




export default router;