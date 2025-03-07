import { Brand } from "@prisma/client";
import { Response } from "express";
import { BrandController } from "src/controllers/brand.controller";
import { db } from "src/database/connection.database";
import { CreateBrand, CreateBrandSchema } from "src/schemas/brand/body.schema";
import { zObjectId } from "src/schemas/general.schema";
import { getApplication } from "src/test/core/application.core";
import { mockedBrand } from "src/test/mocks/brand.mock";
import {
    getMockedResponse,
    testMockedResponse,
} from "src/test/mocks/express.mock";

describe("BrandController", () => {
    let brandController: BrandController;
    let res: Partial<Response>;
    let brand: Partial<Brand>;

    beforeAll(async () => {
        const app = await getApplication();

        brandController = app.get<BrandController>(BrandController);
        res = getMockedResponse();
        brand = mockedBrand();
    });

    beforeEach(() => {
        res = getMockedResponse();
    });

    describe("createBrand", () => {
        it("should return brand created", async () => {
            const brandDto = mockedBrand();
            if (!CreateBrandSchema.safeParse(brand).success) {
                fail("Failed to parse brand");
            }
            const brandCreated = await brandController.createBrand(
                res as Response,
                brand as CreateBrand,
            );
            expect(res.json).toHaveBeenCalled();
            const { data } = testMockedResponse(brandCreated.json);
            if ("brand" in data) {
                expect(zObjectId().safeParse(data.brand.id).success).toBe(true);
                expect(data.brand).toMatchObject(brandDto);
            }

            brand = data.brand as Brand;
        });
    });

    describe("getBrands", () => {
        it("should return brands", async () => {
            const brandsObtained = await brandController.getBrands(
                res as Response,
            );
            expect(res.json).toHaveBeenCalled();
            const { data } = testMockedResponse(brandsObtained.json);
            if (
                "brands" in data &&
                Array.isArray(data.brands) &&
                data.brands.length > 0
            ) {
                const brandFound = data.brands.find(
                    (brandDto) => brand.id === brandDto.id,
                ) as Brand;
                expect(zObjectId().safeParse(brandFound.id).success).toBe(true);
                expect(zObjectId().safeParse(brandFound.id).data).toBe(
                    brand.id,
                );
                expect(brandFound).toMatchObject(brand);
            }
        });
    });

    describe("getBrandById", () => {
        it("should return brand by id", async () => {
            const brandObtained = await brandController.getBrandById(
                res as Response,
                {
                    id: brand.id,
                },
            );
            expect(res.json).toHaveBeenCalled();
            const { data } = testMockedResponse(brandObtained.json);
            if ("brand" in data) {
                expect(zObjectId().safeParse(data.brand.id).success).toBe(true);
                expect(zObjectId().safeParse(data.brand.id).data).toBe(
                    brand.id,
                );
                expect(data.brand).toMatchObject(brand);
            }

            brand = data.brand as Brand;
        });
    });

    describe("updateBrandById", () => {
        it("should return brand updated by id", async () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { updatedAt, ...expectedBrand } = brand;
            const brandUpdated = await brandController.updateBrandById(
                res as Response,
                {
                    id: brand.id,
                },
                {
                    brand: "Ford",
                    description:
                        "Ford Motor Company, commonly known as Ford, is an American multinational automaker that has its main headquarters in Dearborn, Michigan, a suburb of Detroit.",
                },
            );
            expect(res.json).toHaveBeenCalled();
            const { data } = testMockedResponse(brandUpdated.json);
            if ("brand" in data) {
                expect(zObjectId().safeParse(data.brand.id).success).toBe(true);
                expect(zObjectId().safeParse(data.brand.id).data).toBe(
                    brand.id,
                );
                expect(data.brand).toMatchObject({
                    ...expectedBrand,
                    brand: "Ford",
                    description:
                        "Ford Motor Company, commonly known as Ford, is an American multinational automaker that has its main headquarters in Dearborn, Michigan, a suburb of Detroit.",
                });
            }

            brand = data.brand as Brand;
        });
    });

    describe("deleteBrandById", () => {
        it("should return nothing", async () => {
            const brandDeleted = await brandController.deleteById(
                res as Response,
                {
                    id: brand.id,
                },
            );
            expect(res.json).toHaveBeenCalled();
            const { data } = testMockedResponse(brandDeleted.json);
            expect(data).toEqual({});
        });
    });

    afterAll(async () => {
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
