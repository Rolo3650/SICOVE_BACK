import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Colony, Prisma } from "@prisma/client";
import { db } from "src/database/connection.database";
import { CreateColony, UpdateColony } from "src/schemas/colony/body.schema";

@Injectable()
export class ColonyService {
    private configService: ConfigService;

    constructor(configService: ConfigService) {
        this.configService = configService;
    }

    async getColonies(props?: {
        include?: Prisma.ColonyInclude;
    }): Promise<Colony[]> {
        const municipalities = await db.colony.findMany({
            where: {
                status: true,
            },
            include: props?.include,
        });
        return municipalities;
    }

    async getColony(
        id: string,
        props?: {
            include?: Prisma.ColonyInclude;
        },
    ): Promise<Colony> {
        const colony = await db.colony.findUnique({
            where: {
                id,
                status: true,
            },
            include: props?.include,
        });
        if (!colony) {
            throw new NotFoundException("Colony not found");
        }
        return colony;
    }

    async createColony(colonyDto: CreateColony): Promise<Colony> {
        const municipality = await db.municipality.findUnique({
            where: {
                id: colonyDto.municipalityId,
                status: true,
            },
        });
        if (!municipality) {
            throw new NotFoundException("Municipality not found");
        }

        const colony = await db.colony.create({
            data: colonyDto,
        });
        return colony;
    }

    async updateColony(colonyDto: UpdateColony, id: string): Promise<Colony> {
        if (colonyDto.municipalityId) {
            const municipality = await db.municipality.findUnique({
                where: {
                    id: colonyDto.municipalityId,
                    status: true,
                },
            });
            if (!municipality) {
                throw new NotFoundException("Municipality not found");
            }
        }

        const colony = await db.colony.findUnique({
            where: {
                id,
                status: true,
            },
        });

        if (!colony) {
            throw new NotFoundException("Colony not found");
        }

        const updatedColony = await db.colony.update({
            data: colonyDto,
            where: {
                id,
            },
        });

        return updatedColony;
    }

    async deleteColony(id: string): Promise<void> {
        const colony = await db.colony.findUnique({
            where: {
                id,
                status: true,
            },
        });

        if (!colony) {
            throw new NotFoundException("Colony not found");
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _deletedColony = await db.colony.update({
            data: {
                status: false,
            },
            where: {
                id,
            },
        });
    }
}
