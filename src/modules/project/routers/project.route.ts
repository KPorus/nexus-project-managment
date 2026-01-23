import { authenticateJWT, restrictTo } from "@/middlewares/auth.middleware";
import { projectController } from "../controllers/project.controller";
import { asyncHandler } from "@/handlers/async.handler";
import { Role } from "@/modules/auth/types/auth.types";
import express from "express";
const router = express.Router();

router.post(
  "/",
  authenticateJWT,
  asyncHandler(projectController.createProject),
);
router.get("/", authenticateJWT, asyncHandler(projectController.listProject));

router.patch(
  "/:id",
  authenticateJWT,
  restrictTo([Role.ADMIN]),
  asyncHandler(projectController.updateProject),
);
router.patch(
  "/soft_delete/:id",
  authenticateJWT,
  restrictTo([Role.ADMIN]),
  asyncHandler(projectController.deleteProject),
);

export const projectRouter = router;
