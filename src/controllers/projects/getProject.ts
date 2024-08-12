import { OK } from 'http-status-codes';
import { IHttpRequest } from "../../helpers/express-callback";
import { Controller, IControllerResponse } from '../controllers.types';
import { IOneProject } from '../../services/projects';
import { ReachProject } from '../../../shared/types/project.types';
import { Request as ExpressRequest } from 'express';


export const buildGetOneProject = ({ getProject }: { getProject: IOneProject<ReachProject> }): Controller => {
  return async (
    request: Partial<IHttpRequest>,
  ): Promise<IControllerResponse> => {
    const project = await getProject(request as any);

    return Promise.resolve({
      success: true,
      statusCode: OK,
      body: {
        project,
      },
    });
  };
};