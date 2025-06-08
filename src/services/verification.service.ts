import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Prisma, Verification } from "@prisma/client";
import { db } from "src/database/connection.database";
import {
    CreateVerification,
    UpdateVerification,
} from "src/schemas/verification/body.schema";

@Injectable()
export class VerificationService {
    private configService: ConfigService;

    constructor(configService: ConfigService) {
        this.configService = configService;
    }

    async getVerifications(props?: {
        include?: Prisma.VerificationInclude;
    }): Promise<Verification[]> {
        const verifications = await db.verification.findMany({
            where: {
                status: true,
            },
            include: props?.include,
        });
        return verifications;
    }

    async getVerification(
        id: string,
        props?: {
            include?: Prisma.VerificationInclude;
        },
    ): Promise<Verification> {
        const verification = await db.verification.findUnique({
            where: {
                id,
                status: true,
            },
            include: props?.include,
        });
        if (!verification) {
            throw new NotFoundException("Custom registration not found");
        }
        return verification;
    }

    async createVerification(
        verificationDto: CreateVerification,
    ): Promise<Verification> {
        const vehicle = await db.vehicle.findUnique({
            where: {
                id: verificationDto.vehicleId,
                status: true,
            },
        });
        if (!vehicle) {
            throw new NotFoundException("Vehicle not found");
        }

        const verification = await db.verification.create({
            data: verificationDto,
        });
        return verification;
    }

    async updateVerification(
        verificationDto: UpdateVerification,
        id: string,
    ): Promise<Verification> {
        if (verificationDto.vehicleId) {
            const vehicle = await db.version.findUnique({
                where: {
                    id: verificationDto.vehicleId,
                    status: true,
                },
            });
            if (!vehicle) {
                throw new NotFoundException("Vehicle not found");
            }
        }

        const verification = await db.verification.findUnique({
            where: {
                id,
                status: true,
            },
        });

        if (!verification) {
            throw new NotFoundException("Custom registration not found");
        }

        const updatedVerification = await db.verification.update({
            data: verificationDto,
            where: {
                id,
            },
        });

        return updatedVerification;
    }

    async deleteVerification(id: string): Promise<void> {
        const verification = await db.verification.findUnique({
            where: {
                id,
                status: true,
            },
        });

        if (!verification) {
            throw new NotFoundException("Custom registration not found");
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _deletedVerification = await db.verification.update({
            data: {
                status: false,
            },
            where: {
                id,
            },
        });
    }
}
