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
    type CreateMunicipality,
    CreateMunicipalitySchema,
    type UpdateMunicipality,
    UpdateMunicipalitySchema,
} from "src/schemas/municipality/body.schema";
import { SuccessResponse } from "src/schemas/response.schema";
import { MunicipalityService } from "src/services/municipality.service";
import {
    transformZodSchemaToBodySchema,
    transformZodSchemaToParamSchema,
} from "src/utils/zodToOpenApi";

@Controller("/municipality")
@applyDecorators(ApiBearerAuth())
export class MunicipalityController {
    private readonly municipalityService: MunicipalityService;
    private readonly jwtService: JwtService;

    constructor(
        municipalityService: MunicipalityService,
        jwtService: JwtService,
    ) {
        this.municipalityService = municipalityService;
        this.jwtService = jwtService;
    }

    @Get()
    async getMunicipalities(@Res() res: Response): Promise<Response> {
        const municipalities = await this.municipalityService.getMunicipalities(
            {
                include: {
                    state: {
                        include: { country: true },
                    },
                },
            },
        );
        const response: SuccessResponse = {
            message: "Municipalities found",
            statusCode: HttpStatus.OK,
            data: {
                municipalities,
            },
        };
        return res.status(response.statusCode).json(response);
    }

    @Post()
    @ApiBody(transformZodSchemaToBodySchema(CreateMunicipalitySchema))
    @UsePipes(
        new ValidationPipe({
            bodySchema: CreateMunicipalitySchema,
        }),
    )
    async createMunicipality(
        @Res() res: Response,
        @Body() body: CreateMunicipality,
    ): Promise<Response> {
        const municipality =
            await this.municipalityService.createMunicipality(body);
        const response: SuccessResponse = {
            message: "Municipality created",
            statusCode: HttpStatus.CREATED,
            data: { municipality },
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
    async getMunicipalityById(
        @Res() res: Response,
        @Param() params: GeneralIdParams,
    ): Promise<Response> {
        const municipality = await this.municipalityService.getMunicipality(
            params.id,
            {
                include: {
                    state: {
                        include: { country: true },
                    },
                },
            },
        );
        const response: SuccessResponse = {
            message: "Municipality found",
            statusCode: HttpStatus.OK,
            data: { municipality },
        };
        return res.status(response.statusCode).json(response);
    }

    @Put("byId/:id")
    @ApiParam(transformZodSchemaToParamSchema(GeneralIdParamsSchema, 0))
    @ApiBody(transformZodSchemaToBodySchema(UpdateMunicipalitySchema))
    @UsePipes(
        new ValidationPipe({
            paramsSchema: GeneralIdParamsSchema,
            bodySchema: UpdateMunicipalitySchema,
        }),
    )
    async updateMunicipalityById(
        @Res() res: Response,
        @Param() params: GeneralIdParams,
        @Body() body: UpdateMunicipality,
    ): Promise<Response> {
        const municipality = await this.municipalityService.updateMunicipality(
            body,
            params.id,
        );
        const response: SuccessResponse = {
            message: "Municipality updated",
            statusCode: HttpStatus.OK,
            data: { municipality },
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
        await this.municipalityService.deleteMunicipality(params.id);
        const response: SuccessResponse = {
            message: "Municipality deleted",
            statusCode: HttpStatus.OK,
            data: {},
        };
        return res.status(response.statusCode).json(response);
    }
}
