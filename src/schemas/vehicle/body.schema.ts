import {
    OwnerType,
    Vehicle,
    VehicleStatus,
    VerificiationColor,
} from "@prisma/client";
import { getEnumPrismaValues } from "src/utils/enum";
import { z } from "zod";
import { NullableToOptional, zObjectId } from "../general.schema";

type SafeVehicle = NullableToOptional<
    Omit<Vehicle, "id" | "createdAt" | "updatedAt" | "status">
>;

const CreateVehicleSchema = z.object({
    // biome-ignore lint/style/useNamingConvention: acronym
    VIN: z.string().nullable().optional(),
    color: z.string(),
    mileage: z.number(),
    engineNumber: z.string(),
    chasisNumber: z.string(),
    vehicleStatus: z.enum(getEnumPrismaValues(VehicleStatus)),
    size: z.number().int(),

    // Verification information
    registered: z.boolean(),
    circulationCard: z.string().nullable().optional(),
    circulationEndDate: z.coerce.date().nullable().optional(),
    licencePlate: z.string().nullable().optional(),
    verificationNumber: z.number().int().nullable().optional(),
    verificationColor: z.enum(getEnumPrismaValues(VerificiationColor)),

    // Owner information
    ownerName: z.string().nullable().optional(),
    ownerType: z.enum(getEnumPrismaValues(OwnerType)).optional().nullable(),
    ownerPhone: z.string().nullable().optional(),
    observation: z.string().nullable().optional(),

    // Relations
    versionId: zObjectId(),
}) satisfies z.ZodType<SafeVehicle>;

const UpdateVehicleSchema = CreateVehicleSchema.partial();

type CreateVehicle = z.infer<typeof CreateVehicleSchema>;
type UpdateVehicle = z.infer<typeof UpdateVehicleSchema>;

export { CreateVehicleSchema, UpdateVehicleSchema };

export type { CreateVehicle, UpdateVehicle };
