import { Branch } from "@prisma/client";
import { z } from "zod";
import { NullableToOptional, zObjectId } from "../general.schema";

type SafeBranch = NullableToOptional<
    Omit<Branch, "id" | "createdAt" | "updatedAt" | "status">
>;

const CreateBranchSchema = z.object({
    name: z.string(),
    address: z.string(),
    locationUrl: z.string().optional().nullable(),
    vehicleCapacity: z.number(),
    trucksCapacity: z.number(),
    cityId: zObjectId(),
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
