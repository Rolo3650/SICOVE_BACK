import { Vehicle } from "@prisma/client";
import { z } from "zod";
import { NullableToOptional, zObjectId } from "../general.schema";

type SafeVehicle = NullableToOptional<
    Omit<Vehicle, "id" | "createdAt" | "updatedAt" | "status">
>;

const CreateVehicleSchema = z.object({
    color: z.string(),
    mileage: z.number(),
    engineNumber: z.string(),
    chasisNumber: z.string(),
    licencePlate: z.string().nullable().optional(),
    // biome-ignore lint/style/useNamingConvention: <explanation>
    VIN: z.string().nullable().optional(),
    versionId: zObjectId(),
}) satisfies z.ZodType<SafeVehicle>;

const UpdateVehicleSchema = CreateVehicleSchema.partial();

type CreateVehicle = z.infer<typeof CreateVehicleSchema>;
type UpdateVehicle = z.infer<typeof UpdateVehicleSchema>;

export { CreateVehicleSchema, UpdateVehicleSchema };

export type { CreateVehicle, UpdateVehicle };
