import { Router } from "express";
import { storeEndLocation,getLocationById,checkLocationSet } from '../controllers/direction.controllers.js';

const router = Router();

router.route('/store-end-location').post(storeEndLocation);
router.route('/locations/:id').get(getLocationById);
router.route('/check-location/:id').get(checkLocationSet);

export default router;