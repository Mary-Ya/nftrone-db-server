import { StatusCodes } from 'http-status-codes';
import { IControllerResponse } from '../controllers.types';
import { IListProjects } from '../../services/projects';
import { ReachProjectList } from '../../../shared-types/project.output.types';

export const buildGetProjects = ({ listProjects }: { listProjects: IListProjects<ReachProjectList> }) => {
  return async (
    // request: Partial<IHttpRequest>,
  ): Promise<IControllerResponse> => {
    const projects = await listProjects();

    return {
      success: true,
      statusCode: StatusCodes.OK,
      body: {
        listPlainProjects: projects
      },
    };
  };
};