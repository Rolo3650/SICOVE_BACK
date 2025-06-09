import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Post,
    Put,
    Res,
    UsePipes,
    applyDecorators,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ApiBearerAuth, ApiBody, ApiParam } from "@nestjs/swagger";
import { type Response } from "express";
import { ValidationPipe } from "src/pipes/validation.pipe";
import {
    type GeneralIdParams,
    GeneralIdParamsSchema,
} from "src/schemas/general.schema";
import { SuccessResponse } from "src/schemas/response.schema";
import {
    type CreateVerification,
    CreateVerificationSchema,
    type UpdateVerification,
    UpdateVerificationSchema,
} from "src/schemas/verification/body.schema";
import { VerificationService } from "src/services/verification.service";
import {
    transformZodSchemaToBodySchema,
    transformZodSchemaToParamSchema,
} from "src/utils/zodToOpenApi";

@Controller("/verification")
@applyDecorators(ApiBearerAuth())
export class VerificationController {
    private readonly verificationService: VerificationService;
    private readonly jwtService: JwtService;

    constructor(
        verificationService: VerificationService,
        jwtService: JwtService,
    ) {
        this.verificationService = verificationService;
        this.jwtService = jwtService;
    }

    @Get()
    async getVerifications(@Res() res: Response): Promise<Response> {
        const verifications = await this.verificationService.getVerifications({
            include: {
                vehicle: true,
            },
        });
        const response: SuccessResponse = {
            message: "Custom registrations found",
            statusCode: HttpStatus.OK,
            data: {
                verifications,
            },
        };
        return res.status(response.statusCode).json(response);
    }

    @Post()
    @ApiBody(transformZodSchemaToBodySchema(CreateVerificationSchema))
    @UsePipes(
        new ValidationPipe({
            bodySchema: CreateVerificationSchema,
        }),
    )
    async createVerification(
        @Res() res: Response,
        @Body() body: CreateVerification,
    ): Promise<Response> {
        const verification =
            await this.verificationService.createVerification(body);
        const response: SuccessResponse = {
            message: "Custom registration created",
            statusCode: HttpStatus.CREATED,
            data: { verification },
        };
        return res.status(response.statusCode).json(response);
    }

    @Get("byId/:id")
    @ApiParam(transformZodSchemaToParamSchema(GeneralIdParamsSchema, 0))
    @UsePipes(
        new ValidationPipe({
            paramsSchema: GeneralIdParamsSchema,
        }),
    )
    async getVerificationById(
        @Res() res: Response,
        @Param() params: GeneralIdParams,
    ): Promise<Response> {
        const verification = await this.verificationService.getVerification(
            params.id,
            {
                include: {
                    vehicle: true,
                },
            },
        );
        const response: SuccessResponse = {
            message: "Custom registration found",
            statusCode: HttpStatus.OK,
            data: { verification },
        };
        return res.status(response.statusCode).json(response);
    }

    @Put("byId/:id")
    @ApiParam(transformZodSchemaToParamSchema(GeneralIdParamsSchema, 0))
    @ApiBody(transformZodSchemaToBodySchema(UpdateVerificationSchema))
    @UsePipes(
        new ValidationPipe({
            paramsSchema: GeneralIdParamsSchema,
            bodySchema: UpdateVerificationSchema,
        }),
    )
    async updateVerificationById(
        @Res() res: Response,
        @Param() params: GeneralIdParams,
        @Body() body: UpdateVerification,
    ): Promise<Response> {
        const verification = await this.verificationService.updateVerification(
            body,
            params.id,
        );
        const response: SuccessResponse = {
            message: "Custom registration updated",
            statusCode: HttpStatus.OK,
            data: { verification },
        };
        return res.status(response.statusCode).json(response);
    }

    @Delete("byId/:id")
    @ApiParam(transformZodSchemaToParamSchema(GeneralIdParamsSchema, 0))
    @UsePipes(
        new ValidationPipe({
            paramsSchema: GeneralIdParamsSchema,
        }),
    )
    async deleteById(
        @Res() res: Response,
        @Param() params: GeneralIdParams,
    ): Promise<Response> {
        await this.verificationService.deleteVerification(params.id);
        const response: SuccessResponse = {
            message: "Custom registration deleted",
            statusCode: HttpStatus.OK,
            data: {},
        };
        return res.status(response.statusCode).json(response);
    }
}
