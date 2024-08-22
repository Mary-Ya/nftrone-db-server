import { StatusCodes } from "http-status-codes";
import { ILayersDB } from "../data-access/layer";
import { IHttpRequest } from "../helpers/express-callback";
import { logger } from "../helpers/logger";

const logLayerService = logger.getScopedLogger('LAYER_SERVICE');

export const buildGetLayer = ({
  LayersDB,
}: {
  LayersDB: ILayersDB;
}) => {
  return async (req: Partial<IHttpRequest>) => {
    try {
      const { id } = req.params;
      const layer = await LayersDB.findById(id);

      if (!layer) {
        logLayerService(`Layer not found with id: ${id}`);
        return {
          success: false,
          code: StatusCodes.NOT_FOUND,
          error: 'Layer not found'
        };
      }

      logLayerService(`Layer found successfully with id: ${id}. `, layer);
      return ({
        message: 'Layer found',
        layer
      });
    } catch (err) {
      logLayerService('Error getting layer: ', err);
      return ({
        error: 'Error getting layer',
        code: StatusCodes.INTERNAL_SERVER_ERROR
      });
    };
  };
};
