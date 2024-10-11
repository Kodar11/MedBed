import {Router} from "express";
import {verifyJWT} from "../middlewares/auth.middlewares.js"

import {
    registerUser,
    loginUser,
    logoutUser,
    sendPaymentInfoToHospital
} from "../controllers/user.controllers.js"

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logoutUser)

router.route("/protected-route").get(verifyJWT,(req,res)=>{return res.status(200).json();})

router.route("/send-info-to-hospital").post(verifyJWT,sendPaymentInfoToHospital)

export default router

    