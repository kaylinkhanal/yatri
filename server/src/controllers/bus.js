import Bus from '../models/bus.js';


const getAllBuses = async (req,res) => {
    const skipCount = (req.query.page-1)*5
    const bus = await Bus.find().skip(skipCount).limit(5)
    const totalCount = await Bus.countDocuments();
    res.status(200).json({bus,totalCount});
}


const updateBusDriver = async (req, res) => {
    const { busId } = req.params;
    const { driverId } = req.body;

    const bus = await Bus.findById(busId);
    if (!bus) {
        return res.status(404).json({ message: "Bus not found" });
    }
    bus.driverId = driverId;
    await bus.save();
    res.status(200).json({ message: "Driver assigned to bus successfully", bus });
}









const addNewBus = async (req,res) => {
    if(!req.file?.filename){
        return res.status(400).json({ message: "Image is required" });
    }
    const existingPlateNumber = await Bus.exists({ plateNumber: req.body.plateNumber });
        if(existingPlateNumber) {
            return res.status(400).json({ message: "Plate Number already exists" });
        }
    req.body.image = req.file.filename;
    req.body.seatLayout = JSON.parse(req.body.seatLayout);
    await Bus.create(req.body)
    res.status(201).json({
        message: "Bus added successfully",
    });
}


export { getAllBuses, addNewBus ,updateBusDriver};


