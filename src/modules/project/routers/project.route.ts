import { authenticateJWT, restrictTo } from "@/middlewares/auth.middleware";
import { projectController } from "../controllers/project.controller";
import { asyncHandler } from "@/handlers/async.handler";
import { Role } from "@/modules/auth/types/auth.types";
import express from "express";
const router = express.Router();

router.post("/projects", asyncHandler(projectController.createProject));
router.get(
  "/projects",
  authenticateJWT,
  asyncHandler(projectController.listProject),
);

router.patch(
  "/projects/:id",
  restrictTo([Role.ADMIN]),
  asyncHandler(projectController.updateProject),
);
router.delete(
  "/projects/:id",
  authenticateJWT,
  restrictTo([Role.ADMIN]),
  asyncHandler(projectController.deleteProject),
);

export const inviteRouter = router;
