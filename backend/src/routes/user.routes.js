import {Router} from "express";
import {verifyJWT} from "../middlewares/auth.middlewares.js"

import {
    registerUser,
    loginUser,
    logoutUser,
    sendPaymentInfo,
    createBedReservation
} from "../controllers/user.controllers.js"

import {
    admitPatient,
    getLiveBedCount,
    dischargePatient
} from "../controllers/redis.controller.js"

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logoutUser)

router.route("/protected-route").get(verifyJWT,(req,res)=>{return res.status(200).json();})

router.route("/send-payment-info").post(verifyJWT,sendPaymentInfo)
router.route("/create-bed-reservation").post(verifyJWT,createBedReservation)

router.route("/admit/:hospitalId").post(admitPatient)
router.route("/discharge/:hospitalId").post(dischargePatient)
router.route("/live-count/:hospitalId").get(getLiveBedCount)

export default router

    