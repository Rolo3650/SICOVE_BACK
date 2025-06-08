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
    type CreateCustomRegistration,
    CreateCustomRegistrationSchema,
    type UpdateCustomRegistration,
    UpdateCustomRegistrationSchema,
} from "src/schemas/customRegistration/body.schema";
import {
    type GeneralIdParams,
    GeneralIdParamsSchema,
} from "src/schemas/general.schema";
import { SuccessResponse } from "src/schemas/response.schema";
import { CustomRegistrationService } from "src/services/customRegistration.service";
import {
    transformZodSchemaToBodySchema,
    transformZodSchemaToParamSchema,
} from "src/utils/zodToOpenApi";

@Controller("/custom-registration")
@applyDecorators(ApiBearerAuth())
export class CustomRegistrationController {
    private readonly customRegistrationService: CustomRegistrationService;
    private readonly jwtService: JwtService;

    constructor(
        customRegistrationService: CustomRegistrationService,
        jwtService: JwtService,
    ) {
        this.customRegistrationService = customRegistrationService;
        this.jwtService = jwtService;
    }

    @Get()
    async getCustomRegistrations(@Res() res: Response): Promise<Response> {
        const customRegistrations =
            await this.customRegistrationService.getCustomRegistrations({
                include: {
                    vehicle: true,
                },
            });
        const response: SuccessResponse = {
            message: "Custom registrations found",
            statusCode: HttpStatus.OK,
            data: {
                customRegistrations,
            },
        };
        return res.status(response.statusCode).json(response);
    }

    @Post()
    @ApiBody(transformZodSchemaToBodySchema(CreateCustomRegistrationSchema))
    @UsePipes(
        new ValidationPipe({
            bodySchema: CreateCustomRegistrationSchema,
        }),
    )
    async createCustomRegistration(
        @Res() res: Response,
        @Body() body: CreateCustomRegistration,
    ): Promise<Response> {
        const customRegistration =
            await this.customRegistrationService.createCustomRegistration(body);
        const response: SuccessResponse = {
            message: "Custom registration created",
            statusCode: HttpStatus.CREATED,
            data: { customRegistration },
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
    async getCustomRegistrationById(
        @Res() res: Response,
        @Param() params: GeneralIdParams,
    ): Promise<Response> {
        const customRegistration =
            await this.customRegistrationService.getCustomRegistration(
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
            data: { customRegistration },
        };
        return res.status(response.statusCode).json(response);
    }

    @Put("byId/:id")
    @ApiParam(transformZodSchemaToParamSchema(GeneralIdParamsSchema, 0))
    @ApiBody(transformZodSchemaToBodySchema(UpdateCustomRegistrationSchema))
    @UsePipes(
        new ValidationPipe({
            paramsSchema: GeneralIdParamsSchema,
            bodySchema: UpdateCustomRegistrationSchema,
        }),
    )
    async updateCustomRegistrationById(
        @Res() res: Response,
        @Param() params: GeneralIdParams,
        @Body() body: UpdateCustomRegistration,
    ): Promise<Response> {
        const customRegistration =
            await this.customRegistrationService.updateCustomRegistration(
                body,
                params.id,
            );
        const response: SuccessResponse = {
            message: "Custom registration updated",
            statusCode: HttpStatus.OK,
            data: { customRegistration },
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
        await this.customRegistrationService.deleteCustomRegistration(
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
