import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Version } from "@prisma/client";
import { db } from "src/database/connection.database";
import type {
    CreateVersion,
    UpdateVersion,
} from "src/schemas/version/body.schema";

@Injectable()
export class VersionService {
    private configService: ConfigService;

    constructor(configService: ConfigService) {
        this.configService = configService;
    }

    async getVersions(): Promise<Version[]> {
        const versions = await db.version.findMany({
            where: {
                staus: true,
            },
        });
        return versions;
    }

    async getVersion(id: string): Promise<Version> {
        const version = await db.version.findUnique({
            where: {
                id,
                staus: true,
            },
        });
        if (!version) {
            throw new NotFoundException("Version not found");
        }
        return version;
    }

    async createVersion(versionDto: CreateVersion): Promise<Version> {
        const model = await db.model.findUnique({
            where: {
                id: versionDto.modelId,
                staus: true,
            },
        });
        if (!model) {
            throw new NotFoundException("Model not found");
        }

        const version = await db.version.create({
            data: versionDto,
        });
        return version;
    }

    async updateVersion(
        versionDto: UpdateVersion,
        id: string,
    ): Promise<Version> {
        if (versionDto.modelId) {
            const model = await db.model.findUnique({
                where: {
                    id: versionDto.modelId,
                    staus: true,
                },
            });
            if (!model) {
                throw new NotFoundException("Model not found");
            }
        }

        const version = await db.version.findUnique({
            where: {
                id,
                staus: true,
            },
        });

        if (!version) {
            throw new NotFoundException("Version not found");
        }

        const updatedVersion = await db.version.update({
            data: versionDto,
            where: {
                id,
            },
        });

        return updatedVersion;
    }

    async deleteVersion(id: string): Promise<void> {
        const version = await db.version.findUnique({
            where: {
                id,
                staus: true,
            },
        });

        if (!version) {
            throw new NotFoundException("Version not found");
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _deletedVersion = await db.version.update({
            data: {
                staus: false,
            },
            where: {
                id,
            },
        });
    }
}
