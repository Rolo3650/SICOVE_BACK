import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Brand } from "@prisma/client";
import { db } from "src/database/connection.database";
import type { CreateBrand, UpdateBrand } from "src/schemas/brand/body.schema";

@Injectable()
export class BrandService {
    private configService: ConfigService;

    constructor(configService: ConfigService) {
        this.configService = configService;
    }

    async getBrands(): Promise<Omit<Brand, "password">[]> {
        const brands = await db.brand.findMany({
            where: {
                staus: true,
            },
        });
        return brands;
    }

    async getBrand(id: string): Promise<Omit<Brand, "password">> {
        const brand = await db.brand.findUnique({
            where: {
                id,
                staus: true,
            },
        });
        if (!brand) {
            throw new NotFoundException("Brand not found");
        }
        return brand;
    }

    async createBrand(brandDto: CreateBrand): Promise<Omit<Brand, "password">> {
        const brand = await db.brand.create({
            data: brandDto,
        });
        return brand;
    }

    async updateBrand(
        brandDto: UpdateBrand,
        id: string,
    ): Promise<Omit<Brand, "password">> {
        const brand = await db.brand.findUnique({
            where: {
                id,
                staus: true,
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
                staus: true,
            },
        });

        if (!brand) {
            throw new NotFoundException("Brand not found");
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _deletedBrand = await db.brand.update({
            data: {
                staus: false,
            },
            where: {
                id,
            },
        });
    }
}
