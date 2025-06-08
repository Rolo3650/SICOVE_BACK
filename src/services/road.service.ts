import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Prisma, Road } from "@prisma/client";
import { db } from "src/database/connection.database";
import { CreateRoad, UpdateRoad } from "src/schemas/road/body.schema";

@Injectable()
export class RoadService {
    private configService: ConfigService;

    constructor(configService: ConfigService) {
        this.configService = configService;
    }

    async getRoads(props?: { include?: Prisma.RoadInclude }): Promise<Road[]> {
        const municipalities = await db.road.findMany({
            where: {
                status: true,
            },
            include: props?.include,
        });
        return municipalities;
    }

    async getRoad(
        id: string,
        props?: {
            include?: Prisma.RoadInclude;
        },
    ): Promise<Road> {
        const road = await db.road.findUnique({
            where: {
                id,
                status: true,
            },
            include: props?.include,
        });
        if (!road) {
            throw new NotFoundException("Road not found");
        }
        return road;
    }

    async createRoad(roadDto: CreateRoad): Promise<Road> {
        const colony = await db.colony.findUnique({
            where: {
                id: roadDto.colonyId,
                status: true,
            },
        });
        if (!colony) {
            throw new NotFoundException("Municipality not found");
        }

        const road = await db.road.create({
            data: roadDto,
        });
        return road;
    }

    async updateRoad(roadDto: UpdateRoad, id: string): Promise<Road> {
        if (roadDto.colonyId) {
            const colony = await db.colony.findUnique({
                where: {
                    id: roadDto.colonyId,
                    status: true,
                },
            });
            if (!colony) {
                throw new NotFoundException("Colony not found");
            }
        }

        const road = await db.road.findUnique({
            where: {
                id,
                status: true,
            },
        });

        if (!road) {
            throw new NotFoundException("Road not found");
        }

        const updatedRoad = await db.road.update({
            data: roadDto,
            where: {
                id,
            },
        });

        return updatedRoad;
    }

    async deleteRoad(id: string): Promise<void> {
        const road = await db.road.findUnique({
            where: {
                id,
                status: true,
            },
        });

        if (!road) {
            throw new NotFoundException("Road not found");
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _deletedRoad = await db.road.update({
            data: {
                status: false,
            },
            where: {
                id,
            },
        });
    }
}
