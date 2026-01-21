import { HTTP_STATUS_CODES } from "@utils/http-status-codes";
import { sendResponse } from "@/handlers/response.handler";
import { inviteService } from "../services/invite.service";
import { Request, Response } from "express";

const createInvite = async (req: Request, res: Response) => {
  const { email, role } = req.body;
  const invitation = await inviteService.createInvite({
    email,
    role,
  });

  sendResponse(
    res,
    invitation,
    HTTP_STATUS_CODES.OK,
    "Invitation created successful!",
  );
};

const findInvitation = async (req: Request, res: Response) => {
  const { token } = req.body;
  const invitation = await inviteService.findInvitation(token);
  sendResponse(res, invitation, HTTP_STATUS_CODES.FOUND, "Invitation Found");
};

const acceptInvitation = async (req: Request, res: Response) => {
  const body = req.body;
  const invitation = await inviteService.acceptInvitation(body);
  sendResponse(res, invitation, HTTP_STATUS_CODES.FOUND, "Invitation Found");
};
export const inviteController = {
  createInvite,
  findInvitation,
  acceptInvitation,
};
