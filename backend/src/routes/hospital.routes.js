import multer from 'multer';

// const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});

const upload = multer({ storage: storage }).fields([
  { name: 'mainImage', maxCount: 1 },   
  { name: 'subImages', maxCount: 10 }    
]);



import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js"; 
import {
    createHospital,
    getAllHospitals,
    getHospitalById,
    updateHospital,
    deleteHospital,
    loginHospital,
    checkInReservation,
    updateBedCount
} from "../controllers/hospital.controllers.js"; 

const router = Router();

router.route('/createHospital')
    .post(upload, createHospital); 


router.route("/getAllHospitals")
    .get(getAllHospitals);


router.route("/getHospitalById")
    .get(getHospitalById);


router.route("/updateHospital/:id")
    .put(updateHospital); 


router.route("/deleteHospital")
    .delete(deleteHospital);
    

router.route("/login").post(loginHospital);

router.route('/checkIn-reservation').post(checkInReservation)
router.route('/update-bed-count').post(updateBedCount)

export default router;  