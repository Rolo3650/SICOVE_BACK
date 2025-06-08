import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CustomRegistration, Prisma } from "@prisma/client";
import { db } from "src/database/connection.database";
import {
    CreateCustomRegistration,
    UpdateCustomRegistration,
} from "src/schemas/customRegistration/body.schema";

@Injectable()
export class CustomRegistrationService {
    private configService: ConfigService;

    constructor(configService: ConfigService) {
        this.configService = configService;
    }

    async getCustomRegistrations(props?: {
        include?: Prisma.CustomRegistrationInclude;
    }): Promise<CustomRegistration[]> {
        const customRegistrations = await db.customRegistration.findMany({
            where: {
                status: true,
            },
            include: props?.include,
        });
        return customRegistrations;
    }

    async getCustomRegistration(
        id: string,
        props?: {
            include?: Prisma.CustomRegistrationInclude;
        },
    ): Promise<CustomRegistration> {
        const customRegistration = await db.customRegistration.findUnique({
            where: {
                id,
                status: true,
            },
            include: props?.include,
        });
        if (!customRegistration) {
            throw new NotFoundException("Custom registration not found");
        }
        return customRegistration;
    }

    async createCustomRegistration(
        customRegistrationDto: CreateCustomRegistration,
    ): Promise<CustomRegistration> {
        const vehicle = await db.vehicle.findUnique({
            where: {
                id: customRegistrationDto.vehicleId,
                status: true,
            },
        });
        if (!vehicle) {
            throw new NotFoundException("Vehicle not found");
        }

        const customRegistration = await db.customRegistration.create({
            data: customRegistrationDto,
        });
        return customRegistration;
    }

    async updateCustomRegistration(
        customRegistrationDto: UpdateCustomRegistration,
        id: string,
    ): Promise<CustomRegistration> {
        if (customRegistrationDto.vehicleId) {
            const vehicle = await db.version.findUnique({
                where: {
                    id: customRegistrationDto.vehicleId,
                    status: true,
                },
            });
            if (!vehicle) {
                throw new NotFoundException("Vehicle not found");
            }
        }

        const customRegistration = await db.customRegistration.findUnique({
            where: {
                id,
                status: true,
            },
        });

        if (!customRegistration) {
            throw new NotFoundException("Custom registration not found");
        }

        const updatedCustomRegistration = await db.customRegistration.update({
            data: customRegistrationDto,
            where: {
                id,
            },
        });

        return updatedCustomRegistration;
    }

    async deleteCustomRegistration(id: string): Promise<void> {
        const customRegistration = await db.customRegistration.findUnique({
            where: {
                id,
                status: true,
            },
        });

        if (!customRegistration) {
            throw new NotFoundException("Custom registration not found");
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _deletedCustomRegistration = await db.customRegistration.update({
            data: {
                status: false,
            },
            where: {
                id,
            },
        });
    }
}
