import User from '../models/user.js';

const getAllUsers = async (req,res) => {
    const user = await User.find();
    res.status(200).json(user);
}



const registerNewUser = async (req,res) => {
    const user = await User.create(req.body);
    res.status(200).json(user);
}



export { getAllUsers,registerNewUser }