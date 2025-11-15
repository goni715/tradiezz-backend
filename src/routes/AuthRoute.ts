import express from "express";
import { emailValidationSchema, forgotPasswordSetNewPassSchema, loginValidationSchema, verifyOtpValidationSchema } from "../validation/auth.validation";
import validationMiddleware from "../middlewares/validationMiddleware";
import AuthController from "../controllers/AuthController";
import { registerEmployerValidationSchema } from "../validation/employer.validation";

const router = express.Router();


router.post(
  "/register-employer",
  validationMiddleware(registerEmployerValidationSchema),
  AuthController.registerEmployer
);
router.post(
  "/verify-email",
  validationMiddleware(verifyOtpValidationSchema),
  AuthController.verifyEmail
);
router.post(
  "/resend-verification-email",
  validationMiddleware(emailValidationSchema),
  AuthController.resendVerificationEmail
);
router.post(
  "/login-user",
  validationMiddleware(loginValidationSchema),
  AuthController.loginUser
);
router.post(
  "/login-admin",
  validationMiddleware(loginValidationSchema),
  AuthController.loginAdmin
);


//forgot password
// step-01
router.post(
  "/forgot-password-send-otp",
  validationMiddleware(emailValidationSchema),
  AuthController.forgotPasswordSendOtp
);
// step-02
router.post(
  "/forgot-password-verify-otp",
  validationMiddleware(verifyOtpValidationSchema),
  AuthController.forgotPasswordVerifyOtp
);
// step-03
router.post(
  "/forgot-password-set-new-password",
  validationMiddleware(forgotPasswordSetNewPassSchema),
  AuthController.forgotPasswordSetNewPassword
);


const AuthRoute = router;
export default AuthRoute;
