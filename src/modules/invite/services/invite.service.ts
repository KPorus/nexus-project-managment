import { authService } from "@/modules/auth/services/auth.service";
import { HTTP_STATUS_CODES } from "@utils/http-status-codes";
import { Role } from "@/modules/auth/types/auth.types";
import { hashPassword } from "@/helpers/auth.helper";
import { Invitation } from "../models/invite.model";
import { AppError } from "@/types/error.type";

const createInvite = async (data: { email: string; role: Role }) => {
  const user = await Invitation.createInvitation({
    email: data.email,
    role: data.role,
  });
  // console.log(user);
  return {
    message: "Invitation created successful",
    user: {
      id: user._id,
      email: user.email,
    },
  };
};

const findInvitation = async (token: string) => {
  const invitation = await Invitation.findInvitation(token);
  if (!invitation) {
    throw new AppError(HTTP_STATUS_CODES.NOT_FOUND, "Invitation not found");
  }
  return invitation;
};

const acceptInvitation = async ({
  token,
  password,
}: {
  token: string;
  password: string;
}) => {
  const hashedPassword = await hashPassword(password);
  const invitation = await Invitation.findInvitation(token);

  if (!invitation) {
    throw new AppError(HTTP_STATUS_CODES.NOT_FOUND, "Invitation not found");
  }

  const user = await authService.register({
    email: invitation.email,
    password: hashedPassword,
    role: invitation.role as Role,
  });

  return user;
};

export const inviteService = {
  createInvite,
  acceptInvitation,
  findInvitation,
};
