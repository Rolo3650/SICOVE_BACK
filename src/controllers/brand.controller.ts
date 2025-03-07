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
    type CreateBrand,
    CreateBrandSchema,
    type UpdateBrand,
    UpdateBrandSchema,
} from "src/schemas/brand/body.schema";
import {
    type GeneralIdParams,
    GeneralIdParamsSchema,
} from "src/schemas/general.schema";
import { SuccessResponse } from "src/schemas/response.schema";
import { BrandService } from "src/services/brand.service";
import {
    transformZodSchemaToBodySchema,
    transformZodSchemaToParamSchema,
} from "src/utils/zodToOpenApi";

@Controller("/brand")
@applyDecorators(ApiBearerAuth())
export class BrandController {
    private readonly brandService: BrandService;
    private readonly jwtService: JwtService;

    constructor(brandService: BrandService, jwtService: JwtService) {
        this.brandService = brandService;
        this.jwtService = jwtService;
    }

    @Get()
    async getBrands(@Res() res: Response): Promise<Response> {
        const brands = await this.brandService.getBrands();
        const response: SuccessResponse = {
            message: "Brands found",
            statusCode: HttpStatus.FOUND,
            data: {
                brands,
            },
        };
        return res.status(response.statusCode).json(response);
    }

    @Post()
    @ApiBody(transformZodSchemaToBodySchema(CreateBrandSchema))
    @UsePipes(
        new ValidationPipe({
            bodySchema: CreateBrandSchema,
        }),
    )
    async createBrand(
        @Res() res: Response,
        @Body() body: CreateBrand,
    ): Promise<Response> {
        const brand = await this.brandService.createBrand(body);
        const response: SuccessResponse = {
            message: "Brand created",
            statusCode: HttpStatus.CREATED,
            data: { brand },
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
    async getBrandById(
        @Res() res: Response,
        @Param() params: GeneralIdParams,
    ): Promise<Response> {
        const brand = await this.brandService.getBrand(params.id as string);
        const response: SuccessResponse = {
            message: "Brand found",
            statusCode: HttpStatus.FOUND,
            data: { brand },
        };
        return res.status(response.statusCode).json(response);
    }

    @Put("byId/:id")
    @ApiParam(transformZodSchemaToParamSchema(GeneralIdParamsSchema, 0))
    @ApiBody(transformZodSchemaToBodySchema(UpdateBrandSchema))
    @UsePipes(
        new ValidationPipe({
            paramsSchema: GeneralIdParamsSchema,
            bodySchema: UpdateBrandSchema,
        }),
    )
    async updateBrandById(
        @Res() res: Response,
        @Param() params: GeneralIdParams,
        @Body() body: UpdateBrand,
    ): Promise<Response> {
        const brand = await this.brandService.updateBrand(
            body,
            params.id as string,
        );
        const response: SuccessResponse = {
            message: "Brand updated",
            statusCode: HttpStatus.OK,
            data: { brand },
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
        await this.brandService.deleteBrand(params.id as string);
        const response: SuccessResponse = {
            message: "Brand deleted",
            statusCode: HttpStatus.OK,
            data: {},
        };
        return res.status(response.statusCode).json(response);
    }
}
