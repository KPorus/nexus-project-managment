import { AuthRequest } from "@/modules/auth/types/auth.types";
import { projectService } from "../services/project.service";
import { HTTP_STATUS_CODES } from "@utils/http-status-codes";
import { sendResponse } from "@/handlers/response.handler";
import { AppError } from "@/types/error.type";
import { Request, Response } from "express";
import { Types } from "mongoose";

const createProject = async (req: AuthRequest, res: Response) => {
  const body = req.body;
  // console.log(body);
  const id = req.user?.id;
  if (!id) {
    throw new AppError(HTTP_STATUS_CODES.NO_CONTENT, "empty data");
  }
  const project = await projectService.createProject(
    body,
    new Types.ObjectId(id),
  );
  sendResponse(res, project.project, HTTP_STATUS_CODES.OK, project.message);
};

const listProject = async (req: Request, res: Response) => {
  const project = await projectService.listProject();
  sendResponse(res, project.projects, HTTP_STATUS_CODES.OK, project.message);
};
const updateProject = async (req: Request, res: Response) => {
  const data = req.body;
  const id = req.params.id as string
  // console.log(data,id);
  const updateData = await projectService.updateProject(id,data);
  sendResponse(res, updateData.updateData, HTTP_STATUS_CODES.OK, updateData.message);
};

const deleteProject = async (req: Request, res: Response) => {
  const id  = req.params.id as string;
  const updateData = await projectService.deleteProject(new Types.ObjectId(id));
    if (!updateData.project) {
    sendResponse(
      res,
      updateData.project,
      HTTP_STATUS_CODES.BAD_REQUEST,
      "Delete Failed",
    );
  }
  sendResponse(res, updateData.project, HTTP_STATUS_CODES.OK, updateData.message);
};

export const projectController = {
  createProject,
  listProject,
  updateProject,
  deleteProject,
};
