import { Brand, Model, Version } from "@prisma/client";
import { Response } from "express";
import { VersionController } from "src/controllers/version.controller";
import { db } from "src/database/connection.database";
import { zObjectId } from "src/schemas/general.schema";
import {
    CreateVersion,
    CreateVersionSchema,
} from "src/schemas/version/body.schema";
import { getApplication } from "src/test/core/application.core";
import {
    getMockedResponse,
    testMockedResponse,
} from "src/test/mocks/express.mock";
import { mockedVersion } from "src/test/mocks/version.mock";
import { mockedBrand } from "../mocks/brand.mock";
import { mockedModel } from "../mocks/model.mock";

// biome-ignore lint/nursery/noSecrets: <explanation>
describe("VersionController", () => {
    let versionController: VersionController;
    let res: Partial<Response>;
    let version: Partial<Version>;
    let brand: Partial<Brand>;
    let model: Partial<Model>;

    beforeAll(async () => {
        const app = await getApplication();

        versionController = app.get<VersionController>(VersionController);
        res = getMockedResponse();
        brand = await db.brand.create({
            data: mockedBrand() as Brand,
        });
        model = await db.model.create({
            data: { ...mockedModel(), brandId: brand.id } as Model,
        });

        version = mockedVersion();
        version.modelId = model.id;
    });

    beforeEach(() => {
        res = getMockedResponse();
    });

    describe("createVersion", () => {
        it("should return version created", async () => {
            const versionDto = mockedVersion();
            if (!CreateVersionSchema.safeParse(version).success) {
                fail("Failed to parse version");
            }
            const versionCreated = await versionController.createVersion(
                res as Response,
                version as CreateVersion,
            );
            expect(res.json).toHaveBeenCalled();
            const { data } = testMockedResponse(versionCreated.json);
            if ("version" in data) {
                expect(zObjectId().safeParse(data.version.id).success).toBe(
                    true,
                );
                expect(data.version).toMatchObject(versionDto);
            }

            version = data.version as Version;
        });
    });

    describe("getVersions", () => {
        it("should return versions", async () => {
            const versionsObtained = await versionController.getVersions(
                res as Response,
            );
            expect(res.json).toHaveBeenCalled();
            const { data } = testMockedResponse(versionsObtained.json);
            if (
                "versions" in data &&
                Array.isArray(data.versions) &&
                data.versions.length > 0
            ) {
                const versionFound = data.versions.find(
                    (versionDto) => version.id === versionDto.id,
                ) as Version;
                expect(zObjectId().safeParse(versionFound.id).success).toBe(
                    true,
                );
                expect(zObjectId().safeParse(versionFound.id).data).toBe(
                    version.id,
                );
                expect(versionFound).toMatchObject(version);
            }
        });
    });

    describe("getVersionById", () => {
        it("should return version by id", async () => {
            const versionObtained = await versionController.getVersionById(
                res as Response,
                {
                    id: version.id as string,
                },
            );
            expect(res.json).toHaveBeenCalled();
            const { data } = testMockedResponse(versionObtained.json);
            if ("version" in data) {
                expect(zObjectId().safeParse(data.version.id).success).toBe(
                    true,
                );
                expect(zObjectId().safeParse(data.version.id).data).toBe(
                    version.id,
                );
                expect(data.version).toMatchObject(version);
            }

            version = data.version as Version;
        });
    });

    // biome-ignore lint/nursery/noSecrets: <explanation>
    describe("updateVersionById", () => {
        it("should return version updated by id", async () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { updatedAt, ...expectedVersion } = version;
            const versionUpdated = await versionController.updateVersionById(
                res as Response,
                {
                    id: version.id as string,
                },
                {
                    version: "GTI",
                    description: "Less Powefull.",
                },
            );
            expect(res.json).toHaveBeenCalled();
            const { data } = testMockedResponse(versionUpdated.json);
            if ("version" in data) {
                expect(zObjectId().safeParse(data.version.id).success).toBe(
                    true,
                );
                expect(zObjectId().safeParse(data.version.id).data).toBe(
                    version.id,
                );
                expect(data.version).toMatchObject({
                    ...expectedVersion,
                    version: "GTI",
                    description: "Less Powefull.",
                });
            }

            version = data.version as Version;
        });
    });

    // biome-ignore lint/nursery/noSecrets: <explanation>
    describe("deleteVersionById", () => {
        it("should return nothing", async () => {
            const versionDeleted = await versionController.deleteById(
                res as Response,
                {
                    id: version.id as string,
                },
            );
            expect(res.json).toHaveBeenCalled();
            const { data } = testMockedResponse(versionDeleted.json);
            expect(data).toEqual({});
        });
    });

    afterAll(async () => {
        if (version.id) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const _version = await db.version.delete({
                where: {
                    id: version.id,
                },
            });
        }
        if (model.id) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const _model = await db.model.delete({
                where: {
                    id: model.id,
                },
            });
        }
        if (brand.id) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const _brand = await db.brand.delete({
                where: {
                    id: brand.id,
                },
            });
        }
    });
});
