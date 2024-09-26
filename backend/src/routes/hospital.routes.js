import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js"; 
import {
    createHospital,
    getAllHospitals,
    getHospitalById,
    updateHospital,
    deleteHospital
} from "../controllers/hospital.controllers.js"; 

const router = Router();


router.route("/createHospital").post(verifyJWT, createHospital)
router.route("/getAllHospitals").get(getAllHospitals);

router.route("/getHospitalById/:id").get(getHospitalById)
router.route("/updateHospital/:id").put(verifyJWT, updateHospital)
router.route("/deleteHospital/:id").delete(verifyJWT, deleteHospital);
  

export default router;
