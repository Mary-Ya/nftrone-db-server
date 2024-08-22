import { StatusCodes } from 'http-status-codes';
import { IHttpRequest, IOneEntry } from "../../helpers/express-callback";
import { Controller, IControllerResponse } from '../controllers.types';
import { ReachProject } from '../../../shared/types/project.types';


export const buildGetOneProject = ({ getProject }: { getProject: IOneEntry<ReachProject> }): Controller => {
  return async (
    request: Partial<IHttpRequest>,
  ): Promise<IControllerResponse> => {
    const project = await getProject(request as any);

    return Promise.resolve({
      success: true,
      statusCode: StatusCodes.OK,
      body: {
        project,
      },
    });
  };
};