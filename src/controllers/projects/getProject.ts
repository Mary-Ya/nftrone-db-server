import { OK } from 'http-status-codes';
import { IHttpRequest } from "../../helpers/express-callback";
import { IControllerResponse } from '../controllers.types';


export const buildGetOneProject = ({ listProjects }: { listProjects: IListProjects }) => {
  return async (
    request: Partial<IHttpRequest>,
  ): Promise<IControllerResponse> => {
    const Projects = await listProjects();

    return {
      success: true,
      statusCode: OK,
      body: Projects,
    };
  };
};