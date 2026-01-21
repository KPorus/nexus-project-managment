import { Role } from "@/modules/auth/types/auth.types";
import { Document, Types } from "mongoose";

export interface InviteType extends Document {
  _id: Types.ObjectId;
  email: string;
  role: Role;
  token: string;
  invitedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
