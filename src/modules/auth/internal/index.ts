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

const router = express.Router();

router.post(
  "/register",
  validate(authValidator.seedRegisterSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { users } = req.body as { users: TSeedRegisterInput[] };

    const createdUsers = [];

    for (const user of users) {
      const { email, password, name } = user;
      const createdUser = await authService.register({ email, password, name });
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
