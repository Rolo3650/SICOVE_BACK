import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { User, UserStatus } from "@prisma/client";
import { compare, genSalt, hash } from "bcrypt";
import { db } from "src/database/connection.database";
import { CreateUser, UpdateUser } from "src/schemas/user/body.schemas";

@Injectable()
export class UserService {
    private configService: ConfigService;

    constructor(configService: ConfigService) {
        this.configService = configService;
    }

    async getUsers(): Promise<Omit<User, "password">[]> {
        const users = await db.user.findMany({
            where: {
                staus: true,
            },
        });
        return users;
    }

    async getUser(id: string): Promise<Omit<User, "password">> {
        const user = await db.user.findUnique({
            where: {
                id,
                staus: true,
            },
        });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        return user;
    }

    async createUser(userDto: CreateUser): Promise<Omit<User, "password">> {
        const ifUser = await db.user.findUnique({
            where: {
                email: userDto.email,
                staus: true,
            },
        });

        if (ifUser) {
            throw new BadRequestException("Email already registered");
        }

        let password = "";
        const saltRounds = this.configService.get<string>("BCRYPT_PASSWORD");
        if (saltRounds) {
            password = await hash(
                userDto.password,
                await genSalt(Number.parseInt(saltRounds)),
            );
        }

        if (password === "") {
            throw new InternalServerErrorException({
                message: "Can not set user password",
            });
        }

        const user = await db.user.create({
            data: {
                ...userDto,
                password: password,
            },
        });
        return user;
    }

    async login(userDto: CreateUser): Promise<Omit<User, "password">> {
        const user = await db.user.findUnique({
            where: {
                email: userDto.email,
                staus: true,
            },
            omit: {
                password: false,
            },
        });

        if (!user) {
            throw new NotFoundException("User not found");
        }
        const login = await compare(userDto.password, user.password);
        if (!login) {
            throw new UnauthorizedException("Wrong password");
        }

        return user;
    }

    async updateUser(
        userDto: UpdateUser,
        id: string,
    ): Promise<Omit<User, "password">> {
        const user = await db.user.findUnique({
            where: {
                id,
                staus: true,
            },
        });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const updatedUser = await db.user.update({
            data: {
                ...userDto,
            },
            where: {
                id,
            },
        });

        return updatedUser;
    }

    async deleteUser(id: string): Promise<void> {
        const user = await db.user.findUnique({
            where: {
                id,
                staus: true,
            },
        });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _deletedUser = await db.user.update({
            data: {
                staus: false,
                userStatus: UserStatus.inactive,
            },
            where: {
                id,
            },
        });
    }
}
