import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Country, Prisma } from "@prisma/client";
import { db } from "src/database/connection.database";
import { CreateCountry, UpdateCountry } from "src/schemas/country/body.schema";

@Injectable()
export class CountryService {
    private configService: ConfigService;

    constructor(configService: ConfigService) {
        this.configService = configService;
    }

    async getCountrys(props?: {
        include?: Prisma.CountryInclude;
    }): Promise<Country[]> {
        const countrys = await db.country.findMany({
            where: {
                status: true,
            },
            include: props?.include,
        });
        return countrys;
    }

    async getCountry(id: string): Promise<Country> {
        const country = await db.country.findUnique({
            where: {
                id,
                status: true,
            },
        });
        if (!country) {
            throw new NotFoundException("Country not found");
        }
        return country;
    }

    async createCountry(countryDto: CreateCountry): Promise<Country> {
        const country = await db.country.create({
            data: countryDto,
        });
        return country;
    }

    async updateCountry(
        countryDto: UpdateCountry,
        id: string,
    ): Promise<Country> {
        const country = await db.country.findUnique({
            where: {
                id,
                status: true,
            },
        });

        if (!country) {
            throw new NotFoundException("Country not found");
        }

        const updatedCountry = await db.country.update({
            data: countryDto,
            where: {
                id,
            },
        });

        return updatedCountry;
    }

    async deleteCountry(id: string): Promise<void> {
        const country = await db.country.findUnique({
            where: {
                id,
                status: true,
            },
        });

        if (!country) {
            throw new NotFoundException("Country not found");
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _deletedCountry = await db.country.update({
            data: {
                status: false,
            },
            where: {
                id,
            },
        });
    }
}
