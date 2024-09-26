import {Router} from "express";
import {verifyJWT} from "../middlewares/auth.middlewares.js"

import {
    registerUser,
    loginUser,
    logoutUser
} from "../controllers/user.controllers.js"

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,  logoutUser)


export default router

