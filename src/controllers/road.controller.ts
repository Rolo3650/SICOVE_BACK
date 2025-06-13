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
    type CreateRoad,
    CreateRoadSchema,
    type UpdateRoad,
    UpdateRoadSchema,
} from "src/schemas/road/body.schema";
import { RoadService } from "src/services/road.service";
import {
    transformZodSchemaToBodySchema,
    transformZodSchemaToParamSchema,
} from "src/utils/zodToOpenApi";

@Controller("/road")
@applyDecorators(ApiBearerAuth())
export class RoadController {
    private readonly roadService: RoadService;
    private readonly jwtService: JwtService;

    constructor(roadService: RoadService, jwtService: JwtService) {
        this.roadService = roadService;
        this.jwtService = jwtService;
    }

    @Get()
    async getRoads(@Res() res: Response): Promise<Response> {
        const roads = await this.roadService.getRoads({
            include: {
                municipality: {
                    include: {
                        state: true,
                    },
                },
            },
        });
        const response: SuccessResponse = {
            message: "Cities found",
            statusCode: HttpStatus.OK,
            data: {
                roads,
            },
        };
        return res.status(response.statusCode).json(response);
    }

    @Post()
    @ApiBody(transformZodSchemaToBodySchema(CreateRoadSchema))
    @UsePipes(
        new ValidationPipe({
            bodySchema: CreateRoadSchema,
        }),
    )
    async createRoad(
        @Res() res: Response,
        @Body() body: CreateRoad,
    ): Promise<Response> {
        const road = await this.roadService.createRoad(body);
        const response: SuccessResponse = {
            message: "Road created",
            statusCode: HttpStatus.CREATED,
            data: { road },
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
    async getRoadById(
        @Res() res: Response,
        @Param() params: GeneralIdParams,
    ): Promise<Response> {
        const road = await this.roadService.getRoad(params.id, {
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
        });
        const response: SuccessResponse = {
            message: "Road found",
            statusCode: HttpStatus.OK,
            data: { road },
        };
        return res.status(response.statusCode).json(response);
    }

    @Put("byId/:id")
    @ApiParam(transformZodSchemaToParamSchema(GeneralIdParamsSchema, 0))
    @ApiBody(transformZodSchemaToBodySchema(UpdateRoadSchema))
    @UsePipes(
        new ValidationPipe({
            paramsSchema: GeneralIdParamsSchema,
            bodySchema: UpdateRoadSchema,
        }),
    )
    async updateRoadById(
        @Res() res: Response,
        @Param() params: GeneralIdParams,
        @Body() body: UpdateRoad,
    ): Promise<Response> {
        const road = await this.roadService.updateRoad(body, params.id);
        const response: SuccessResponse = {
            message: "Road updated",
            statusCode: HttpStatus.OK,
            data: { road },
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
        await this.roadService.deleteRoad(params.id);
        const response: SuccessResponse = {
            message: "Road deleted",
            statusCode: HttpStatus.OK,
            data: {},
        };
        return res.status(response.statusCode).json(response);
    }
}
