import { IHttpRequest, buildExpressCallback } from "../../helpers/express-callback";
import { Controller, IControllerResponse } from '../controllers.types';
import { PlaneProjectList } from '../../../shared-types/project.output.types';
import { IListProjects } from '../../services/projects';
import { StatusCodes } from "http-status-codes";


export const buildGetPlainProjects = ({ listProjects }: { listProjects: IListProjects<PlaneProjectList> }): Controller => {
  return async (
    // request,
  ) => {
    const projects = await listProjects();
    return Promise.resolve({
      success: true,
      statusCode: StatusCodes.OK,
      body: {
        listProjects: {
          projects,
        }
      }
    });
  };
};