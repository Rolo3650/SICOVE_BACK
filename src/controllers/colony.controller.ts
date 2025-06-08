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
    type CreateColony,
    CreateColonySchema,
    type UpdateColony,
    UpdateColonySchema,
} from "src/schemas/colony/body.schema";
import {
    type GeneralIdParams,
    GeneralIdParamsSchema,
} from "src/schemas/general.schema";
import { SuccessResponse } from "src/schemas/response.schema";
import { ColonyService } from "src/services/colony.service";
import {
    transformZodSchemaToBodySchema,
    transformZodSchemaToParamSchema,
} from "src/utils/zodToOpenApi";

@Controller("/colony")
@applyDecorators(ApiBearerAuth())
export class ColonyController {
    private readonly colonyService: ColonyService;
    private readonly jwtService: JwtService;

    constructor(colonyService: ColonyService, jwtService: JwtService) {
        this.colonyService = colonyService;
        this.jwtService = jwtService;
    }

    @Get()
    async getCities(@Res() res: Response): Promise<Response> {
        const colonies = await this.colonyService.getColonies({
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
                colonies,
            },
        };
        return res.status(response.statusCode).json(response);
    }

    @Post()
    @ApiBody(transformZodSchemaToBodySchema(CreateColonySchema))
    @UsePipes(
        new ValidationPipe({
            bodySchema: CreateColonySchema,
        }),
    )
    async createColony(
        @Res() res: Response,
        @Body() body: CreateColony,
    ): Promise<Response> {
        const colony = await this.colonyService.createColony(body);
        const response: SuccessResponse = {
            message: "Colony created",
            statusCode: HttpStatus.CREATED,
            data: { colony },
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
    async getColonyById(
        @Res() res: Response,
        @Param() params: GeneralIdParams,
    ): Promise<Response> {
        const colony = await this.colonyService.getColony(params.id, {
            include: {
                municipality: {
                    include: {
                        state: {
                            include: { country: true },
                        },
                    },
                },
            },
        });
        const response: SuccessResponse = {
            message: "Colony found",
            statusCode: HttpStatus.OK,
            data: { colony },
        };
        return res.status(response.statusCode).json(response);
    }

    @Put("byId/:id")
    @ApiParam(transformZodSchemaToParamSchema(GeneralIdParamsSchema, 0))
    @ApiBody(transformZodSchemaToBodySchema(UpdateColonySchema))
    @UsePipes(
        new ValidationPipe({
            paramsSchema: GeneralIdParamsSchema,
            bodySchema: UpdateColonySchema,
        }),
    )
    async updateColonyById(
        @Res() res: Response,
        @Param() params: GeneralIdParams,
        @Body() body: UpdateColony,
    ): Promise<Response> {
        const colony = await this.colonyService.updateColony(body, params.id);
        const response: SuccessResponse = {
            message: "Colony updated",
            statusCode: HttpStatus.OK,
            data: { colony },
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
        await this.colonyService.deleteColony(params.id);
        const response: SuccessResponse = {
            message: "Colony deleted",
            statusCode: HttpStatus.OK,
            data: {},
        };
        return res.status(response.statusCode).json(response);
    }
}
