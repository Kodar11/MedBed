import {Router} from "express";
import { getUserView } from '../controllers/userview.controllers.js';

const router = Router();

router.get('/user/view', getUserView);

export default router;
