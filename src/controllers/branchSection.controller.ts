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
    type CreateBranchSection,
    CreateBranchSectionSchema,
    type UpdateBranchSection,
    UpdateBranchSectionSchema,
} from "src/schemas/branchSection/body.schema";
import {
    type GeneralIdParams,
    GeneralIdParamsSchema,
} from "src/schemas/general.schema";
import { SuccessResponse } from "src/schemas/response.schema";
import { BranchSectionService } from "src/services/branchSection.service";
import {
    transformZodSchemaToBodySchema,
    transformZodSchemaToParamSchema,
} from "src/utils/zodToOpenApi";

@Controller("/branch-section")
@applyDecorators(ApiBearerAuth())
export class BranchSectionController {
    private readonly branchSectionService: BranchSectionService;
    private readonly jwtService: JwtService;

    constructor(
        branchSectionService: BranchSectionService,
        jwtService: JwtService,
    ) {
        this.branchSectionService = branchSectionService;
        this.jwtService = jwtService;
    }

    @Get()
    async getBranchSectiones(@Res() res: Response): Promise<Response> {
        const branchSections =
            await this.branchSectionService.getBranchSections({
                include: {
                    branch: {
                        include: {
                            colony: {
                                include: {
                                    municipality: {
                                        include: {
                                            state: {
                                                include: { country: true },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
        const response: SuccessResponse = {
            message: "BranchSectiones found",
            statusCode: HttpStatus.OK,
            data: {
                branchSections,
            },
        };
        return res.status(response.statusCode).json(response);
    }

    @Post()
    @ApiBody(transformZodSchemaToBodySchema(CreateBranchSectionSchema))
    @UsePipes(
        new ValidationPipe({
            bodySchema: CreateBranchSectionSchema,
        }),
    )
    async createBranchSection(
        @Res() res: Response,
        @Body() body: CreateBranchSection,
    ): Promise<Response> {
        const branchSection =
            await this.branchSectionService.createBranchSection(body);
        const response: SuccessResponse = {
            message: "BranchSection created",
            statusCode: HttpStatus.CREATED,
            data: { branchSection },
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
    async getBranchSectionById(
        @Res() res: Response,
        @Param() params: GeneralIdParams,
    ): Promise<Response> {
        const branchSection = await this.branchSectionService.getBranchSection(
            params.id,
            {
                include: {
                    branch: {
                        include: {
                            colony: {
                                include: {
                                    municipality: {
                                        include: {
                                            state: {
                                                include: { country: true },
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
                },
            },
        );
        const response: SuccessResponse = {
            message: "BranchSection found",
            statusCode: HttpStatus.OK,
            data: { branchSection },
        };
        return res.status(response.statusCode).json(response);
    }

    @Put("byId/:id")
    @ApiParam(transformZodSchemaToParamSchema(GeneralIdParamsSchema, 0))
    @ApiBody(transformZodSchemaToBodySchema(UpdateBranchSectionSchema))
    @UsePipes(
        new ValidationPipe({
            paramsSchema: GeneralIdParamsSchema,
            bodySchema: UpdateBranchSectionSchema,
        }),
    )
    async updateBranchSectionById(
        @Res() res: Response,
        @Param() params: GeneralIdParams,
        @Body() body: UpdateBranchSection,
    ): Promise<Response> {
        const branchSection =
            await this.branchSectionService.updateBranchSection(
                body,
                params.id,
            );
        const response: SuccessResponse = {
            message: "BranchSection updated",
            statusCode: HttpStatus.OK,
            data: { branchSection },
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
        await this.branchSectionService.deleteBranchSection(params.id);
        const response: SuccessResponse = {
            message: "BranchSection deleted",
            statusCode: HttpStatus.OK,
            data: {},
        };
        return res.status(response.statusCode).json(response);
    }
}
