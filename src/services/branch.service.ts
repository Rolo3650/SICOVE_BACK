import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Branch, Prisma } from "@prisma/client";
import { db } from "src/database/connection.database";
import type {
    AssignVehiclesToBranch,
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
        const city = await db.city.findUnique({
            where: {
                id: branchDto.cityId,
                status: true,
            },
        });
        if (!city) {
            throw new NotFoundException("Municipality not found");
        }

        const branch = await db.branch.create({
            data: branchDto,
        });
        return branch;
    }

    async updateBranch(branchDto: UpdateBranch, id: string): Promise<Branch> {
        if (branchDto.cityId) {
            const city = await db.city.findUnique({
                where: {
                    id: branchDto.cityId,
                    status: true,
                },
            });
            if (!city) {
                throw new NotFoundException("Municipality not found");
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

    async assingVehiclesToBranch(
        body: AssignVehiclesToBranch,
        id: string,
    ): Promise<Branch> {
        if (body.vehiclesId && body.vehiclesId.length > 0) {
            const vehicles = await db.vehicle.findMany({
                where: {
                    id: { in: body.vehiclesId },
                },
            });
            if (
                !body.vehiclesId.some((vdto) =>
                    vehicles.some((v) => v.id === vdto),
                )
            ) {
                throw new NotFoundException("Vehicles not found");
            }
        }

        const branch = await db.branch.findUnique({
            where: {
                id,
                status: true,
            },
            include: {
                vehicles: true,
            },
        });

        if (!branch) {
            throw new NotFoundException("Branch not found");
        }

        const updatedBranch = await db.branch.update({
            data: {
                vehicles: {
                    set: body.vehiclesId.map((v) => ({
                        id: v,
                    })),
                },
            },
            where: {
                id,
            },
        });

        return updatedBranch;
    }
}
