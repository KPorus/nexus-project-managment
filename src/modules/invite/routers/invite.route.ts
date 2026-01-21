import { inviteController } from "../controllers/invite.controller";
import { asyncHandler } from "@/handlers/async.handler";
import { restrictTo, authenticateJWT } from "@/middlewares/auth.middleware";
import { Role } from "@/modules/auth/types/auth.types";
import express from "express";
const router = express.Router();

router.post(
  "/create-invite",
  authenticateJWT,
  restrictTo([Role.ADMIN]),
  asyncHandler(inviteController.createInvite),
);

router.post(
  "/find-invite",
  authenticateJWT,
  asyncHandler(inviteController.findInvitation),
);
router.post(
  "/accept-invite",
  asyncHandler(inviteController.acceptInvitation),
);

export const inviteRouter = router;
