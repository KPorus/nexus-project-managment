import { HTTP_STATUS_CODES } from "@/utils/http-status-codes";
import { AuthType, Role, Status } from "../types/auth.types";
import { Model, Schema, Types, model } from "mongoose";
import { AppError } from "@/types/error.type";

export interface AuthModelType extends Model<AuthType> {
  findAllUser({
    page,
    limit,
    currentUserId,
  }: {
    page: number;
    limit: number;
    currentUserId: Types.ObjectId;
  }): Promise<{ total: number; users: [] }>;
  findByEmail(email: string): Promise<AuthType | null>;
  findUser(email: string): Promise<AuthType | null>;
  createUser(data: Partial<AuthType>): Promise<AuthType>;
  updateUser(data: {
    id: Types.ObjectId;
    status?: Status;
    role?: Role;
  }): Promise<AuthType | null>;
}

const userSchema = new Schema<AuthType, AuthModelType>(
  {
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
userSchema.statics.findAllUser = async function ({
  page = 1,
  limit = 10,
  currentUserId,
}: {
  page?: number;
  limit?: number;
  currentUserId: Types.ObjectId;
}) {
  const skip = (page - 1) * limit;
  const total = await this.countDocuments({ _id: { $ne: currentUserId } });
  const users = await this.find({ _id: { $ne: currentUserId } })
    .skip(skip)
    .limit(limit)
    .select("-password -__v")
    .lean();
  // console.log(total,users);
  return {
    total: total,
    users,
  };
};

userSchema.statics.updateUser = async function (data: {
  id: Types.ObjectId;
  status?: Status;
  role?: Role;
}): Promise<AuthType | null> {
  if (!Types.ObjectId.isValid(data.id)) {
    throw new AppError(HTTP_STATUS_CODES.BAD_REQUEST, "Invalid user ID");
  }

  const update: Partial<AuthType> = {};
  if (data.status !== undefined) update.status = data.status;
  if (data.role !== undefined) update.role = data.role;

  const updatedUser = await this.findByIdAndUpdate(
    data.id,
    { $set: update },
    {
      new: true,
      runValidators: true,
      select: "-password -__v",
    },
  );

  if (!updatedUser) {
    throw new AppError(HTTP_STATUS_CODES.NOT_FOUND, "User not found");
  }

  return updatedUser;
};

userSchema.statics.createUser = async function (data: Partial<AuthType>) {
  return await this.create(data);
};

export const User = model<AuthType, AuthModelType>("User", userSchema);
