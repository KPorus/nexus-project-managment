import { clearCookieAndHeader, setCookie } from "@/utils/cookie.util";
import { HTTP_STATUS_CODES } from "@utils/http-status-codes";
import { sendResponse } from "@/handlers/response.handler";
import { authService } from "../services/auth.service";
import { AuthRequest } from "../types/auth.types";
import { AppError } from "@/types/error.type";
import { Request, Response } from "express";

/**
 * Login controller
 */

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { accessToken, refreshToken, user } = await authService.login({
    email,
    password,
  });

  setCookie(res, "refreshToken", refreshToken);
  res.setHeader("Access-Control-Expose-Headers", "Authorization");
  res.setHeader("Authorization", `Bearer ${accessToken}`);
  sendResponse(res, user, HTTP_STATUS_CODES.OK, "Login successful!");
};

/**
 * Logout controller
 */
const logout = async (_: Request, res: Response) => {
  clearCookieAndHeader(res);
  sendResponse(res, null, HTTP_STATUS_CODES.OK, "Logout successful!");
};

/**
 * Refresh tokens controller
 */
const handleRefreshTokens = async (req: Request, res: Response) => {
  const prevRefreshToken = req.cookies.refreshToken;
  const { accessToken, refreshToken } =
    await authService.refreshTokens(prevRefreshToken);
  setCookie(res, "refreshToken", refreshToken);
  res.setHeader("Authorization", `Bearer ${accessToken}`);

  sendResponse(
    res,
    accessToken,
    HTTP_STATUS_CODES.OK,
    "Tokens refreshed successfully!",
  );
};

const getAllUsers = async (req: AuthRequest, res: Response) => {
  const { page, limit } = req.body;
  const id = req.user?.id;
  if (!id) {
    throw new AppError(HTTP_STATUS_CODES.NO_CONTENT, "empty data");
  }
  // console.log(page, limit, id);
  const users = await authService.getAllUsers({ page, limit, id });
  sendResponse(
    res,
    { total: users.total, users: users.users },
    HTTP_STATUS_CODES.OK,
    users.messages,
  );
};

const updateUser = async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const { status, role } = req.body;

  const result = await authService.updateUser(id, status, role);
  sendResponse(res, result, HTTP_STATUS_CODES.OK, result.message);
};

export const authController = {
  login,
  logout,
  handleRefreshTokens,
  getAllUsers,
  updateUser
};
