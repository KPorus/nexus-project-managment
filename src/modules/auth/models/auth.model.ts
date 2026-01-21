import { AuthType, Role, Status } from "../types/auth.types";
import { Model, Schema, Types, model } from "mongoose";

export interface AuthModelType extends Model<AuthType> {
  findAllUser(currentUserId: Types.ObjectId | string): Promise<[]>;
  findByEmail(email: string): Promise<AuthType | null>;
  findUser(email: string): Promise<AuthType | null>;
  createUser(data: Partial<AuthType>): Promise<AuthType>;
}

const userSchema = new Schema<AuthType, AuthModelType>(
  {
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(Role), default: Role.STAFF },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.ACTIVE,
    },
    invitedAt: Date,
  },
  { timestamps: true },
);


// Wrap logic with error handling using mongooseError
userSchema.statics.findByEmail = async function (email: string) {
  return await this.findOne({ email });
};
userSchema.statics.findUser = async function (email: string) {
  return await this.findOne({ email }).select("-password");
};
userSchema.statics.findAllUser = async function (
  currentUserId: Types.ObjectId | string,
) {
  return this.find({ _id: { $ne: currentUserId } });
};

userSchema.statics.createUser = async function (data: Partial<AuthType>) {
  return await this.create(data);
};

export const User = model<AuthType, AuthModelType>("User", userSchema);
