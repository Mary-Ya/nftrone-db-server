import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { ClientError } from "./../errors/client-error";
import { logger } from "./logger";
import { Controller, IControllerResponse } from "../controllers/controllers.types";
import { DEFAULT_ERROR_MESSAGE } from "../errors/error.messages";
import { Request as ExpressRequest } from 'express';

export type IOneEntry<T> = (request: ExpressRequest<IHttpRequest>) => Promise<T>;
export interface IHttpRequest {
  body: Request["body"];
  query: Request["query"];
  params: any // Request["params"];
}

export const buildExpressCallback = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    try {
      const httpRequest = {
        body: req.body,
        query: req.query,
        params: req.params,
      };
      const httpResponse: IControllerResponse = await controller(httpRequest);

      res.json({
        success: true,
        statusCode: StatusCodes.OK,
        body: httpResponse.body,
      });
    } catch (error) {
      logger.log(JSON.stringify(error));

      const errorMessage =
        error instanceof ClientError ? error.message : DEFAULT_ERROR_MESSAGE;

      const errorCode = StatusCodes.INTERNAL_SERVER_ERROR;

      res.json({
        success: false,
        statusCode: errorCode,
        body: {
          error: errorMessage,
        },
      });
    }
  };
};