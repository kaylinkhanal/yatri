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

const deleteStop  = async (req,res) => {
    await Stop.deleteOne({_id : req.query.id});
    res.status(201).json({
        message: "Stop deleted",
    });
}


export { getAllStops, addNewStop, deleteStop};


