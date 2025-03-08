import { Brand, Model, Vehicle, Version } from "@prisma/client";
import { Response } from "express";
import { VehicleController } from "src/controllers/vehicle.controller";
import { db } from "src/database/connection.database";
import { zObjectId } from "src/schemas/general.schema";
import {
    CreateVehicle,
    CreateVehicleSchema,
} from "src/schemas/vehicle/body.schema";
import { getApplication } from "src/test/core/application.core";
import {
    getMockedResponse,
    testMockedResponse,
} from "src/test/mocks/express.mock";
import { mockedVehicle } from "src/test/mocks/vehicle.mock";
import { mockedBrand } from "../mocks/brand.mock";
import { mockedModel } from "../mocks/model.mock";
import { mockedVersion } from "../mocks/version.mock";

// biome-ignore lint/nursery/noSecrets: <explanation>
describe("VehicleController", () => {
    let vehicleController: VehicleController;
    let res: Partial<Response>;
    let vehicle: Partial<Vehicle>;
    let brand: Partial<Brand>;
    let model: Partial<Model>;
    let version: Partial<Version>;

    beforeAll(async () => {
        const app = await getApplication();

        vehicleController = app.get<VehicleController>(VehicleController);
        res = getMockedResponse();
        brand = await db.brand.create({
            data: mockedBrand() as Brand,
        });
        model = await db.model.create({
            data: { ...mockedModel(), brandId: brand.id } as Model,
        });
        version = await db.version.create({
            data: { ...mockedVersion(), modelId: model.id } as Version,
        });

        vehicle = mockedVehicle();
        vehicle.versionId = version.id;
    });

    beforeEach(() => {
        res = getMockedResponse();
    });

    describe("createVehicle", () => {
        it("should return vehicle created", async () => {
            const vehicleDto = mockedVehicle();
            if (!CreateVehicleSchema.safeParse(vehicle).success) {
                fail("Failed to parse vehicle");
            }
            const vehicleCreated = await vehicleController.createVehicle(
                res as Response,
                vehicle as CreateVehicle,
            );
            expect(res.json).toHaveBeenCalled();
            const { data } = testMockedResponse(vehicleCreated.json);
            if ("vehicle" in data) {
                expect(zObjectId().safeParse(data.vehicle.id).success).toBe(
                    true,
                );
                expect(data.vehicle).toMatchObject(vehicleDto);
            }

            vehicle = data.vehicle as Vehicle;
        });
    });

    describe("getVehicles", () => {
        it("should return vehicles", async () => {
            const vehiclesObtained = await vehicleController.getVehicles(
                res as Response,
            );
            expect(res.json).toHaveBeenCalled();
            const { data } = testMockedResponse(vehiclesObtained.json);
            if (
                "vehicles" in data &&
                Array.isArray(data.vehicles) &&
                data.vehicles.length > 0
            ) {
                const vehicleFound = data.vehicles.find(
                    (vehicleDto) => vehicle.id === vehicleDto.id,
                ) as Vehicle;
                expect(zObjectId().safeParse(vehicleFound.id).success).toBe(
                    true,
                );
                expect(zObjectId().safeParse(vehicleFound.id).data).toBe(
                    vehicle.id,
                );
                expect(vehicleFound).toMatchObject(vehicle);
            }
        });
    });

    describe("getVehicleById", () => {
        it("should return vehicle by id", async () => {
            const vehicleObtained = await vehicleController.getVehicleById(
                res as Response,
                {
                    id: vehicle.id as string,
                },
            );
            expect(res.json).toHaveBeenCalled();
            const { data } = testMockedResponse(vehicleObtained.json);
            if ("vehicle" in data) {
                expect(zObjectId().safeParse(data.vehicle.id).success).toBe(
                    true,
                );
                expect(zObjectId().safeParse(data.vehicle.id).data).toBe(
                    vehicle.id,
                );
                expect(data.vehicle).toMatchObject(vehicle);
            }

            vehicle = data.vehicle as Vehicle;
        });
    });

    // biome-ignore lint/nursery/noSecrets: <explanation>
    describe("updateVehicleById", () => {
        it("should return vehicle updated by id", async () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { updatedAt, ...expectedVehicle } = vehicle;
            const vehicleUpdated = await vehicleController.updateVehicleById(
                res as Response,
                {
                    id: vehicle.id as string,
                },
                {
                    chasisNumber: "456",
                    color: "#999999",
                    engineNumber: "456",
                    licencePlate: "456",
                    mileage: 30000,
                    // biome-ignore lint/style/useNamingConvention: <explanation>
                    VIN: "678910",
                },
            );
            expect(res.json).toHaveBeenCalled();
            const { data } = testMockedResponse(vehicleUpdated.json);
            if ("vehicle" in data) {
                expect(zObjectId().safeParse(data.vehicle.id).success).toBe(
                    true,
                );
                expect(zObjectId().safeParse(data.vehicle.id).data).toBe(
                    vehicle.id,
                );
                expect(data.vehicle).toMatchObject({
                    ...expectedVehicle,
                    chasisNumber: "456",
                    color: "#999999",
                    engineNumber: "456",
                    licencePlate: "456",
                    mileage: 30000,
                    // biome-ignore lint/style/useNamingConvention: <explanation>
                    VIN: "678910",
                });
            }

            vehicle = data.vehicle as Vehicle;
        });
    });

    // biome-ignore lint/nursery/noSecrets: <explanation>
    describe("deleteVehicleById", () => {
        it("should return nothing", async () => {
            const vehicleDeleted = await vehicleController.deleteById(
                res as Response,
                {
                    id: vehicle.id as string,
                },
            );
            expect(res.json).toHaveBeenCalled();
            const { data } = testMockedResponse(vehicleDeleted.json);
            expect(data).toEqual({});
        });
    });

    afterAll(async () => {
        if (vehicle.id) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const _vehicle = await db.vehicle.delete({
                where: {
                    id: vehicle.id,
                },
            });
        }
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
