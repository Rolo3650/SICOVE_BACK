import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Response } from "express";
import { ErrorResponse } from "src/schemas/response.schema";
import { ZodError } from "zod";

@Catch()
export class ExceptionsHandler
    extends BaseExceptionFilter
    implements ExceptionFilter
{
    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const logger = new Logger("Exception");
        logger.error(exception);

        if (exception instanceof ZodError) {
            const error: ErrorResponse = {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Validation failed",
                error: exception.errors.map((err) => ({
                    path: err.path.join("."),
                    message: err.message,
                })),
            };

            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
            return;
        }
        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            const error: ErrorResponse = {
                statusCode: status,
                message: "",
                error: {},
            };
            if (typeof exceptionResponse === "string") {
                error.message = exceptionResponse;
            } else {
                const obj = exceptionResponse as ErrorResponse;
                error.message = obj.message;
                error.error = obj.error;
            }

            response.status(status).json(error);
            return;
        }

        const error: ErrorResponse = {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: "Exception Unknown",
            error: { exception },
        };

        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
        return;
    }
}
