import { StatusCodes } from 'http-status-codes';
import { IHttpRequest, IOneEntry } from "../../helpers/express-callback";
import { Controller, IControllerResponse } from '../controllers.types';
import { PlaneProject, ProjectAttributes } from '../../../shared/types/project.types';
import { Model } from 'sequelize';


export const buildCreateOneProject = ({ createProject }: {
  createProject: (req: Partial<IHttpRequest>) => Promise<
    {
      body?: {
        message: string,
        project: Model<ProjectAttributes>
      }
      error?: string,
      code?: StatusCodes
    }
  >
}): Controller => {
  return async (
    request: Partial<IHttpRequest>,
  ): Promise<IControllerResponse> => {
    const { body, error, code } = await createProject(request as any);

    if (error || !body) {
      return Promise.resolve({
        success: false,
        statusCode: code || StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          error,
        },
      });
    }

    return Promise.resolve({
      success: true,
      statusCode: code || StatusCodes.OK,
      body
    });
  };
};