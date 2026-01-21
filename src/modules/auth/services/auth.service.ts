import { TLoginInput, TRegisterInput } from "../validators/auth.validator";
import { hashPassword, validatePassword } from "@/helpers/auth.helper";
import { generateToken, verifyToken } from "@/utils/token.util";
import { HTTP_STATUS_CODES } from "@utils/http-status-codes";
import { Role, Status } from "../types/auth.types";
import { AppError } from "@/types/error.type";
import { User } from "../models/auth.model";
import { Types } from "mongoose";

/**
 * Register service =====================================
 */
const registerToInvite = async (data: TRegisterInput) => {
  const hashedPassword = await hashPassword(data.password);
  const user = await User.createUser({
    email: data.email,
    password: hashedPassword,
    role: data.role as Role,
  });
  return {
    message: `${user.email} Signup successful`,
    user: {
      id: user._id,
      email: user.email,
    },
  };
};

/**
 * Login service =====================================
 */

const login = async (data: TLoginInput) => {
  const existing = await User.findByEmail(data.email);
  if (!existing) {
    throw new AppError(HTTP_STATUS_CODES.UNAUTHORIZED, "Invalid email");
  }
  if (existing.status == Status.INACTIVE) {
    throw new AppError(HTTP_STATUS_CODES.BAD_REQUEST, "User Can't login");
  }

  const isPasswordValid = await validatePassword(
    data.password,
    existing.password,
  );
  if (!isPasswordValid) {
    throw new AppError(HTTP_STATUS_CODES.UNAUTHORIZED, "Invalid password");
  }

  const token = generateToken({
    id: existing._id,
    email: existing.email,
    role: existing.role,
  });

  return {
    message: `${existing.email} Login successful`,
    accessToken: token.acessToken,
    refreshToken: token.refreshToken,
    user: {
      id: existing._id,
      email: existing.email,
    },
  };
};

/**
 * Refresh Token =====================================
 */
const refreshTokens = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new AppError(
      HTTP_STATUS_CODES.UNAUTHORIZED,
      "Refresh token is missing",
    );
  }

  const payload = verifyToken(refreshToken) as {
    id: string;
    email: string;
  };

  if (!payload) {
    throw new AppError(HTTP_STATUS_CODES.UNAUTHORIZED, "Invalid refresh token");
  }

  const user = await User.findByEmail(payload.email);

  if (!user) {
    throw new AppError(HTTP_STATUS_CODES.UNAUTHORIZED, "User no longer exists");
  }

  const tokens = generateToken({
    id: user._id,
    email: user.email,
    role: user.role,
  });

  return {
    accessToken: tokens.acessToken,
    refreshToken: tokens.refreshToken,
  };
};

const getAllUsers = async ({
  page,
  limit,
  id,
}: {
  page: number;
  limit: number;
  id: string;
}) => {
  const currentUserId = new Types.ObjectId(id);
  const users = await User.findAllUser({ page, limit, currentUserId });
  if (!users || users.length == 0) {
    throw new AppError(HTTP_STATUS_CODES.NOT_FOUND, "Not Users Found");
  }
  return {
    messages: "Users found",
    users,
  };
};

export const authService = {
  login,
  registerToInvite,
  refreshTokens,
  getAllUsers,
};
