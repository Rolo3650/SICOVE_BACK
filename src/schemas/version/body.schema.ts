import {
    FuelType,
    TransmissionType,
    VehicleType,
    Version,
} from "@prisma/client";
import { getEnumPrismaValues } from "src/utils/enum";
import { z } from "zod";
import { NullableToOptional, zObjectId } from "../general.schema";

type SafeVersion = NullableToOptional<
    Omit<Version, "id" | "createdAt" | "updatedAt" | "staus">
>;

const CreateVersionSchema = z.object({
    version: z.string(),
    vehicleType: z.enum(getEnumPrismaValues(VehicleType)),
    fuelType: z.enum(getEnumPrismaValues(FuelType)),
    transmissionType: z.enum(getEnumPrismaValues(TransmissionType)),
    engineSize: z.number(),
    description: z.string().nullable().optional(),
    modelId: zObjectId(),
    year: z.coerce.date(),
}) satisfies z.ZodType<SafeVersion>;

const UpdateVersionSchema = CreateVersionSchema.partial();

type CreateVersion = z.infer<typeof CreateVersionSchema>;
type UpdateVersion = z.infer<typeof UpdateVersionSchema>;

export { CreateVersionSchema, UpdateVersionSchema };

export type { CreateVersion, UpdateVersion };
