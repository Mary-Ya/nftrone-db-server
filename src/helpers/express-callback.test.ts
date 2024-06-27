import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { DEFAULT_ERROR_MESSAGE } from '../errors/error.messages';
import { buildExpressCallback } from './express-callback';
import { createRequest, createResponse } from "node-mocks-http";
import { ClientError } from '../errors/client-error';

interface TestCase {
  description: string;
  mockReturn: any;
  mockMethod: 'mockResolvedValue' | 'mockRejectedValue';
  expectedResponse: {
    success: boolean;
    statusCode: StatusCodes;
    body: any;
  };
}

describe("buildExpressCallback", () => {
  let req: Request, res: Response & { json: jest.Mock }, mockController: jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();
    req = createRequest() as Request;
    res = createResponse() as Response & { json: jest.Mock };
    res.json = jest.fn();
    mockController = jest.fn();
  });

  test.each([
    {
      description: "return a successful response from the controller",
      mockReturn: { body: { result: "success" } },
      mockMethod: 'mockResolvedValue',
      expectedResponse: {
        success: true,
        statusCode: StatusCodes.OK,
        body: { result: "success" },
      }
    },
    {
      description: "handle ClientError thrown by the controller",
      mockReturn: new ClientError("Client error occurred"),
      mockMethod: 'mockRejectedValue',
      expectedResponse: {
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: { error: "Client error occurred" },
      }
    },
    {
      description: "handle random Error thrown by the controller",
      mockReturn: new Error("Mock error"),
      mockMethod: 'mockRejectedValue',
      expectedResponse: {
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: { error: DEFAULT_ERROR_MESSAGE },
      }
    }
  ] as TestCase[])('should $description', async ({ mockReturn, mockMethod, expectedResponse }) => {
    mockController[mockMethod](mockReturn);

    const callback = buildExpressCallback(mockController);
    await callback(req, res);

    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });
});
