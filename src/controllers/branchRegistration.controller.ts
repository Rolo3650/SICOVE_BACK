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
    type CreateBranchRegistration,
    CreateBranchRegistrationSchema,
    type UpdateBranchRegistration,
    UpdateBranchRegistrationSchema,
} from "src/schemas/branchRegistration/body.schema";
import {
    type GeneralIdParams,
    GeneralIdParamsSchema,
} from "src/schemas/general.schema";
import { SuccessResponse } from "src/schemas/response.schema";
import { BranchRegistrationService } from "src/services/branchRegistration.service";
import {
    transformZodSchemaToBodySchema,
    transformZodSchemaToParamSchema,
} from "src/utils/zodToOpenApi";

@Controller("/branch-registration")
@applyDecorators(ApiBearerAuth())
export class BranchRegistrationController {
    private readonly branchRegistrationService: BranchRegistrationService;
    private readonly jwtService: JwtService;

    constructor(
        branchRegistrationService: BranchRegistrationService,
        jwtService: JwtService,
    ) {
        this.branchRegistrationService = branchRegistrationService;
        this.jwtService = jwtService;
    }

    @Get()
    async getBranchRegistrations(@Res() res: Response): Promise<Response> {
        const branchRegistrations =
            await this.branchRegistrationService.getBranchRegistrations({
                include: {
                    branchSection: true,
                    vehicle: true,
                    user: true,
                },
            });
        const response: SuccessResponse = {
            message: "Branch registrationes found",
            statusCode: HttpStatus.OK,
            data: {
                branchRegistrations,
            },
        };
        return res.status(response.statusCode).json(response);
    }

    @Post()
    @ApiBody(transformZodSchemaToBodySchema(CreateBranchRegistrationSchema))
    @UsePipes(
        new ValidationPipe({
            bodySchema: CreateBranchRegistrationSchema,
        }),
    )
    async createBranchRegistration(
        @Res() res: Response,
        @Body() body: CreateBranchRegistration,
    ): Promise<Response> {
        const branchRegistration =
            await this.branchRegistrationService.createBranchRegistration(body);
        const response: SuccessResponse = {
            message: "Branch registration created",
            statusCode: HttpStatus.CREATED,
            data: { branchRegistration },
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
    async getBranchRegistrationById(
        @Res() res: Response,
        @Param() params: GeneralIdParams,
    ): Promise<Response> {
        const branchRegistration =
            await this.branchRegistrationService.getBranchRegistration(
                params.id,
                {
                    include: {
                        branchSection: {
                            include: {
                                branch: {
                                    include: {
                                        colony: {
                                            include: {
                                                municipality: {
                                                    include: {
                                                        state: {
                                                            include: {
                                                                country: true,
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        vehicle: {
                            include: {
                                version: {
                                    include: {
                                        model: true,
                                    },
                                },
                            },
                        },
                        user: true,
                    },
                },
            );
        const response: SuccessResponse = {
            message: "Branch registration found",
            statusCode: HttpStatus.OK,
            data: { branchRegistration },
        };
        return res.status(response.statusCode).json(response);
    }

    @Put("byId/:id")
    @ApiParam(transformZodSchemaToParamSchema(GeneralIdParamsSchema, 0))
    @ApiBody(transformZodSchemaToBodySchema(UpdateBranchRegistrationSchema))
    @UsePipes(
        new ValidationPipe({
            paramsSchema: GeneralIdParamsSchema,
            bodySchema: UpdateBranchRegistrationSchema,
        }),
    )
    async updateBranchRegistrationById(
        @Res() res: Response,
        @Param() params: GeneralIdParams,
        @Body() body: UpdateBranchRegistration,
    ): Promise<Response> {
        const branchRegistration =
            await this.branchRegistrationService.updateBranchRegistration(
                body,
                params.id,
            );
        const response: SuccessResponse = {
            message: "Branch registration updated",
            statusCode: HttpStatus.OK,
            data: { branchRegistration },
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
        await this.branchRegistrationService.deleteBranchRegistration(
            params.id,
        );
        const response: SuccessResponse = {
            message: "Branch registration deleted",
            statusCode: HttpStatus.OK,
            data: {},
        };
        return res.status(response.statusCode).json(response);
    }
}
