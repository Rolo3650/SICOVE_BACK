import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Prisma, State } from "@prisma/client";
import { db } from "src/database/connection.database";
import type { CreateState, UpdateState } from "src/schemas/state/body.schema";

@Injectable()
export class StateService {
    private configService: ConfigService;

    constructor(configService: ConfigService) {
        this.configService = configService;
    }

    async getStates(props?: {
        include?: Prisma.StateInclude;
    }): Promise<State[]> {
        const states = await db.state.findMany({
            where: {
                status: true,
            },
            include: props?.include,
        });
        return states;
    }

    async getState(
        id: string,
        props?: {
            include?: Prisma.StateInclude;
        },
    ): Promise<State> {
        const state = await db.state.findUnique({
            where: {
                id,
                status: true,
            },
            include: props?.include,
        });
        if (!state) {
            throw new NotFoundException("State not found");
        }
        return state;
    }

    async createState(stateDto: CreateState): Promise<State> {
        const country = await db.country.findUnique({
            where: {
                id: stateDto.countryId,
                status: true,
            },
        });
        if (!country) {
            throw new NotFoundException("Brand not found");
        }

        const state = await db.state.create({
            data: stateDto,
        });
        return state;
    }

    async updateState(stateDto: UpdateState, id: string): Promise<State> {
        if (stateDto.countryId) {
            const country = await db.country.findUnique({
                where: {
                    id: stateDto.countryId,
                    status: true,
                },
            });
            if (!country) {
                throw new NotFoundException("Brand not found");
            }
        }

        const state = await db.state.findUnique({
            where: {
                id,
                status: true,
            },
        });

        if (!state) {
            throw new NotFoundException("State not found");
        }

        const updatedState = await db.state.update({
            data: stateDto,
            where: {
                id,
            },
        });

        return updatedState;
    }

    async deleteState(id: string): Promise<void> {
        const state = await db.state.findUnique({
            where: {
                id,
                status: true,
            },
        });

        if (!state) {
            throw new NotFoundException("State not found");
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _deletedState = await db.state.update({
            data: {
                status: false,
            },
            where: {
                id,
            },
        });
    }
}
