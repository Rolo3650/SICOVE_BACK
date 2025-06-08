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
import {
    type CreateInsuranceRegistration,
    CreateInsuranceRegistrationSchema,
    type UpdateInsuranceRegistration,
    UpdateInsuranceRegistrationSchema,
} from "src/schemas/insuranceRegistration/body.schema";
import { SuccessResponse } from "src/schemas/response.schema";
import { InsuranceRegistrationService } from "src/services/insuranceRegistration.service";
import {
    transformZodSchemaToBodySchema,
    transformZodSchemaToParamSchema,
} from "src/utils/zodToOpenApi";

@Controller("/insurance-registration")
@applyDecorators(ApiBearerAuth())
export class InsuranceRegistrationController {
    private readonly insuranceRegistrationService: InsuranceRegistrationService;
    private readonly jwtService: JwtService;

    constructor(
        insuranceRegistrationService: InsuranceRegistrationService,
        jwtService: JwtService,
    ) {
        this.insuranceRegistrationService = insuranceRegistrationService;
        this.jwtService = jwtService;
    }

    @Get()
    async getInsuranceRegistrations(@Res() res: Response): Promise<Response> {
        const insuranceRegistrations =
            await this.insuranceRegistrationService.getInsuranceRegistrations({
                include: {
                    vehicle: true,
                },
            });
        const response: SuccessResponse = {
            message: "Custom registrations found",
            statusCode: HttpStatus.OK,
            data: {
                insuranceRegistrations,
            },
        };
        return res.status(response.statusCode).json(response);
    }

    @Post()
    @ApiBody(transformZodSchemaToBodySchema(CreateInsuranceRegistrationSchema))
    @UsePipes(
        new ValidationPipe({
            bodySchema: CreateInsuranceRegistrationSchema,
        }),
    )
    async createInsuranceRegistration(
        @Res() res: Response,
        @Body() body: CreateInsuranceRegistration,
    ): Promise<Response> {
        const insuranceRegistration =
            await this.insuranceRegistrationService.createInsuranceRegistration(
                body,
            );
        const response: SuccessResponse = {
            message: "Custom registration created",
            statusCode: HttpStatus.CREATED,
            data: { insuranceRegistration },
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
    async getInsuranceRegistrationById(
        @Res() res: Response,
        @Param() params: GeneralIdParams,
    ): Promise<Response> {
        const insuranceRegistration =
            await this.insuranceRegistrationService.getInsuranceRegistration(
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
            data: { insuranceRegistration },
        };
        return res.status(response.statusCode).json(response);
    }

    @Put("byId/:id")
    @ApiParam(transformZodSchemaToParamSchema(GeneralIdParamsSchema, 0))
    @ApiBody(transformZodSchemaToBodySchema(UpdateInsuranceRegistrationSchema))
    @UsePipes(
        new ValidationPipe({
            paramsSchema: GeneralIdParamsSchema,
            bodySchema: UpdateInsuranceRegistrationSchema,
        }),
    )
    async updateInsuranceRegistrationById(
        @Res() res: Response,
        @Param() params: GeneralIdParams,
        @Body() body: UpdateInsuranceRegistration,
    ): Promise<Response> {
        const insuranceRegistration =
            await this.insuranceRegistrationService.updateInsuranceRegistration(
                body,
                params.id,
            );
        const response: SuccessResponse = {
            message: "Custom registration updated",
            statusCode: HttpStatus.OK,
            data: { insuranceRegistration },
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
        await this.insuranceRegistrationService.deleteInsuranceRegistration(
            params.id,
        );
        const response: SuccessResponse = {
            message: "Custom registration deleted",
            statusCode: HttpStatus.OK,
            data: {},
        };
        return res.status(response.statusCode).json(response);
    }
}
