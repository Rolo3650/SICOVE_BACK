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
    type CreateVersion,
    CreateVersionSchema,
    type UpdateVersion,
    UpdateVersionSchema,
} from "src/schemas/version/body.schema";
import { VersionService } from "src/services/version.service";
import {
    transformZodSchemaToBodySchema,
    transformZodSchemaToParamSchema,
} from "src/utils/zodToOpenApi";

@Controller("/version")
@applyDecorators(ApiBearerAuth())
export class VersionController {
    private readonly versionService: VersionService;
    private readonly jwtService: JwtService;

    constructor(versionService: VersionService, jwtService: JwtService) {
        this.versionService = versionService;
        this.jwtService = jwtService;
    }

    @Get()
    async getVersions(@Res() res: Response): Promise<Response> {
        const versions = await this.versionService.getVersions({
            include: {
                model: true,
            },
        });
        const response: SuccessResponse = {
            message: "Versions found",
            statusCode: HttpStatus.OK,
            data: {
                versions,
            },
        };
        return res.status(response.statusCode).json(response);
    }

    @Post()
    @ApiBody(transformZodSchemaToBodySchema(CreateVersionSchema))
    @UsePipes(
        new ValidationPipe({
            bodySchema: CreateVersionSchema,
        }),
    )
    async createVersion(
        @Res() res: Response,
        @Body() body: CreateVersion,
    ): Promise<Response> {
        const version = await this.versionService.createVersion(body);
        const response: SuccessResponse = {
            message: "Version created",
            statusCode: HttpStatus.CREATED,
            data: { version },
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
    async getVersionById(
        @Res() res: Response,
        @Param() params: GeneralIdParams,
    ): Promise<Response> {
        const version = await this.versionService.getVersion(params.id, {
            include: {
                model: {
                    include: {
                        subBrand: {
                            include: {
                                brand: true,
                            },
                        },
                    },
                },
            },
        });
        const response: SuccessResponse = {
            message: "Version found",
            statusCode: HttpStatus.OK,
            data: { version },
        };
        return res.status(response.statusCode).json(response);
    }

    @Put("byId/:id")
    @ApiParam(transformZodSchemaToParamSchema(GeneralIdParamsSchema, 0))
    @ApiBody(transformZodSchemaToBodySchema(UpdateVersionSchema))
    @UsePipes(
        new ValidationPipe({
            paramsSchema: GeneralIdParamsSchema,
            bodySchema: UpdateVersionSchema,
        }),
    )
    async updateVersionById(
        @Res() res: Response,
        @Param() params: GeneralIdParams,
        @Body() body: UpdateVersion,
    ): Promise<Response> {
        const version = await this.versionService.updateVersion(
            body,
            params.id,
        );
        const response: SuccessResponse = {
            message: "Version updated",
            statusCode: HttpStatus.OK,
            data: { version },
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
        await this.versionService.deleteVersion(params.id);
        const response: SuccessResponse = {
            message: "Version deleted",
            statusCode: HttpStatus.OK,
            data: {},
        };
        return res.status(response.statusCode).json(response);
    }
}
