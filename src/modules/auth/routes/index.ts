import { authenticateJWT, restrictTo } from "@/middlewares/auth.middleware";
import { authController } from "../controllers/auth.controller";
import { validate } from "@/middlewares/validate.middleware";
import { authValidator } from "../validators/auth.validator";
import { asyncHandler } from "@/handlers/async.handler";
import { Role } from "../types/auth.types";
import express from "express";
const router = express.Router();

router.post(
  "/login",
  validate(authValidator.LoginSchema),
  asyncHandler(authController.login),
);

router.post("/refreshToken", asyncHandler(authController.handleRefreshTokens));
router.post(
  "/get-all-users",
  authenticateJWT,
  restrictTo([Role.ADMIN]),
  asyncHandler(authController.getAllUsers),
);

router.patch(
  "/update/:id",
  authenticateJWT,
  restrictTo([Role.ADMIN]),
  asyncHandler(authController.updateUser),
);

export const authRouter = router;
