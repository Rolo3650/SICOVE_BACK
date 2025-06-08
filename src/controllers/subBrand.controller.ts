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
    type CreateSubBrand,
    CreateSubBrandSchema,
    type UpdateSubBrand,
    UpdateSubBrandSchema,
} from "src/schemas/subBrand/body.schema";
import { SubBrandService } from "src/services/subBrand.service";
import {
    transformZodSchemaToBodySchema,
    transformZodSchemaToParamSchema,
} from "src/utils/zodToOpenApi";

@Controller("/subBrand")
@applyDecorators(ApiBearerAuth())
export class SubBrandController {
    private readonly subBrandService: SubBrandService;
    private readonly jwtService: JwtService;

    constructor(subBrandService: SubBrandService, jwtService: JwtService) {
        this.subBrandService = subBrandService;
        this.jwtService = jwtService;
    }

    @Get()
    async getSubBrands(@Res() res: Response): Promise<Response> {
        const subBrands = await this.subBrandService.getSubBrands({
            include: {
                brand: true,
            },
        });
        const response: SuccessResponse = {
            message: "SubBrands found",
            statusCode: HttpStatus.OK,
            data: {
                subBrands,
            },
        };
        return res.status(response.statusCode).json(response);
    }

    @Post()
    @ApiBody(transformZodSchemaToBodySchema(CreateSubBrandSchema))
    @UsePipes(
        new ValidationPipe({
            bodySchema: CreateSubBrandSchema,
        }),
    )
    async createSubBrand(
        @Res() res: Response,
        @Body() body: CreateSubBrand,
    ): Promise<Response> {
        const subBrand = await this.subBrandService.createSubBrand(body);
        const response: SuccessResponse = {
            message: "SubBrand created",
            statusCode: HttpStatus.CREATED,
            data: { subBrand },
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
    async getSubBrandById(
        @Res() res: Response,
        @Param() params: GeneralIdParams,
    ): Promise<Response> {
        const subBrand = await this.subBrandService.getSubBrand(params.id, {
            include: {
                brand: true,
            },
        });
        const response: SuccessResponse = {
            message: "SubBrand found",
            statusCode: HttpStatus.OK,
            data: { subBrand },
        };
        return res.status(response.statusCode).json(response);
    }

    @Put("byId/:id")
    @ApiParam(transformZodSchemaToParamSchema(GeneralIdParamsSchema, 0))
    @ApiBody(transformZodSchemaToBodySchema(UpdateSubBrandSchema))
    @UsePipes(
        new ValidationPipe({
            paramsSchema: GeneralIdParamsSchema,
            bodySchema: UpdateSubBrandSchema,
        }),
    )
    async updateSubBrandById(
        @Res() res: Response,
        @Param() params: GeneralIdParams,
        @Body() body: UpdateSubBrand,
    ): Promise<Response> {
        const subBrand = await this.subBrandService.updateSubBrand(
            body,
            params.id,
        );
        const response: SuccessResponse = {
            message: "SubBrand updated",
            statusCode: HttpStatus.OK,
            data: { subBrand },
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
        await this.subBrandService.deleteSubBrand(params.id);
        const response: SuccessResponse = {
            message: "SubBrand deleted",
            statusCode: HttpStatus.OK,
            data: {},
        };
        return res.status(response.statusCode).json(response);
    }
}
