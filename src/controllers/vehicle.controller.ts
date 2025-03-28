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
    type CreateVehicle,
    CreateVehicleSchema,
    type UpdateVehicle,
    UpdateVehicleSchema,
} from "src/schemas/vehicle/body.schema";
import { VehicleService } from "src/services/vehicle.service";
import {
    transformZodSchemaToBodySchema,
    transformZodSchemaToParamSchema,
} from "src/utils/zodToOpenApi";

@Controller("/vehicle")
@applyDecorators(ApiBearerAuth())
export class VehicleController {
    private readonly vehicleService: VehicleService;
    private readonly jwtService: JwtService;

    constructor(vehicleService: VehicleService, jwtService: JwtService) {
        this.vehicleService = vehicleService;
        this.jwtService = jwtService;
    }

    @Get()
    async getVehicles(@Res() res: Response): Promise<Response> {
        const vehicles = await this.vehicleService.getVehicles({
            include: {
                version: {
                    include: {
                        model: true,
                    },
                },
            },
        });
        const response: SuccessResponse = {
            message: "Vehicles found",
            statusCode: HttpStatus.OK,
            data: {
                vehicles,
            },
        };
        return res.status(response.statusCode).json(response);
    }

    @Post()
    @ApiBody(transformZodSchemaToBodySchema(CreateVehicleSchema))
    @UsePipes(
        new ValidationPipe({
            bodySchema: CreateVehicleSchema,
        }),
    )
    async createVehicle(
        @Res() res: Response,
        @Body() body: CreateVehicle,
    ): Promise<Response> {
        const vehicle = await this.vehicleService.createVehicle(body);
        const response: SuccessResponse = {
            message: "Vehicle created",
            statusCode: HttpStatus.CREATED,
            data: { vehicle },
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
    async getVehicleById(
        @Res() res: Response,
        @Param() params: GeneralIdParams,
    ): Promise<Response> {
        const vehicle = await this.vehicleService.getVehicle(params.id, {
            include: {
                version: {
                    include: {
                        model: {
                            include: {
                                brand: true,
                            },
                        },
                    },
                },
            },
        });
        const response: SuccessResponse = {
            message: "Vehicle found",
            statusCode: HttpStatus.OK,
            data: { vehicle },
        };
        return res.status(response.statusCode).json(response);
    }

    @Put("byId/:id")
    @ApiParam(transformZodSchemaToParamSchema(GeneralIdParamsSchema, 0))
    @ApiBody(transformZodSchemaToBodySchema(UpdateVehicleSchema))
    @UsePipes(
        new ValidationPipe({
            paramsSchema: GeneralIdParamsSchema,
            bodySchema: UpdateVehicleSchema,
        }),
    )
    async updateVehicleById(
        @Res() res: Response,
        @Param() params: GeneralIdParams,
        @Body() body: UpdateVehicle,
    ): Promise<Response> {
        const vehicle = await this.vehicleService.updateVehicle(
            body,
            params.id,
        );
        const response: SuccessResponse = {
            message: "Vehicle updated",
            statusCode: HttpStatus.OK,
            data: { vehicle },
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
        await this.vehicleService.deleteVehicle(params.id);
        const response: SuccessResponse = {
            message: "Vehicle deleted",
            statusCode: HttpStatus.OK,
            data: {},
        };
        return res.status(response.statusCode).json(response);
    }
}
