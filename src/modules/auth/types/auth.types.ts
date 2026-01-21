import { Document, Types } from "mongoose";
import { Request } from "express";

export enum Role {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  STAFF = "STAFF",
}
export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface AuthUser {
  id: Types.ObjectId;
  email: string;
  role:Role
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export interface AuthType extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  role: Role;
  status: Status;
  invitedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
