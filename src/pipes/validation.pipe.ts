import {
    ArgumentMetadata,
    BadRequestException,
    HttpStatus,
    PipeTransform,
} from "@nestjs/common";
import { ErrorResponse } from "src/schemas/response.schema";
import { ZodError, ZodSchema } from "zod";

type ValidationPipeParamsType = {
    paramsSchema?: ZodSchema;
    bodySchema?: ZodSchema;
    querySchema?: ZodSchema;
};

export class ValidationPipe implements PipeTransform {
    private paramsSchema: ZodSchema | null;
    private bodySchema: ZodSchema | null;
    private querySchema: ZodSchema | null;

    constructor(params: ValidationPipeParamsType) {
        this.paramsSchema = params.paramsSchema ?? null;
        this.bodySchema = params.bodySchema ?? null;
        this.querySchema = params.querySchema ?? null;
    }

    transform(value: unknown, metadata: ArgumentMetadata): unknown {
        let schema: ZodSchema | null;

        switch (metadata.type) {
            case "param":
                schema = this.paramsSchema;
                break;
            case "body":
                schema = this.bodySchema;
                break;
            case "query":
                schema = this.querySchema;
                break;
            default:
                schema = null;
        }

        if (schema) {
            try {
                const parsedValue: unknown = schema.parse(value);
                return parsedValue;
            } catch (exception: unknown) {
                if (exception instanceof ZodError) {
                    const error: ErrorResponse = {
                        statusCode: HttpStatus.BAD_REQUEST,
                        message: "Invalid Schema",
                        error: exception.errors.map((err) => ({
                            path: err.path.join("."),
                            message: err.message,
                        })),
                    };

                    throw new BadRequestException(error);
                }
            }
        } else {
            return value;
        }
    }
}
