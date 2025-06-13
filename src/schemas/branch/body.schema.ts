import { AdressType, Branch } from "@prisma/client";
import { getEnumPrismaValues } from "src/utils/enum";
import { z } from "zod";
import { NullableToOptional, zObjectId } from "../general.schema";

type SafeBranch = NullableToOptional<
    Omit<Branch, "id" | "createdAt" | "updatedAt" | "status">
>;

const CreateBranchSchema = z.object({
    key: z.string(),
    name: z.string(),
    locationUrl: z.string().optional().nullable(),
    adressType: z.enum(getEnumPrismaValues(AdressType)),

    // Street
    address: z.string().optional().nullable(),
    number: z.string().optional().nullable(),

    // Road
    kilometer: z.string().optional().nullable(),
    origin: z.string().optional().nullable(),
    destination: z.string().optional().nullable(),

    roadId: zObjectId().optional().nullable(),
    colonyId: zObjectId().optional().nullable(),
}) satisfies z.ZodType<SafeBranch>;

const UpdateBranchSchema = CreateBranchSchema.partial();

const AssignVehiclesToBranchSchema = z.object({
    vehiclesId: z.array(zObjectId()),
});

type CreateBranch = z.infer<typeof CreateBranchSchema>;
type UpdateBranch = z.infer<typeof UpdateBranchSchema>;
type AssignVehiclesToBranch = z.infer<typeof AssignVehiclesToBranchSchema>;

export { CreateBranchSchema, UpdateBranchSchema, AssignVehiclesToBranchSchema };
export type { CreateBranch, UpdateBranch, AssignVehiclesToBranch };
