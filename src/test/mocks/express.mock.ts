import { jest } from "@jest/globals";
import { Response } from "express";
import {
    SuccessResponse,
    SuccessResponseSchema,
} from "src/schemas/response.schema";

const getMockedResponse = (): Partial<Response> => {
    const res: Partial<Response> = {
        status: jest.fn().mockReturnThis() as jest.MockedFunction<
            (code: number) => Response
        >,
        json: jest.fn().mockReturnThis() as jest.MockedFunction<
            (successResponse: SuccessResponse) => Response<SuccessResponse>
        >,
    };
    return res;
};

const testMockedResponse = (response: unknown): SuccessResponse => {
    const jsonResponse = (
        response as jest.MockedFunction<
            (successResponse: SuccessResponse) => Response<SuccessResponse>
        >
    ).mock.calls[0][0];
    const safeJsonResponse = SuccessResponseSchema.safeParse(jsonResponse);
    if (safeJsonResponse.success) {
        return safeJsonResponse.data;
    }
    fail("Not expected response");
};

export { getMockedResponse, testMockedResponse };
