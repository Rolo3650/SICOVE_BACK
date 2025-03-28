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
    type CreateCountry,
    CreateCountrySchema,
    type UpdateCountry,
    UpdateCountrySchema,
} from "src/schemas/country/body.schema";
import {
    type GeneralIdParams,
    GeneralIdParamsSchema,
} from "src/schemas/general.schema";
import { SuccessResponse } from "src/schemas/response.schema";
import { CountryService } from "src/services/country.service";
import {
    transformZodSchemaToBodySchema,
    transformZodSchemaToParamSchema,
} from "src/utils/zodToOpenApi";

@Controller("/country")
@applyDecorators(ApiBearerAuth())
export class CountryController {
    private readonly countryService: CountryService;
    private readonly jwtService: JwtService;

    constructor(countryService: CountryService, jwtService: JwtService) {
        this.countryService = countryService;
        this.jwtService = jwtService;
    }

    @Get()
    async getCountrys(@Res() res: Response): Promise<Response> {
        const countries = await this.countryService.getCountrys();
        const response: SuccessResponse = {
            message: "Countrys found",
            statusCode: HttpStatus.OK,
            data: {
                countries,
            },
        };
        return res.status(response.statusCode).json(response);
    }

    @Post()
    @ApiBody(transformZodSchemaToBodySchema(CreateCountrySchema))
    @UsePipes(
        new ValidationPipe({
            bodySchema: CreateCountrySchema,
        }),
    )
    async createCountry(
        @Res() res: Response,
        @Body() body: CreateCountry,
    ): Promise<Response> {
        const country = await this.countryService.createCountry(body);
        const response: SuccessResponse = {
            message: "Country created",
            statusCode: HttpStatus.CREATED,
            data: { country },
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
    async getCountryById(
        @Res() res: Response,
        @Param() params: GeneralIdParams,
    ): Promise<Response> {
        const country = await this.countryService.getCountry(params.id);
        const response: SuccessResponse = {
            message: "Country found",
            statusCode: HttpStatus.OK,
            data: { country },
        };
        return res.status(response.statusCode).json(response);
    }

    @Put("byId/:id")
    @ApiParam(transformZodSchemaToParamSchema(GeneralIdParamsSchema, 0))
    @ApiBody(transformZodSchemaToBodySchema(UpdateCountrySchema))
    @UsePipes(
        new ValidationPipe({
            paramsSchema: GeneralIdParamsSchema,
            bodySchema: UpdateCountrySchema,
        }),
    )
    async updateCountryById(
        @Res() res: Response,
        @Param() params: GeneralIdParams,
        @Body() body: UpdateCountry,
    ): Promise<Response> {
        const country = await this.countryService.updateCountry(
            body,
            params.id,
        );
        const response: SuccessResponse = {
            message: "Country updated",
            statusCode: HttpStatus.OK,
            data: { country },
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
        await this.countryService.deleteCountry(params.id);
        const response: SuccessResponse = {
            message: "Country deleted",
            statusCode: HttpStatus.OK,
            data: {},
        };
        return res.status(response.statusCode).json(response);
    }
}
