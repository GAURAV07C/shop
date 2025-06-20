import express, { Router } from 'express';
import { userRegistration, verifyUser } from '../controller/auth.controller';

const router: Router = express.Router();

router.post('/user-registration', userRegistration);
router.post('/verify-user', verifyUser); // Assuming you have a verifyUser function in your controller

export default router;
