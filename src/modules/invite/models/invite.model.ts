import { HTTP_STATUS_CODES } from "@/utils/http-status-codes";
import { Role } from "@/modules/auth/types/auth.types";
import { Model, Schema, model } from "mongoose";
import { InviteType } from "../types/invite.type";
import { AppError } from "@/types/error.type";
import crypto from "crypto";
function generateExpiringId(expiryInMs: number): string {
  const id = crypto.randomBytes(4).toString("hex");
  const expiresAt = Date.now() + expiryInMs;
  const payload = { id, expiresAt };
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function parseExpiringId(encoded: string) {
  const decoded = Buffer.from(encoded, "base64url").toString();
  return JSON.parse(decoded) as { id: string; expiresAt: number };
}
export interface InvitationModelType extends Model<InviteType> {
  findInvitation(token: string): Promise<InviteType | null>;
  createInvitation(data: {
    email: string;
    role: Role;
  }): Promise<InviteType>;
}

const invitationSchema = new Schema<InviteType, InvitationModelType>(
  {
    email: { type: String, unique: true, required: true },
    role: { type: String, enum: Object.values(Role), default: Role.STAFF },
    token: String,
    invitedAt: Date,
  },
  { timestamps: true },
);

invitationSchema.statics.createInvitation = async function (data: {
  email: string;
  role: Role;
}): Promise<InviteType> {
  const token = generateExpiringId(60 * 60 * 1000);
  console.log(token);
  const user = await this.create({
    email: data.email,
    role: data.role,
    token: token,
  });
  return user;
};

invitationSchema.statics.findInvitation = async function (
  token: string,
): Promise<InviteType> {
  const invitation = await this.find({ token: token });

  const { expiresAt } = parseExpiringId(invitation[0].token as string);
  console.log(expiresAt);
  if (Date.now() > expiresAt) {
    throw new AppError(
      HTTP_STATUS_CODES.GATEWAY_TIMEOUT,
      "Invitation has expired",
    );
  }
  return invitation[0];
};

export const Invitation = model<InviteType, InvitationModelType>(
  "Invitation",
  invitationSchema,
);
