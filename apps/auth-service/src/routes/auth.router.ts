import express, { Router } from 'express';
import {
    getUser,
  loginUser,
  refereshToken,
  resetUserPassword,
  userForgotPassword,
  userRegistration,
  verifyUser,
  verifyUserForgotPassword,
} from '../controller/auth.controller';
import isAuthenticated from 'packages/middleware/isAuthenticated';


const router: Router = express.Router();

router.post('/user-registration', userRegistration);
router.post('/verify-user', verifyUser); // Assuming you have a verifyUser function in your controller
router.post("/login-user", loginUser);

router.post('/forgot-password-user',userForgotPassword);

router.post('/refresh-token-user', refereshToken);

router.get('/logged-in-user', isAuthenticated, getUser);

router.post('/reset-password-user', resetUserPassword);

router.post('/verify-forgot-password-user', verifyUserForgotPassword);

export default router;
