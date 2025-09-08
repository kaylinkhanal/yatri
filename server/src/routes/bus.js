import express from 'express';
import { addNewBus, getAllBuses ,updateBusDriver} from '../controllers/bus.js';
const router = express.Router();
import multer from 'multer';
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname  )
    }
  })
  
  const upload = multer({ storage: storage })

router.get('/bus', getAllBuses)
router.post('/bus',upload.single('image'),  addNewBus)
router.patch('/bus/:busId/assign-driver', updateBusDriver )




export default router;