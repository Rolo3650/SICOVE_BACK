import { Brand, Model } from "@prisma/client";
import { Response } from "express";
import { ModelController } from "src/controllers/model.controller";
import { db } from "src/database/connection.database";
import { zObjectId } from "src/schemas/general.schema";
import { CreateModel, CreateModelSchema } from "src/schemas/model/body.schema";
import { getApplication } from "src/test/core/application.core";
import {
    getMockedResponse,
    testMockedResponse,
} from "src/test/mocks/express.mock";
import { mockedModel } from "src/test/mocks/model.mock";
import { mockedBrand } from "../mocks/brand.mock";

describe("ModelController", () => {
    let modelController: ModelController;
    let res: Partial<Response>;
    let model: Partial<Model>;
    let brand: Partial<Brand>;

    beforeAll(async () => {
        const app = await getApplication();

        modelController = app.get<ModelController>(ModelController);
        res = getMockedResponse();
        brand = mockedBrand();
        brand = await db.brand.create({
            data: brand as Brand,
        });

        model = mockedModel();
        model.brandId = brand.id;
    });

    beforeEach(() => {
        res = getMockedResponse();
    });

    describe("createModel", () => {
        it("should return model created", async () => {
            const modelDto = mockedModel();
            if (!CreateModelSchema.safeParse(model).success) {
                fail("Failed to parse model");
            }
            const modelCreated = await modelController.createModel(
                res as Response,
                model as CreateModel,
            );
            expect(res.json).toHaveBeenCalled();
            const { data } = testMockedResponse(modelCreated.json);
            if ("model" in data) {
                expect(zObjectId().safeParse(data.model.id).success).toBe(true);
                expect(data.model).toMatchObject(modelDto);
            }

            model = data.model as Model;
        });
    });

    describe("getModels", () => {
        it("should return models", async () => {
            const modelsObtained = await modelController.getModels(
                res as Response,
            );
            expect(res.json).toHaveBeenCalled();
            const { data } = testMockedResponse(modelsObtained.json);
            if (
                "models" in data &&
                Array.isArray(data.models) &&
                data.models.length > 0
            ) {
                const modelFound = data.models.find(
                    (modelDto) => model.id === modelDto.id,
                ) as Model;
                expect(zObjectId().safeParse(modelFound.id).success).toBe(true);
                expect(zObjectId().safeParse(modelFound.id).data).toBe(
                    model.id,
                );
                expect(modelFound).toMatchObject(model);
            }
        });
    });

    describe("getModelById", () => {
        it("should return model by id", async () => {
            const modelObtained = await modelController.getModelById(
                res as Response,
                {
                    id: model.id as string,
                },
            );
            expect(res.json).toHaveBeenCalled();
            const { data } = testMockedResponse(modelObtained.json);
            if ("model" in data) {
                expect(zObjectId().safeParse(data.model.id).success).toBe(true);
                expect(zObjectId().safeParse(data.model.id).data).toBe(
                    model.id,
                );
                expect(data.model).toMatchObject(model);
            }

            model = data.model as Model;
        });
    });

    describe("updateModelById", () => {
        it("should return model updated by id", async () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { updatedAt, ...expectedModel } = model;
            const modelUpdated = await modelController.updateModelById(
                res as Response,
                {
                    id: model.id as string,
                },
                {
                    model: "Ford",
                    description:
                        "Ford Motor Company, commonly known as Ford, is an American multinational automaker that has its main headquarters in Dearborn, Michigan, a suburb of Detroit.",
                },
            );
            expect(res.json).toHaveBeenCalled();
            const { data } = testMockedResponse(modelUpdated.json);
            if ("model" in data) {
                expect(zObjectId().safeParse(data.model.id).success).toBe(true);
                expect(zObjectId().safeParse(data.model.id).data).toBe(
                    model.id,
                );
                expect(data.model).toMatchObject({
                    ...expectedModel,
                    model: "Ford",
                    description:
                        "Ford Motor Company, commonly known as Ford, is an American multinational automaker that has its main headquarters in Dearborn, Michigan, a suburb of Detroit.",
                });
            }

            model = data.model as Model;
        });
    });

    describe("deleteModelById", () => {
        it("should return nothing", async () => {
            const modelDeleted = await modelController.deleteById(
                res as Response,
                {
                    id: model.id as string,
                },
            );
            expect(res.json).toHaveBeenCalled();
            const { data } = testMockedResponse(modelDeleted.json);
            expect(data).toEqual({});
        });
    });

    afterAll(async () => {
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
