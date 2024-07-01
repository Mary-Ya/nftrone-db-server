import { Optional } from "sequelize";
import { IHttpRequest } from "../helpers/express-callback";

export interface IControllerResponse {
  success: boolean;
  statusCode: number;
  body: {
    [result: string]: unknown;
    error?: string;
  };
}

export type Controller = (
  request: Partial<IHttpRequest>,
) => Promise<IControllerResponse>;