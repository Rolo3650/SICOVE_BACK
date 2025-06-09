import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BranchSection, Prisma } from "@prisma/client";
import { db } from "src/database/connection.database";
import {
    CreateBranchSection,
    UpdateBranchSection,
} from "src/schemas/branchSection/body.schema";

@Injectable()
export class BranchSectionService {
    private configService: ConfigService;

    constructor(configService: ConfigService) {
        this.configService = configService;
    }

    async getBranchSections(props?: {
        include?: Prisma.BranchSectionInclude;
    }): Promise<BranchSection[]> {
        const branchSectiones = await db.branchSection.findMany({
            where: {
                status: true,
            },
            include: props?.include,
        });
        return branchSectiones;
    }

    async getBranchSection(
        id: string,
        props?: {
            include?: Prisma.BranchSectionInclude;
        },
    ): Promise<BranchSection> {
        const branchSection = await db.branchSection.findUnique({
            where: {
                id,
                status: true,
            },
            include: props?.include,
        });
        if (!branchSection) {
            throw new NotFoundException("Branch section not found");
        }
        return branchSection;
    }

    async createBranchSection(
        branchSectionDto: CreateBranchSection,
    ): Promise<BranchSection> {
        const branch = await db.branch.findUnique({
            where: {
                id: branchSectionDto.branchId,
                status: true,
            },
        });
        if (!branch) {
            throw new NotFoundException("Colony not found");
        }

        const branchSection = await db.branchSection.create({
            data: branchSectionDto,
        });
        return branchSection;
    }

    async updateBranchSection(
        branchSectionDto: UpdateBranchSection,
        id: string,
    ): Promise<BranchSection> {
        if (branchSectionDto.branchId) {
            const branch = await db.branch.findUnique({
                where: {
                    id: branchSectionDto.branchId,
                    status: true,
                },
            });
            if (!branch) {
                throw new NotFoundException("Colony not found");
            }
        }

        const branchSection = await db.branchSection.findUnique({
            where: {
                id,
                status: true,
            },
        });

        if (!branchSection) {
            throw new NotFoundException("Branch section not found");
        }

        const updatedBranchSection = await db.branchSection.update({
            data: branchSectionDto,
            where: {
                id,
            },
        });

        return updatedBranchSection;
    }

    async deleteBranchSection(id: string): Promise<void> {
        const branchSection = await db.branchSection.findUnique({
            where: {
                id,
                status: true,
            },
        });

        if (!branchSection) {
            throw new NotFoundException("Branch section not found");
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _deletedBranchSection = await db.branchSection.update({
            data: {
                status: false,
            },
            where: {
                id,
            },
        });
    }
}
