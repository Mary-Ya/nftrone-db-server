import { StatusCodes } from "http-status-codes";
import { IHttpRequest } from "../../helpers/express-callback";
import { Controller, IControllerResponse } from "../controllers.types";
import { LayerAttributes } from "../../../shared/types/layer.types";
import { Model } from "sequelize";

export const composeLayerDataFromDB = ({ getLayer }: {
  getLayer: (req: Partial<IHttpRequest>) => Promise<
    {
      body?: {
        layer: Model<LayerAttributes>
      }
      error?: string,
      code?: StatusCodes
    }
  >
}): Controller => {
  return async (
    request: Partial<IHttpRequest>,
  ): Promise<IControllerResponse> => {
    const layer = await getLayer(request as any);

    return Promise.resolve({
      success: true,
      statusCode: StatusCodes.OK,
      body: layer,
    });
  };
};