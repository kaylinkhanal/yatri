import Bus from '../models/bus.js';


const getAllBuses = async (req,res) => {
    const bus = await Bus.find();
    res.status(200).json(bus);
}


const addNewBus = async (req,res) => {
    console.log(req.body)
    const existingPlateNumber = await Bus.exists({ plateNumber: req.body.plateNumber });
        if(existingPlateNumber) {
            return res.status(400).json({ message: "Plate Number already exists" });
        }
    await Bus.create(req.body)
    res.status(201).json({
        message: "Bus added successfully",
    });
}


export { getAllBuses, addNewBus };


