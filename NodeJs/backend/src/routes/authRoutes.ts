import { Router } from "express";
import authController from "../controllers/authController";
import auth from "../middlewares/auth";
import {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  changePasswordValidator,
} from "../validators/authValidator";

const router = Router();

// Public routes
router.post("/register", registerValidator, authController.register);
router.post("/login", loginValidator, authController.login);

// Protected routes
router.get("/profile", auth, authController.getProfile);
router.put(
  "/profile/update",
  auth,
  updateProfileValidator,
  authController.updateProfile
);
router.put(
  "/change-password",
  auth,
  changePasswordValidator,
  authController.changePassword
);

export default router;
