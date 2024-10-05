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


router.route("/createHospital").post(createHospital)
router.route("/getAllHospitals").get(getAllHospitals);

router.route("/getHospitalById").get(getHospitalById)
router.route("/updateHospital").put(updateHospital)
router.route("/deleteHospital").delete(deleteHospital);

export default router;
