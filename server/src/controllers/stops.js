import Stop from '../models/stops.js';


const getAllStops = async (req,res) => {
    const stop = await Stop.find();
    res.status(200).json(stop);
}


const addNewStop  = async (req,res) => {
    await Stop.create(req.body);
    res.status(201).json({
        message: "Stop added successfully",
    });
}


export { getAllStops, addNewStop };


