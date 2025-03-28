import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { City, Prisma } from "@prisma/client";
import { db } from "src/database/connection.database";
import type { CreateCity, UpdateCity } from "src/schemas/city/body.schema";

@Injectable()
export class CityService {
    private configService: ConfigService;

    constructor(configService: ConfigService) {
        this.configService = configService;
    }

    async getCities(props?: { include?: Prisma.CityInclude }): Promise<City[]> {
        const municipalities = await db.city.findMany({
            where: {
                status: true,
            },
            include: props?.include,
        });
        return municipalities;
    }

    async getCity(
        id: string,
        props?: {
            include?: Prisma.CityInclude;
        },
    ): Promise<City> {
        const city = await db.city.findUnique({
            where: {
                id,
                status: true,
            },
            include: props?.include,
        });
        if (!city) {
            throw new NotFoundException("City not found");
        }
        return city;
    }

    async createCity(cityDto: CreateCity): Promise<City> {
        const municipality = await db.municipality.findUnique({
            where: {
                id: cityDto.municipalityId,
                status: true,
            },
        });
        if (!municipality) {
            throw new NotFoundException("Municipality not found");
        }

        const city = await db.city.create({
            data: cityDto,
        });
        return city;
    }

    async updateCity(cityDto: UpdateCity, id: string): Promise<City> {
        if (cityDto.municipalityId) {
            const municipality = await db.municipality.findUnique({
                where: {
                    id: cityDto.municipalityId,
                    status: true,
                },
            });
            if (!municipality) {
                throw new NotFoundException("Municipality not found");
            }
        }

        const city = await db.city.findUnique({
            where: {
                id,
                status: true,
            },
        });

        if (!city) {
            throw new NotFoundException("City not found");
        }

        const updatedCity = await db.city.update({
            data: cityDto,
            where: {
                id,
            },
        });

        return updatedCity;
    }

    async deleteCity(id: string): Promise<void> {
        const city = await db.city.findUnique({
            where: {
                id,
                status: true,
            },
        });

        if (!city) {
            throw new NotFoundException("City not found");
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _deletedCity = await db.city.update({
            data: {
                status: false,
            },
            where: {
                id,
            },
        });
    }
}
