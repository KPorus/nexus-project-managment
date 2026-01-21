import { projectService } from "../services/project.service";
import { HTTP_STATUS_CODES } from "@utils/http-status-codes";
import { sendResponse } from "@/handlers/response.handler";
import { Request, Response } from "express";
import { Types } from "mongoose";

const createProject = async (req: Request, res: Response) => {
  const body = req.body.data;
  const project = await projectService.createProject(body);
  sendResponse(res, project, HTTP_STATUS_CODES.OK, "Project Created");
};

const listProject = async (req: Request, res: Response) => {
  const project = await projectService.listProject();
  sendResponse(res, project, HTTP_STATUS_CODES.OK, "Project found");
};
const updateProject = async (req: Request, res: Response) => {
  const data = req.body.data;
  const updateData = await projectService.updateProject(data);
  sendResponse(res, updateData, HTTP_STATUS_CODES.OK, "Project updated");
};

const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.body;
  const updateData = await projectService.deleteProject(new Types.ObjectId(id));
  sendResponse(res, updateData, HTTP_STATUS_CODES.OK, "Project delete");
};

export const projectController = {
  createProject,
  listProject,
  updateProject,
  deleteProject,
};
