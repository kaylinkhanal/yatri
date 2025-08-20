import Route from '../models/routes.js';

const getAllRoutes = async (req,res) => {
    const stop = await Route.find();
    res.status(200).json(stop);
}


const addNewRoutes  = async (req,res) => {
    await Route.create(req.body);
    res.status(201).json({
        message: "Routes added successfully",
    });
}




export {  getAllRoutes, addNewRoutes};


