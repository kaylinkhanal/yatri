import express from 'express';
import { getAllUsers, registerNewUser, loginUser, deleteUserById } from '../controllers/user.js';
const router = express.Router();

router.get('/users', getAllUsers);
router.post('/login', loginUser);
router.post('/register', registerNewUser);
router.delete('/:id', deleteUserById);

export default router;