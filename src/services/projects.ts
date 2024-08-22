import { PlaneProjectList, ReachProject, ReachProjectList } from '../../shared/types/project.types';
import { IProjectsDB } from '../data-access/project';
import { IHttpRequest, IOneEntry } from '../helpers/express-callback';
import { StatusCodes } from "http-status-codes";

export type IListProjects<T> = () => Promise<T>;

export const buildListProjects = ({
  ProjectsDB,
}: {
  ProjectsDB: IProjectsDB;
}): IListProjects<ReachProjectList> => {
  return async () => {
    return await ProjectsDB.findAll();
  };
};

export const buildListPlaneProjects = ({
  ProjectsDB,
}: {
  ProjectsDB: IProjectsDB;
}): IListProjects<PlaneProjectList> => {
  return async () => {
    return await ProjectsDB.findAllPlane();
  };
};

export const buildGetProject = ({
  ProjectsDB,
}: {
  ProjectsDB: IProjectsDB;
}): IOneEntry<ReachProject> => {
  return async (request: IHttpRequest) => {
    return await ProjectsDB.findById(request.params?.id);
  };
};

export const buildCreateProject = ({
  ProjectsDB,
}: {
  ProjectsDB: IProjectsDB;
}) => {
  return async (req: Partial<IHttpRequest>) => {
    const { name, canvas_height, canvas_width, background_color } = req.body;
    const newProject = await ProjectsDB.create({
      name,
      canvas_height,
      canvas_width,
      background_color
    });
    console.log('[PROJECT]: New project: ', newProject);

    if (!newProject) {
      return {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        error: 'Error creating project'
      };
    }

    return await newProject.validate().then(() => {
      console.log('[PROJECT]: Project is valid');
      return newProject.save().then(() => {
        return {
          code: StatusCodes.CREATED,
          body: {
            message: 'Project created successfully',
            project: newProject
          }
        };
      }).catch((err: Error) => {
        console.log('[PROJECT]: Error creating project: ', err);
        return {
          code: StatusCodes.INTERNAL_SERVER_ERROR,
          error: err.message
        }
      });
    }).catch((err: Error) => {
      console.log('[PROJECT]: Error validating project: ', err);
      return {
        code: StatusCodes.BAD_REQUEST,
        error: err.message
      }
    });
  };
};