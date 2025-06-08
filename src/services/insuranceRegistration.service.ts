import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InsuranceRegistration, Prisma } from "@prisma/client";
import { db } from "src/database/connection.database";
import {
    CreateInsuranceRegistration,
    UpdateInsuranceRegistration,
} from "src/schemas/insuranceRegistration/body.schema";

@Injectable()
export class InsuranceRegistrationService {
    private configService: ConfigService;

    constructor(configService: ConfigService) {
        this.configService = configService;
    }

    async getInsuranceRegistrations(props?: {
        include?: Prisma.InsuranceRegistrationInclude;
    }): Promise<InsuranceRegistration[]> {
        const insuranceRegistrations = await db.insuranceRegistration.findMany({
            where: {
                status: true,
            },
            include: props?.include,
        });
        return insuranceRegistrations;
    }

    async getInsuranceRegistration(
        id: string,
        props?: {
            include?: Prisma.InsuranceRegistrationInclude;
        },
    ): Promise<InsuranceRegistration> {
        const insuranceRegistration = await db.insuranceRegistration.findUnique(
            {
                where: {
                    id,
                    status: true,
                },
                include: props?.include,
            },
        );
        if (!insuranceRegistration) {
            throw new NotFoundException("Insurance registration not found");
        }
        return insuranceRegistration;
    }

    async createInsuranceRegistration(
        insuranceRegistrationDto: CreateInsuranceRegistration,
    ): Promise<InsuranceRegistration> {
        const vehicle = await db.vehicle.findUnique({
            where: {
                id: insuranceRegistrationDto.vehicleId,
                status: true,
            },
        });
        if (!vehicle) {
            throw new NotFoundException("Vehicle not found");
        }

        const insuranceRegistration = await db.insuranceRegistration.create({
            data: insuranceRegistrationDto,
        });
        return insuranceRegistration;
    }

    async updateInsuranceRegistration(
        insuranceRegistrationDto: UpdateInsuranceRegistration,
        id: string,
    ): Promise<InsuranceRegistration> {
        if (insuranceRegistrationDto.vehicleId) {
            const vehicle = await db.version.findUnique({
                where: {
                    id: insuranceRegistrationDto.vehicleId,
                    status: true,
                },
            });
            if (!vehicle) {
                throw new NotFoundException("Vehicle not found");
            }
        }

        const insuranceRegistration = await db.insuranceRegistration.findUnique(
            {
                where: {
                    id,
                    status: true,
                },
            },
        );

        if (!insuranceRegistration) {
            throw new NotFoundException("Insurance registration not found");
        }

        const updatedInsuranceRegistration =
            await db.insuranceRegistration.update({
                data: insuranceRegistrationDto,
                where: {
                    id,
                },
            });

        return updatedInsuranceRegistration;
    }

    async deleteInsuranceRegistration(id: string): Promise<void> {
        const insuranceRegistration = await db.insuranceRegistration.findUnique(
            {
                where: {
                    id,
                    status: true,
                },
            },
        );

        if (!insuranceRegistration) {
            throw new NotFoundException("Insurance registration not found");
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _deletedInsuranceRegistration =
            await db.insuranceRegistration.update({
                data: {
                    status: false,
                },
                where: {
                    id,
                },
            });
    }
}
