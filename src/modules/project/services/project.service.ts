import { authService } from "@/modules/auth/services/auth.service";
import { HTTP_STATUS_CODES } from "@utils/http-status-codes";
import { Role } from "@/modules/auth/types/auth.types";
import { hashPassword } from "@/helpers/auth.helper";
import { Invitation } from "../models/project.model";
import { sendEmail } from "@/utils/email.util";
import { AppError } from "@/types/error.type";

const createInvite = async (data: { email: string; role: Role }) => {
  const user = await Invitation.createInvitation({
    email: data.email,
    role: data.role,
  });

  // Construct invitation URL
  const baseUrl = process.env.CLIENT_ECOM_URL;
  const link: string = `${baseUrl}/invite?token=${user.token}`;
  console.log(link);
  const emailData = {
    email: data.email,
    link: link,
  };
  // console.log(user);
  await sendingEmail(emailData);
  return {
    message: "Invitation created successful",
    user: {
      id: user._id,
      email: user.email,
      link: link,
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

const sendingEmail = async ({
  email,
  link,
}: {
  email: string;
  link: string;
}) => {
  const result = await sendEmail({
    to: email,
    subject: "Create your account",
    html: `
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center">
              <h2 style="font-size:20px; color:#333;">Invitation To Create Account</h2>
              <p style="font-size:16px; color:#555;">Click the button below to accept the invitation:</p>
              <table cellpadding="0" cellspacing="0" border="0" style="margin: 20px auto;">
                <tr>
                  <td align="center" bgcolor="#007bff" style="border-radius: 4px;">
                    <a href="${link}" 
                       style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 4px; font-size: 16px;">
                      Accept Invitation
                    </a>
                  </td>
                </tr>
              </table>
              <p style="font-size:14px; color:#888;">If you did not request this booking, please ignore this email.</p>
            </td>
          </tr>
        </table>
      `,
  });

  return result;
};

export const inviteService = {
  createInvite,
  acceptInvitation,
  findInvitation,
};
