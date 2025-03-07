import { User } from "@prisma/client";
import { Response } from "express";
import { UserController } from "src/controllers/user.controller";
import { db } from "src/database/connection.database";
import { zObjectId } from "src/schemas/general.schema";
import { CreateUser, CreateUserSchema } from "src/schemas/user/body.schema";
import { getApplication } from "src/test/core/application.core";
import {
    getMockedResponse,
    testMockedResponse,
} from "src/test/mocks/express.mock";
import { mockedUser } from "src/test/mocks/user.mock";

describe("UserController", () => {
    let userController: UserController;
    let res: Partial<Response>;
    let user: Partial<User>;

    beforeAll(async () => {
        const app = await getApplication();

        userController = app.get<UserController>(UserController);
        res = getMockedResponse();
        user = mockedUser();
    });

    beforeEach(() => {
        res = getMockedResponse();
    });

    describe("createUser", () => {
        it("should return user created", async () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...userDto } = mockedUser();
            if (!CreateUserSchema.safeParse(user).success) {
                fail("Failed to parse user");
            }
            const userCreated = await userController.createUser(
                res as Response,
                user as CreateUser,
            );
            expect(res.json).toHaveBeenCalled();
            const { data } = testMockedResponse(userCreated.json);
            if ("user" in data) {
                expect(zObjectId().safeParse(data.user.id).success).toBe(true);
                expect(data.user).toMatchObject(userDto);
            }

            user = data.user as User;
        });
    });

    describe("getUsers", () => {
        it("should return users", async () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...userDto } = mockedUser();
            const usersObtained = await userController.getUsers(
                res as Response,
            );
            expect(res.json).toHaveBeenCalled();
            const { data } = testMockedResponse(usersObtained.json);
            if (
                "users" in data &&
                Array.isArray(data.users) &&
                data.users.length > 0
            ) {
                const userFound = data.users.find(
                    (user) => user.email === userDto.email,
                ) as User;
                expect(zObjectId().safeParse(userFound.id).success).toBe(true);
                expect(zObjectId().safeParse(userFound.id).data).toBe(user.id);
                expect(userFound).toMatchObject(userDto);
            }
        });
    });

    describe("getUserById", () => {
        it("should return user by id", async () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...userDto } = mockedUser();
            const userObtained = await userController.getUserById(
                res as Response,
                {
                    id: user.id,
                },
            );
            expect(res.json).toHaveBeenCalled();
            const { data } = testMockedResponse(userObtained.json);
            if ("user" in data) {
                expect(zObjectId().safeParse(data.user.id).success).toBe(true);
                expect(zObjectId().safeParse(data.user.id).data).toBe(user.id);
                expect(data.user).toMatchObject(userDto);
            }

            user = data.user as User;
        });
    });

    describe("updateUserById", () => {
        it("should return user updated by id", async () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...userDto } = mockedUser();
            const userUpdated = await userController.updateUserById(
                res as Response,
                {
                    id: user.id,
                },
                {
                    firstName: "Ian",
                    lastName: "Malcolm",
                },
            );
            expect(res.json).toHaveBeenCalled();
            const { data } = testMockedResponse(userUpdated.json);
            if ("user" in data) {
                expect(zObjectId().safeParse(data.user.id).success).toBe(true);
                expect(zObjectId().safeParse(data.user.id).data).toBe(user.id);
                expect(data.user).toMatchObject({
                    ...userDto,
                    firstName: "Ian",
                    lastName: "Malcolm",
                });
            }

            user = data.user as User;
        });
    });

    describe("deleteUserById", () => {
        it("should return nothing", async () => {
            const userDeleted = await userController.deleteById(
                res as Response,
                {
                    id: user.id,
                },
            );
            expect(res.json).toHaveBeenCalled();
            const { data } = testMockedResponse(userDeleted.json);
            expect(data).toEqual({});
        });
    });

    afterAll(async () => {
        if (user.id) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const _user = await db.user.delete({
                where: {
                    id: user.id,
                },
            });
        }
    });
});
