import { Router } from "express";
import { storeEndLocation,getLocationById } from '../controllers/direction.controllers.js';

const router = Router();

router.route('/store-end-location').post(storeEndLocation);
router.route('/locations/:id').get(getLocationById);

export default router;