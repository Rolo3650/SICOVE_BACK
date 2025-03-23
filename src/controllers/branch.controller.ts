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
    AssignVehiclesToBranch,
    AssignVehiclesToBranchSchema,
    type CreateBranch,
    CreateBranchSchema,
    type UpdateBranch,
    UpdateBranchSchema,
} from "src/schemas/branch/body.schema";
import {
    type GeneralIdParams,
    GeneralIdParamsSchema,
} from "src/schemas/general.schema";
import { SuccessResponse } from "src/schemas/response.schema";
import { BranchService } from "src/services/branch.service";
import {
    transformZodSchemaToBodySchema,
    transformZodSchemaToParamSchema,
} from "src/utils/zodToOpenApi";

@Controller("/branch")
@applyDecorators(ApiBearerAuth())
export class BranchController {
    private readonly branchService: BranchService;
    private readonly jwtService: JwtService;

    constructor(branchService: BranchService, jwtService: JwtService) {
        this.branchService = branchService;
        this.jwtService = jwtService;
    }

    @Get()
    async getBranches(@Res() res: Response): Promise<Response> {
        const branches = await this.branchService.getBranches({
            include: {
                city: {
                    include: {
                        municipality: {
                            include: {
                                state: true,
                            },
                        },
                    },
                },
            },
        });
        const response: SuccessResponse = {
            message: "Branches found",
            statusCode: HttpStatus.OK,
            data: {
                branches,
            },
        };
        return res.status(response.statusCode).json(response);
    }

    @Post()
    @ApiBody(transformZodSchemaToBodySchema(CreateBranchSchema))
    @UsePipes(
        new ValidationPipe({
            bodySchema: CreateBranchSchema,
        }),
    )
    async createBranch(
        @Res() res: Response,
        @Body() body: CreateBranch,
    ): Promise<Response> {
        const branch = await this.branchService.createBranch(body);
        const response: SuccessResponse = {
            message: "Branch created",
            statusCode: HttpStatus.CREATED,
            data: { branch },
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
    async getBranchById(
        @Res() res: Response,
        @Param() params: GeneralIdParams,
    ): Promise<Response> {
        const branch = await this.branchService.getBranch(params.id, {
            include: {
                city: {
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
                vehicles: {
                    include: {
                        version: {
                            include: {
                                model: true,
                            },
                        },
                    },
                },
            },
        });
        const response: SuccessResponse = {
            message: "Branch found",
            statusCode: HttpStatus.OK,
            data: { branch },
        };
        return res.status(response.statusCode).json(response);
    }

    @Put("byId/:id")
    @ApiParam(transformZodSchemaToParamSchema(GeneralIdParamsSchema, 0))
    @ApiBody(transformZodSchemaToBodySchema(UpdateBranchSchema))
    @UsePipes(
        new ValidationPipe({
            paramsSchema: GeneralIdParamsSchema,
            bodySchema: UpdateBranchSchema,
        }),
    )
    async updateBranchById(
        @Res() res: Response,
        @Param() params: GeneralIdParams,
        @Body() body: UpdateBranch,
    ): Promise<Response> {
        const branch = await this.branchService.updateBranch(body, params.id);
        const response: SuccessResponse = {
            message: "Branch updated",
            statusCode: HttpStatus.OK,
            data: { branch },
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
        await this.branchService.deleteBranch(params.id);
        const response: SuccessResponse = {
            message: "Branch deleted",
            statusCode: HttpStatus.OK,
            data: {},
        };
        return res.status(response.statusCode).json(response);
    }

    // biome-ignore lint/nursery/noSecrets: is not a secret
    @Put("assignVehiclesToBranch/:id")
    @ApiParam(transformZodSchemaToParamSchema(GeneralIdParamsSchema, 0))
    @ApiBody(transformZodSchemaToBodySchema(AssignVehiclesToBranchSchema))
    @UsePipes(
        new ValidationPipe({
            paramsSchema: GeneralIdParamsSchema,
            bodySchema: AssignVehiclesToBranchSchema,
        }),
    )
    async assignVehiclesToBranch(
        @Res() res: Response,
        @Param() params: GeneralIdParams,
        @Body() body: AssignVehiclesToBranch,
    ): Promise<Response> {
        const branch = await this.branchService.assingVehiclesToBranch(
            body,
            params.id,
        );
        const response: SuccessResponse = {
            message: "Branch updated",
            statusCode: HttpStatus.OK,
            data: { branch },
        };
        return res.status(response.statusCode).json(response);
    }
}
