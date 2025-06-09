import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BranchRegistration, Prisma } from "@prisma/client";
import { db } from "src/database/connection.database";
import {
    CreateBranchRegistration,
    UpdateBranchRegistration,
} from "src/schemas/branchRegistration/body.schema";

@Injectable()
export class BranchRegistrationService {
    private configService: ConfigService;

    constructor(configService: ConfigService) {
        this.configService = configService;
    }

    async getBranchRegistrations(props?: {
        include?: Prisma.BranchRegistrationInclude;
    }): Promise<BranchRegistration[]> {
        const branchRegistrationes = await db.branchRegistration.findMany({
            where: {
                status: true,
            },
            include: props?.include,
        });
        return branchRegistrationes;
    }

    async getBranchRegistration(
        id: string,
        props?: {
            include?: Prisma.BranchRegistrationInclude;
        },
    ): Promise<BranchRegistration> {
        const branchRegistration = await db.branchRegistration.findUnique({
            where: {
                id,
                status: true,
            },
            include: props?.include,
        });
        if (!branchRegistration) {
            throw new NotFoundException("Branch registration not found");
        }
        return branchRegistration;
    }

    async createBranchRegistration(
        branchRegistrationDto: CreateBranchRegistration,
    ): Promise<BranchRegistration> {
        const branchSection = await db.branchSection.findUnique({
            where: {
                id: branchRegistrationDto.branchSectionId,
                status: true,
            },
        });
        if (!branchSection) {
            throw new NotFoundException("Branch section not found");
        }

        const user = await db.user.findUnique({
            where: {
                id: branchRegistrationDto.userId,
                status: true,
            },
        });
        if (!user) {
            throw new NotFoundException("Branch section not found");
        }

        const vehicle = await db.vehicle.findUnique({
            where: {
                id: branchRegistrationDto.vehicleId,
                status: true,
            },
        });
        if (!vehicle) {
            throw new NotFoundException("Vehicle not found");
        }

        const branchRegistration = await db.branchRegistration.create({
            data: branchRegistrationDto,
        });
        return branchRegistration;
    }

    async updateBranchRegistration(
        branchRegistrationDto: UpdateBranchRegistration,
        id: string,
    ): Promise<BranchRegistration> {
        if (branchRegistrationDto.branchSectionId) {
            const branchSection = await db.branchSection.findUnique({
                where: {
                    id: branchRegistrationDto.branchSectionId,
                    status: true,
                },
            });
            if (!branchSection) {
                throw new NotFoundException("Branch section not found");
            }
        }

        if (branchRegistrationDto.userId) {
            const user = await db.user.findUnique({
                where: {
                    id: branchRegistrationDto.userId,
                    status: true,
                },
            });
            if (!user) {
                throw new NotFoundException("User not found");
            }
        }

        if (branchRegistrationDto.vehicleId) {
            const vehicle = await db.vehicle.findUnique({
                where: {
                    id: branchRegistrationDto.vehicleId,
                    status: true,
                },
            });
            if (!vehicle) {
                throw new NotFoundException("Vehicle not found");
            }
        }

        const branchRegistration = await db.branchRegistration.findUnique({
            where: {
                id,
                status: true,
            },
        });

        if (!branchRegistration) {
            throw new NotFoundException("Branch registration not found");
        }

        const updatedBranchRegistration = await db.branchRegistration.update({
            data: branchRegistrationDto,
            where: {
                id,
            },
        });

        return updatedBranchRegistration;
    }

    async deleteBranchRegistration(id: string): Promise<void> {
        const branchRegistration = await db.branchRegistration.findUnique({
            where: {
                id,
                status: true,
            },
        });

        if (!branchRegistration) {
            throw new NotFoundException("Branch registration not found");
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _deletedBranchRegistration = await db.branchRegistration.update({
            data: {
                status: false,
            },
            where: {
                id,
            },
        });
    }
}
