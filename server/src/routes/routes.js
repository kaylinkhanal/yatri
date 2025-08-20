import express from 'express';
import { getAllRoutes, addNewRoutes} from '../controllers/routes.js';
const router = express.Router();


router.get('/routes', getAllRoutes)
router.post('/routes', addNewRoutes)




export default router;