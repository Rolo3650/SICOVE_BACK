import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Prisma, Vehicle } from "@prisma/client";
import { db } from "src/database/connection.database";
import type {
    CreateVehicle,
    UpdateVehicle,
} from "src/schemas/vehicle/body.schema";

@Injectable()
export class VehicleService {
    private configService: ConfigService;

    constructor(configService: ConfigService) {
        this.configService = configService;
    }

    async getVehicles(props?: {
        include?: Prisma.VehicleInclude;
    }): Promise<Vehicle[]> {
        const vehicles = await db.vehicle.findMany({
            where: {
                status: true,
            },
            include: props?.include,
        });
        return vehicles;
    }

    async getVehicle(
        id: string,
        props?: {
            include?: Prisma.VehicleInclude;
        },
    ): Promise<Vehicle> {
        const vehicle = await db.vehicle.findUnique({
            where: {
                id,
                status: true,
            },
            include: props?.include,
        });
        if (!vehicle) {
            throw new NotFoundException("Vehicle not found");
        }
        return vehicle;
    }

    async createVehicle(vehicleDto: CreateVehicle): Promise<Vehicle> {
        const version = await db.version.findUnique({
            where: {
                id: vehicleDto.versionId,
                status: true,
            },
        });
        if (!version) {
            throw new NotFoundException("Model not found");
        }

        const vehicle = await db.vehicle.create({
            data: vehicleDto,
        });
        return vehicle;
    }

    async updateVehicle(
        vehicleDto: UpdateVehicle,
        id: string,
    ): Promise<Vehicle> {
        if (vehicleDto.versionId) {
            const version = await db.version.findUnique({
                where: {
                    id: vehicleDto.versionId,
                    status: true,
                },
            });
            if (!version) {
                throw new NotFoundException("Model not found");
            }
        }

        const vehicle = await db.vehicle.findUnique({
            where: {
                id,
                status: true,
            },
        });

        if (!vehicle) {
            throw new NotFoundException("Vehicle not found");
        }

        const updatedVehicle = await db.vehicle.update({
            data: vehicleDto,
            where: {
                id,
            },
        });

        return updatedVehicle;
    }

    async deleteVehicle(id: string): Promise<void> {
        const vehicle = await db.vehicle.findUnique({
            where: {
                id,
                status: true,
            },
        });

        if (!vehicle) {
            throw new NotFoundException("Vehicle not found");
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _deletedVehicle = await db.vehicle.update({
            data: {
                status: false,
            },
            where: {
                id,
            },
        });
    }
}
