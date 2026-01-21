import { HTTP_STATUS_CODES } from "@/utils/http-status-codes";
import { ProjectType } from "../types/project.type";
import { Project } from "../models/project.model";
import { AppError } from "@/types/error.type";
import { Types } from "mongoose";

const createProject = async (data: Partial<ProjectType>) => {
  const project = await Project.createProject(data);

  return {
    message: "Project created successful",
    project: {
      id: project._id,
      name: project.name,
      description: project.description,
    },
  };
};
const listProject = async () => {
  const projects = await Project.listProject();
  if (!projects || projects.length == 0) {
    throw new AppError(HTTP_STATUS_CODES.NOT_FOUND, "No Project Found");
  }
  return {
    message: "Project Found",
    projects,
  };
};
const deleteProject = async (id: Types.ObjectId) => {
  const project = await Project.deleteProject(id);
  return {
    message: "Project Deleted Successfully",
    project,
  };
};

const updateProject = async ({
  id,
  data,
}: {
  id: Types.ObjectId;
  data: Partial<ProjectType>;
}) => {
  const updateData = await Project.updateProject(id, data);
  return {
    message: "Project Updated Successfully",
    updateData,
  };
};
export const projectService = {
  createProject,
  listProject,
  deleteProject,
  updateProject,
};
