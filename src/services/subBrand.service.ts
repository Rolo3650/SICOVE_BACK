import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Prisma, SubBrand } from "@prisma/client";
import { db } from "src/database/connection.database";
import {
    CreateSubBrand,
    UpdateSubBrand,
} from "src/schemas/subBrand/body.schema";

@Injectable()
export class SubBrandService {
    private configService: ConfigService;

    constructor(configService: ConfigService) {
        this.configService = configService;
    }

    async getSubBrands(props?: {
        include?: Prisma.SubBrandInclude;
    }): Promise<SubBrand[]> {
        const subBrands = await db.subBrand.findMany({
            where: {
                status: true,
            },
            include: props?.include,
        });
        return subBrands;
    }

    async getSubBrand(
        id: string,
        props?: {
            include?: Prisma.SubBrandInclude;
        },
    ): Promise<SubBrand> {
        const subBrand = await db.subBrand.findUnique({
            where: {
                id,
                status: true,
            },
            include: props?.include,
        });
        if (!subBrand) {
            throw new NotFoundException("SubBrand not found");
        }
        return subBrand;
    }

    async createSubBrand(subBrandDto: CreateSubBrand): Promise<SubBrand> {
        const brand = await db.brand.findUnique({
            where: {
                id: subBrandDto.brandId,
                status: true,
            },
        });
        if (!brand) {
            throw new NotFoundException("Brand not found");
        }

        const subBrand = await db.subBrand.create({
            data: subBrandDto,
        });
        return subBrand;
    }

    async updateSubBrand(
        subBrandDto: UpdateSubBrand,
        id: string,
    ): Promise<SubBrand> {
        if (subBrandDto.brandId) {
            const brand = await db.brand.findUnique({
                where: {
                    id: subBrandDto.brandId,
                    status: true,
                },
            });
            if (!brand) {
                throw new NotFoundException("Brand not found");
            }
        }

        const subBrand = await db.subBrand.findUnique({
            where: {
                id,
                status: true,
            },
        });

        if (!subBrand) {
            throw new NotFoundException("SubBrand not found");
        }

        const updatedSubBrand = await db.subBrand.update({
            data: subBrandDto,
            where: {
                id,
            },
        });

        return updatedSubBrand;
    }

    async deleteSubBrand(id: string): Promise<void> {
        const subBrand = await db.subBrand.findUnique({
            where: {
                id,
                status: true,
            },
        });

        if (!subBrand) {
            throw new NotFoundException("SubBrand not found");
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _deletedSubBrand = await db.subBrand.update({
            data: {
                status: false,
            },
            where: {
                id,
            },
        });
    }
}
