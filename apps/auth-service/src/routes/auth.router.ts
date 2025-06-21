import express, { Router } from 'express';
import { loginUser, resetUserPassword, userForgotPassword, userRegistration, verifyUser } from '../controller/auth.controller';
import { verifyForgetPassswordOtp } from '../utils/auth.helper';

const router: Router = express.Router();

router.post('/user-registration', userRegistration);
router.post('/verify-user', verifyUser); // Assuming you have a verifyUser function in your controller
router.post("/login-user", loginUser);
router.post('/forgot-password-user',userForgotPassword)
router.post('/reset-password-user', resetUserPassword);
router.post('/verify-forgot-password-user', verifyForgetPassswordOtp);

export default router;
