import express from 'express';
import { getAllStops, addNewStop ,deleteStop} from '../controllers/stops.js';
const router = express.Router();


router.get('/stops', getAllStops)
router.post('/stops', addNewStop)
router.delete('/delete', deleteStop)



export default router;