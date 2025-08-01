import User from '../models/user.js';
import bcrypt from 'bcrypt';

const getAllUsers = async (req,res) => {
    const user = await User.find();
    res.status(200).json(user);
}



const loginUser = async (req,res) => {
    // step 1: check if phone number exists in the db
        //  no ---> error message "Phone number doesn't exist"
        //  yes ---> proceed to step 2
    // step 2 check if passeword matches

    // no: return error message "Invalid Password"


    // yes: proceed to step 3


    // step 3: generate a jwt token
        // return the message as "Login successful" and the token

     

}



const registerNewUser = async (req,res) => {
    // step 1: check first if the phone number already exists
    const existingUser = await User.exists({ phoneNumber: req.body.phoneNumber });

        // yes: return error message "Phone number already exists"
        if(existingUser) {
            return res.status(400).json({ message: "Phone number already exists" });
        }
        // no : proceed to step 2

    // step 2: 
        // encrypt the password using bcrypt
        req.body.password = await bcrypt.hash(req.body.password, 10)

    // step 3 
        // create the new user now in the db
     await User.create(req.body);
     return res.json({ message: "User registered successfully" , user: req.body });
       
}



export { getAllUsers,registerNewUser ,loginUser}