import Route from '../models/routes.js';
import Stop from '../models/stops.js';

const getAllRoutes = async (req,res) => {
    if(req.query.stop1 && req.query.stop2) {
            const stop1= await   Stop.findOne({stopName: req.query.stop1})
            const stop2= await   Stop.findOne({stopName: req.query.stop2})
                if(!stop1 || !stop2) {
                    return res.status(404).json({message: "One or both stops not found"});
                }
             const includingRoutes = await Route.find({
               stops: { $all: [stop1._id, stop2._id] }
             }).populate('stops', 'stopName stopCoords')
             return res.status(200).json(includingRoutes);
        
    }
    const routes = await Route.find();
    res.status(200).json(routes);
}


const addNewRoutes  = async (req,res) => {
    await Route.create(req.body);
    res.status(201).json({
        message: "Routes added successfully",
    });
}

const assignBusToRoute = async (req,res) => {
   const route = await Route.findById(req.params.id);
    route.bus = req.body.busId;
    await route.save();
    res.status(201).json({
        message: "Bus assigned successfully",
    });
}


export {  getAllRoutes, addNewRoutes,assignBusToRoute};


