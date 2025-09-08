import express from 'express';
import { getNotificationsByUserId} from '../controllers/notifications.js';
const router = express.Router();


router.get('/notifications', getNotificationsByUserId)



export default router;