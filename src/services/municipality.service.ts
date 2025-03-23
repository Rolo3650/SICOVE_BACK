import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Municipality, Prisma } from "@prisma/client";
import { db } from "src/database/connection.database";
import type {
    CreateMunicipality,
    UpdateMunicipality,
} from "src/schemas/municipality/body.schema";

@Injectable()
export class MunicipalityService {
    private configService: ConfigService;

    constructor(configService: ConfigService) {
        this.configService = configService;
    }

    async getMunicipalities(props?: {
        include?: Prisma.MunicipalityInclude;
    }): Promise<Municipality[]> {
        const municipalities = await db.municipality.findMany({
            where: {
                status: true,
            },
            include: props?.include,
        });
        return municipalities;
    }

    async getMunicipality(
        id: string,
        props?: {
            include?: Prisma.MunicipalityInclude;
        },
    ): Promise<Municipality> {
        const municipality = await db.municipality.findUnique({
            where: {
                id,
                status: true,
            },
            include: props?.include,
        });
        if (!municipality) {
            throw new NotFoundException("Municipality not found");
        }
        return municipality;
    }

    async createMunicipality(
        municipalityDto: CreateMunicipality,
    ): Promise<Municipality> {
        const state = await db.state.findUnique({
            where: {
                id: municipalityDto.stateId,
                status: true,
            },
        });
        if (!state) {
            throw new NotFoundException("Brand not found");
        }

        const municipality = await db.municipality.create({
            data: municipalityDto,
        });
        return municipality;
    }

    async updateMunicipality(
        municipalityDto: UpdateMunicipality,
        id: string,
    ): Promise<Municipality> {
        if (municipalityDto.stateId) {
            const state = await db.state.findUnique({
                where: {
                    id: municipalityDto.stateId,
                    status: true,
                },
            });
            if (!state) {
                throw new NotFoundException("Brand not found");
            }
        }

        const municipality = await db.municipality.findUnique({
            where: {
                id,
                status: true,
            },
        });

        if (!municipality) {
            throw new NotFoundException("Municipality not found");
        }

        const updatedMunicipality = await db.municipality.update({
            data: municipalityDto,
            where: {
                id,
            },
        });

        return updatedMunicipality;
    }

    async deleteMunicipality(id: string): Promise<void> {
        const municipality = await db.municipality.findUnique({
            where: {
                id,
                status: true,
            },
        });

        if (!municipality) {
            throw new NotFoundException("Municipality not found");
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _deletedMunicipality = await db.municipality.update({
            data: {
                status: false,
            },
            where: {
                id,
            },
        });
    }
}
