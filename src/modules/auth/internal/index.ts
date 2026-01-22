import {
  authValidator,
  TSeedRegisterInput,
} from "../validators/auth.validator";
import { HTTP_STATUS_CODES } from "@/utils/http-status-codes";
import { validate } from "@/middlewares/validate.middleware";
import { sendResponse } from "@/handlers/response.handler";
import { asyncHandler } from "@/handlers/async.handler";
import { authService } from "../services/auth.service";
import express, { Request, Response } from "express";
import { AuthUser } from "../types/auth.types";
import jwt from "jsonwebtoken";
import { AppError } from "@/types/error.type";
const router = express.Router();

enum drole {
  DEVELOPER = "DEVELOPER",
}
router.post(
  "/register/:token",
  validate(authValidator.seedRegisterSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const token = req.params.token as string;
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const dev = decoded as AuthUser;
    if ((dev.role as string) !== drole.DEVELOPER) {
      throw new AppError(HTTP_STATUS_CODES.UNAUTHORIZED, "Unauthorized access")
    }
    const { users } = req.body as { users: TSeedRegisterInput[] };

    const createdUsers = [];

    for (const user of users) {
      const { email, password, role } = user;
      const createdUser = await authService.registerToInvite({
        email,
        password,
        role,
      });
      createdUsers.push(createdUser);
    }

    sendResponse(
      res,
      createdUsers,
      HTTP_STATUS_CODES.CREATED,
      "Signup successful!",
    );
  }),
);

export const internalRouter = router;
