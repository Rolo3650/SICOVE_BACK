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
    type CreateModel,
    CreateModelSchema,
    type UpdateModel,
    UpdateModelSchema,
} from "src/schemas/model/body.schema";
import { SuccessResponse } from "src/schemas/response.schema";
import { ModelService } from "src/services/model.service";
import {
    transformZodSchemaToBodySchema,
    transformZodSchemaToParamSchema,
} from "src/utils/zodToOpenApi";

@Controller("/model")
@applyDecorators(ApiBearerAuth())
export class ModelController {
    private readonly modelService: ModelService;
    private readonly jwtService: JwtService;

    constructor(modelService: ModelService, jwtService: JwtService) {
        this.modelService = modelService;
        this.jwtService = jwtService;
    }

    @Get()
    async getModels(@Res() res: Response): Promise<Response> {
        const models = await this.modelService.getModels({
            include: {
                brand: true,
            },
        });
        const response: SuccessResponse = {
            message: "Models found",
            statusCode: HttpStatus.OK,
            data: {
                models,
            },
        };
        return res.status(response.statusCode).json(response);
    }

    @Post()
    @ApiBody(transformZodSchemaToBodySchema(CreateModelSchema))
    @UsePipes(
        new ValidationPipe({
            bodySchema: CreateModelSchema,
        }),
    )
    async createModel(
        @Res() res: Response,
        @Body() body: CreateModel,
    ): Promise<Response> {
        const model = await this.modelService.createModel(body);
        const response: SuccessResponse = {
            message: "Model created",
            statusCode: HttpStatus.CREATED,
            data: { model },
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
    async getModelById(
        @Res() res: Response,
        @Param() params: GeneralIdParams,
    ): Promise<Response> {
        const model = await this.modelService.getModel(params.id, {
            include: {
                brand: true,
            },
        });
        const response: SuccessResponse = {
            message: "Model found",
            statusCode: HttpStatus.OK,
            data: { model },
        };
        return res.status(response.statusCode).json(response);
    }

    @Put("byId/:id")
    @ApiParam(transformZodSchemaToParamSchema(GeneralIdParamsSchema, 0))
    @ApiBody(transformZodSchemaToBodySchema(UpdateModelSchema))
    @UsePipes(
        new ValidationPipe({
            paramsSchema: GeneralIdParamsSchema,
            bodySchema: UpdateModelSchema,
        }),
    )
    async updateModelById(
        @Res() res: Response,
        @Param() params: GeneralIdParams,
        @Body() body: UpdateModel,
    ): Promise<Response> {
        const model = await this.modelService.updateModel(body, params.id);
        const response: SuccessResponse = {
            message: "Model updated",
            statusCode: HttpStatus.OK,
            data: { model },
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
        await this.modelService.deleteModel(params.id);
        const response: SuccessResponse = {
            message: "Model deleted",
            statusCode: HttpStatus.OK,
            data: {},
        };
        return res.status(response.statusCode).json(response);
    }
}
