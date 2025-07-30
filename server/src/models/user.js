import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    firstname : String,
    lastName: String,
    phoneNumber: String,
    email: String,
    password: String,
    role: {
        type: String,
        enum: ['admin', 'user', 'driver'],
        default: 'user'
    },
});

const User = mongoose.model('User', userSchema);
export default User;