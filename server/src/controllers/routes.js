import Route from '../models/routes.js';
import Stop from '../models/stops.js';
import haversine from 'haversine-distance'

const getAllRoutes = async (req,res) => {
    if(req.query.stop1 && req.query.stop2) {
            const stop1= await   Stop.findOne({stopName: req.query.stop1.toLowerCase()})
            const stop2= await   Stop.findOne({stopName: req.query.stop2.toLowerCase()})
                if(!stop1 || !stop2) {
                    return res.status(404).json({message: "One or both stops not found"});
                }
            const [stop1lat, stop1lon]  = stop1.location.coordinates;
            const [stop2lat, stop2lon]  = stop2.location.coordinates;
            const distance = haversine(
                { latitude: stop1lat, longitude: stop1lon },
                { latitude: stop2lat, longitude: stop2lon }
            );


             const routes = await Route.find({
               stops: { $all: [stop1._id, stop2._id] }
             }).populate('stops', 'stopName')
             .populate('bus','busNumber image totalSeats occupiedSeats busType farePerKm')
             return res.status(200).json({routes,distance: distance/1000});
        
    }
    const routes = await Route.find();
    res.status(200).json({routes});
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


