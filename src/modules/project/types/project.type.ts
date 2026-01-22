import { Document, Types } from "mongoose";

export enum Status {
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED",
  DELETED = "DELETED",
}
export interface ProjectType extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  isDeleted: boolean;
  status: Status;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
