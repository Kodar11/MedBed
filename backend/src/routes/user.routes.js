import {Router} from "express";
import {verifyJWT} from "../middlewares/auth.middlewares.js"

import {
    registerUser,
    loginUser,
    logoutUser,
    sendPaymentInfo,
    createBedReservation,
    getHospitalReservationInfo,
    searchHospitals,
    getAvailableBeds,
    handleIncomingNotifications
} from "../controllers/user.controllers.js"


const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logoutUser)

router.route("/protected-route").get(verifyJWT,(req,res)=>{return res.status(200).json();})

router.route("/get-payment-info-user/:id").get(sendPaymentInfo)
router.route("/get-payment-info-hospital/:hospitalId").get(getHospitalReservationInfo)
router.route("/create-bed-reservation").post(verifyJWT,createBedReservation)

router.route("/notify").post(handleIncomingNotifications)
router.route("/getAvailbleBeds").get(getAvailableBeds)

router.route("/search-hospital").get(searchHospitals)

export default router