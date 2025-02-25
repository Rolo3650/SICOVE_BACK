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
    type CreateUser,
    CreateUserSchema,
    LoginSchema,
    type UpdateUser,
    UpdateUserSchema,
} from "src/schemas/user/body.schemas";
import { UserService } from "src/services/user.service";
import {
    transformZodSchemaToBodySchema,
    transformZodSchemaToParamSchema,
} from "src/utils/zodToOpenApi";

@Controller("/user")
@applyDecorators(ApiBearerAuth())
export class UserController {
    private readonly userService: UserService;
    private readonly jwtService: JwtService;

    constructor(userService: UserService, jwtService: JwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @Get()
    async getUsers(@Res() res: Response): Promise<Response> {
        const users = await this.userService.getUsers();
        const response: SuccessResponse = {
            message: "Users found",
            statusCode: HttpStatus.FOUND,
            data: {
                users,
            },
        };
        return res.status(response.statusCode).json(response);
    }

    @Post()
    @ApiBody(transformZodSchemaToBodySchema(CreateUserSchema))
    @UsePipes(
        new ValidationPipe({
            bodySchema: CreateUserSchema,
        }),
    )
    async createUser(
        @Res() res: Response,
        @Body() body: CreateUser,
    ): Promise<Response> {
        const user = await this.userService.createUser(body);
        const response: SuccessResponse = {
            message: "User created",
            statusCode: HttpStatus.CREATED,
            data: { user },
        };
        return res.status(response.statusCode).json(response);
    }

    @Post("login")
    @ApiBody(transformZodSchemaToBodySchema(LoginSchema))
    @UsePipes(
        new ValidationPipe({
            bodySchema: LoginSchema,
        }),
    )
    async login(
        @Res() res: Response,
        @Body() body: CreateUser,
    ): Promise<Response> {
        const user = await this.userService.login(body);
        const token = this.jwtService.sign(user);
        const response: SuccessResponse = {
            message: "User login",
            statusCode: HttpStatus.OK,
            data: { user, token },
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
    async getUserById(
        @Res() res: Response,
        @Param() params: GeneralIdParams,
    ): Promise<Response> {
        const user = await this.userService.getUser(params.id as string);
        const response: SuccessResponse = {
            message: "User found",
            statusCode: HttpStatus.FOUND,
            data: { user },
        };
        return res.status(response.statusCode).json(response);
    }

    @Put("byId/:id")
    @ApiParam(transformZodSchemaToParamSchema(GeneralIdParamsSchema, 0))
    @ApiBody(transformZodSchemaToBodySchema(UpdateUserSchema))
    @UsePipes(
        new ValidationPipe({
            paramsSchema: GeneralIdParamsSchema,
            bodySchema: UpdateUserSchema,
        }),
    )
    async updateUserById(
        @Res() res: Response,
        @Param() params: GeneralIdParams,
        @Body() body: UpdateUser,
    ): Promise<Response> {
        const user = await this.userService.updateUser(
            body,
            params.id as string,
        );
        const response: SuccessResponse = {
            message: "User updated",
            statusCode: HttpStatus.OK,
            data: { user },
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
        await this.userService.deleteUser(params.id as string);
        const response: SuccessResponse = {
            message: "User deleted",
            statusCode: HttpStatus.OK,
            data: {},
        };
        return res.status(response.statusCode).json(response);
    }
}
