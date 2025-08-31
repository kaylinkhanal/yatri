import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';



const getAllUsers = async (req,res) => {
    const user = await User.find();
    res.status(200).json(user);
}



const loginUser = async (req,res) => {
    // step 1: check if phone number exists in the db
    const existingUser = await User.findOne({ phoneNumber: req.body.phoneNumber });
        //  no ---> error message "Phone number doesn't exist"
        if(!existingUser) {
            return res.status(404).json({ message: "Phone number doesn't exist" });
        }
        //  yes ---> proceed to step 2
    // step 2 check if passeword matches
    const isMatched =  await bcrypt.compare(req.body.password, existingUser.password)
   
    // no: return error message "Invalid Password"
        if(!isMatched) {
            return res.status(401).json({ message: "Invalid Password" });
        }

    // yes: proceed to step 3
 
    // step 3: generate a jwt token
    const token = jwt.sign({phoneNumber: req.body.phoneNumber, role: existingUser.role}, process.env.JWT_SECRET);
    return res.json({ message: "Login successful", token, user: existingUser, isLoggedIn: true });
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
     sendEmail(req.body.email,  "<h1> Welcome to our example </h1>")
     return res.json({ message: "User registered successfully" , user: req.body });
       
}



export { getAllUsers,registerNewUser ,loginUser}


