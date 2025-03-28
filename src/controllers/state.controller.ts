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
    type CreateState,
    CreateStateSchema,
    type UpdateState,
    UpdateStateSchema,
} from "src/schemas/state/body.schema";
import { StateService } from "src/services/state.service";
import {
    transformZodSchemaToBodySchema,
    transformZodSchemaToParamSchema,
} from "src/utils/zodToOpenApi";

@Controller("/state")
@applyDecorators(ApiBearerAuth())
export class StateController {
    private readonly stateService: StateService;
    private readonly jwtService: JwtService;

    constructor(stateService: StateService, jwtService: JwtService) {
        this.stateService = stateService;
        this.jwtService = jwtService;
    }

    @Get()
    async getStates(@Res() res: Response): Promise<Response> {
        const states = await this.stateService.getStates({
            include: {
                country: true,
            },
        });
        const response: SuccessResponse = {
            message: "States found",
            statusCode: HttpStatus.OK,
            data: {
                states,
            },
        };
        return res.status(response.statusCode).json(response);
    }

    @Post()
    @ApiBody(transformZodSchemaToBodySchema(CreateStateSchema))
    @UsePipes(
        new ValidationPipe({
            bodySchema: CreateStateSchema,
        }),
    )
    async createState(
        @Res() res: Response,
        @Body() body: CreateState,
    ): Promise<Response> {
        const state = await this.stateService.createState(body);
        const response: SuccessResponse = {
            message: "State created",
            statusCode: HttpStatus.CREATED,
            data: { state },
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
    async getStateById(
        @Res() res: Response,
        @Param() params: GeneralIdParams,
    ): Promise<Response> {
        const state = await this.stateService.getState(params.id, {
            include: {
                country: true,
            },
        });
        const response: SuccessResponse = {
            message: "State found",
            statusCode: HttpStatus.OK,
            data: { state },
        };
        return res.status(response.statusCode).json(response);
    }

    @Put("byId/:id")
    @ApiParam(transformZodSchemaToParamSchema(GeneralIdParamsSchema, 0))
    @ApiBody(transformZodSchemaToBodySchema(UpdateStateSchema))
    @UsePipes(
        new ValidationPipe({
            paramsSchema: GeneralIdParamsSchema,
            bodySchema: UpdateStateSchema,
        }),
    )
    async updateStateById(
        @Res() res: Response,
        @Param() params: GeneralIdParams,
        @Body() body: UpdateState,
    ): Promise<Response> {
        const state = await this.stateService.updateState(body, params.id);
        const response: SuccessResponse = {
            message: "State updated",
            statusCode: HttpStatus.OK,
            data: { state },
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
        await this.stateService.deleteState(params.id);
        const response: SuccessResponse = {
            message: "State deleted",
            statusCode: HttpStatus.OK,
            data: {},
        };
        return res.status(response.statusCode).json(response);
    }
}
