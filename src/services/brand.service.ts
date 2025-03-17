import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Brand, Prisma } from "@prisma/client";
import { db } from "src/database/connection.database";
import type { CreateBrand, UpdateBrand } from "src/schemas/brand/body.schema";

@Injectable()
export class BrandService {
    private configService: ConfigService;

    constructor(configService: ConfigService) {
        this.configService = configService;
    }

    async getBrands(props?: {
        include?: Prisma.BrandInclude;
    }): Promise<Brand[]> {
        const brands = await db.brand.findMany({
            where: {
                status: true,
            },
            include: props?.include,
        });
        return brands;
    }

    async getBrand(id: string): Promise<Brand> {
        const brand = await db.brand.findUnique({
            where: {
                id,
                status: true,
            },
        });
        if (!brand) {
            throw new NotFoundException("Brand not found");
        }
        return brand;
    }

    async createBrand(brandDto: CreateBrand): Promise<Brand> {
        const brand = await db.brand.create({
            data: brandDto,
        });
        return brand;
    }

    async updateBrand(brandDto: UpdateBrand, id: string): Promise<Brand> {
        const brand = await db.brand.findUnique({
            where: {
                id,
                status: true,
            },
        });

        if (!brand) {
            throw new NotFoundException("Brand not found");
        }

        const updatedBrand = await db.brand.update({
            data: brandDto,
            where: {
                id,
            },
        });

        return updatedBrand;
    }

    async deleteBrand(id: string): Promise<void> {
        const brand = await db.brand.findUnique({
            where: {
                id,
                status: true,
            },
        });

        if (!brand) {
            throw new NotFoundException("Brand not found");
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _deletedBrand = await db.brand.update({
            data: {
                status: false,
            },
            where: {
                id,
            },
        });
    }
}
