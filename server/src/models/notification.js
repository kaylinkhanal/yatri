
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String  },
    type: { type: String, enum: ['info', 'warning', 'alert'], default: 'info' },
    link: { type: String },
},
{ timestamps: true}
);


const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;