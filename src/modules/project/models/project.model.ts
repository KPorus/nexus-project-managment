import { Model, Schema, Types, model } from "mongoose";

import { ProjectType, Status } from "../types/project.type";

export interface ProjectModelType extends Model<ProjectType> {
  createProject(
    data: Partial<ProjectType>,
    id: Types.ObjectId,
  ): Promise<ProjectType>;
  listProject(): Promise<ProjectType[] | null>;
  deleteProject(id: Types.ObjectId | string): Promise<ProjectType | null>;
  updateProject(
    id: Types.ObjectId | string,
    updateData: Partial<ProjectType>,
  ): Promise<ProjectType | null>;
}

const projectSchema = new Schema<ProjectType, ProjectModelType>(
  {
    name: { type: String, unique: true, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.ACTIVE,
    },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.ObjectId, required: true },
  },
  { timestamps: true },
);

projectSchema.statics.createProject = async function (
  data: Partial<ProjectType>,
  id: Types.ObjectId,
) {
  const project = await this.create({
    name: data.name,
    description: data.description,
    createdBy: id,
  });
  return project;
};
projectSchema.statics.listProject = async function (): Promise<
  ProjectType[] | null
> {
  return await this.find();
};
projectSchema.statics.updateProject = async function (
  id: Types.ObjectId | string,
  updateData: Partial<ProjectType>,
) {
  return await this.findByIdAndUpdate({ _id: id }, updateData, {
    new: true,
  });
};

projectSchema.statics.deleteProject = async function (
  id: Types.ObjectId | string,
) {
  // const project = await this.findById(id);
  // if (project?._id) return await this.deleteOne({ _id: id });
  return await this.findByIdAndUpdate(
    { _id: id },
    { isDeleted: true, status: Status.DELETED },
    {
      new: true,
    },
  );
};

export const Project = model<ProjectType, ProjectModelType>(
  "Project",
  projectSchema,
);
