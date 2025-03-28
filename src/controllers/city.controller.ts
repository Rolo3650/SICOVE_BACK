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
    type CreateCity,
    CreateCitySchema,
    type UpdateCity,
    UpdateCitySchema,
} from "src/schemas/city/body.schema";
import {
    type GeneralIdParams,
    GeneralIdParamsSchema,
} from "src/schemas/general.schema";
import { SuccessResponse } from "src/schemas/response.schema";
import { CityService } from "src/services/city.service";
import {
    transformZodSchemaToBodySchema,
    transformZodSchemaToParamSchema,
} from "src/utils/zodToOpenApi";

@Controller("/city")
@applyDecorators(ApiBearerAuth())
export class CityController {
    private readonly cityService: CityService;
    private readonly jwtService: JwtService;

    constructor(cityService: CityService, jwtService: JwtService) {
        this.cityService = cityService;
        this.jwtService = jwtService;
    }

    @Get()
    async getCities(@Res() res: Response): Promise<Response> {
        const cities = await this.cityService.getCities({
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
                cities,
            },
        };
        return res.status(response.statusCode).json(response);
    }

    @Post()
    @ApiBody(transformZodSchemaToBodySchema(CreateCitySchema))
    @UsePipes(
        new ValidationPipe({
            bodySchema: CreateCitySchema,
        }),
    )
    async createCity(
        @Res() res: Response,
        @Body() body: CreateCity,
    ): Promise<Response> {
        const city = await this.cityService.createCity(body);
        const response: SuccessResponse = {
            message: "City created",
            statusCode: HttpStatus.CREATED,
            data: { city },
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
    async getCityById(
        @Res() res: Response,
        @Param() params: GeneralIdParams,
    ): Promise<Response> {
        const city = await this.cityService.getCity(params.id, {
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
            message: "City found",
            statusCode: HttpStatus.OK,
            data: { city },
        };
        return res.status(response.statusCode).json(response);
    }

    @Put("byId/:id")
    @ApiParam(transformZodSchemaToParamSchema(GeneralIdParamsSchema, 0))
    @ApiBody(transformZodSchemaToBodySchema(UpdateCitySchema))
    @UsePipes(
        new ValidationPipe({
            paramsSchema: GeneralIdParamsSchema,
            bodySchema: UpdateCitySchema,
        }),
    )
    async updateCityById(
        @Res() res: Response,
        @Param() params: GeneralIdParams,
        @Body() body: UpdateCity,
    ): Promise<Response> {
        const city = await this.cityService.updateCity(body, params.id);
        const response: SuccessResponse = {
            message: "City updated",
            statusCode: HttpStatus.OK,
            data: { city },
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
        await this.cityService.deleteCity(params.id);
        const response: SuccessResponse = {
            message: "City deleted",
            statusCode: HttpStatus.OK,
            data: {},
        };
        return res.status(response.statusCode).json(response);
    }
}
