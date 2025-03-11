import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Model } from "@prisma/client";
import { db } from "src/database/connection.database";
import type { CreateModel, UpdateModel } from "src/schemas/model/body.schema";

@Injectable()
export class ModelService {
    private configService: ConfigService;

    constructor(configService: ConfigService) {
        this.configService = configService;
    }

    async getModels(): Promise<Model[]> {
        const models = await db.model.findMany({
            where: {
                status: true,
            },
        });
        return models;
    }

    async getModel(id: string): Promise<Model> {
        const model = await db.model.findUnique({
            where: {
                id,
                status: true,
            },
        });
        if (!model) {
            throw new NotFoundException("Model not found");
        }
        return model;
    }

    async createModel(modelDto: CreateModel): Promise<Model> {
        const brand = await db.brand.findUnique({
            where: {
                id: modelDto.brandId,
                status: true,
            },
        });
        if (!brand) {
            throw new NotFoundException("Brand not found");
        }

        const model = await db.model.create({
            data: modelDto,
        });
        return model;
    }

    async updateModel(modelDto: UpdateModel, id: string): Promise<Model> {
        if (modelDto.brandId) {
            const brand = await db.brand.findUnique({
                where: {
                    id: modelDto.brandId,
                    status: true,
                },
            });
            if (!brand) {
                throw new NotFoundException("Brand not found");
            }
        }

        const model = await db.model.findUnique({
            where: {
                id,
                status: true,
            },
        });

        if (!model) {
            throw new NotFoundException("Model not found");
        }

        const updatedModel = await db.model.update({
            data: modelDto,
            where: {
                id,
            },
        });

        return updatedModel;
    }

    async deleteModel(id: string): Promise<void> {
        const model = await db.model.findUnique({
            where: {
                id,
                status: true,
            },
        });

        if (!model) {
            throw new NotFoundException("Model not found");
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _deletedModel = await db.model.update({
            data: {
                status: false,
            },
            where: {
                id,
            },
        });
    }
}
