import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Branch, Prisma } from "@prisma/client";
import { db } from "src/database/connection.database";
import type {
    CreateBranch,
    UpdateBranch,
} from "src/schemas/branch/body.schema";

@Injectable()
export class BranchService {
    private configService: ConfigService;

    constructor(configService: ConfigService) {
        this.configService = configService;
    }

    async getBranches(props?: {
        include?: Prisma.BranchInclude;
    }): Promise<Branch[]> {
        const branches = await db.branch.findMany({
            where: {
                status: true,
            },
            include: props?.include,
        });
        return branches;
    }

    async getBranch(
        id: string,
        props?: {
            include?: Prisma.BranchInclude;
        },
    ): Promise<Branch> {
        const branch = await db.branch.findUnique({
            where: {
                id,
                status: true,
            },
            include: props?.include,
        });
        if (!branch) {
            throw new NotFoundException("Branch not found");
        }
        return branch;
    }

    async createBranch(branchDto: CreateBranch): Promise<Branch> {
        if (branchDto.colonyId) {
            const colony = await db.colony.findUnique({
                where: {
                    id: branchDto.colonyId,
                    status: true,
                },
            });
            if (!colony) {
                throw new NotFoundException("Colony not found");
            }
        }
        if (branchDto.roadId) {
            const colony = await db.colony.findUnique({
                where: {
                    id: branchDto.colonyId,
                    status: true,
                },
            });
            if (!colony) {
                throw new NotFoundException("Colony not found");
            }
        }

        const branch = await db.branch.create({
            data: branchDto,
        });
        return branch;
    }

    async updateBranch(branchDto: UpdateBranch, id: string): Promise<Branch> {
        if (branchDto.colonyId) {
            const colony = await db.colony.findUnique({
                where: {
                    id: branchDto.colonyId,
                    status: true,
                },
            });
            if (!colony) {
                throw new NotFoundException("Colony not found");
            }
        }
        if (branchDto.roadId) {
            const colony = await db.colony.findUnique({
                where: {
                    id: branchDto.colonyId,
                    status: true,
                },
            });
            if (!colony) {
                throw new NotFoundException("Colony not found");
            }
        }

        const branch = await db.branch.findUnique({
            where: {
                id,
                status: true,
            },
        });

        if (!branch) {
            throw new NotFoundException("Branch not found");
        }

        const updatedBranch = await db.branch.update({
            data: branchDto,
            where: {
                id,
            },
        });

        return updatedBranch;
    }

    async deleteBranch(id: string): Promise<void> {
        const branch = await db.branch.findUnique({
            where: {
                id,
                status: true,
            },
        });

        if (!branch) {
            throw new NotFoundException("Branch not found");
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _deletedBranch = await db.branch.update({
            data: {
                status: false,
            },
            where: {
                id,
            },
        });
    }
}
