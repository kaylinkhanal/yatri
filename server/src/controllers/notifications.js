import Notification from "../models/notification.js";

const getNotificationsByUserId = async (req,res) => {
    console.log("helo")
    const data = await Notification.find({receiver: req.query.receiverId});
    res.status(200).json(data);
}


export { getNotificationsByUserId};


