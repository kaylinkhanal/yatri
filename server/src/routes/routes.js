import express from 'express';
import { getAllRoutes, addNewRoutes , assignBusToRoute} from '../controllers/routes.js';
const router = express.Router();


router.get('/routes', getAllRoutes)
router.post('/routes', addNewRoutes)
router.patch('/routes/:id/bus', assignBusToRoute)




export default router;