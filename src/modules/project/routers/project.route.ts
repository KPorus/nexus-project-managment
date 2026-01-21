import { asyncHandler } from "@/handlers/async.handler";
import express from "express";
import { inviteController } from "../controllers/project.controller";
const router = express.Router();

router.post(
  "/create-invite",
//   validate(authValidator.LoginSchema),
  asyncHandler(inviteController.createInvite),
);

router.post(
  "/find-invite",
//   validate(authValidator.registerSchema),
  asyncHandler(inviteController.findInvitation),
);
router.post(
  "/accept-invite",
//   validate(authValidator.registerSchema),
  asyncHandler(inviteController.),
);


export const inviteRouter = router;
