import { BranchRegistration, CheckType } from "@prisma/client";
import { getEnumPrismaValues } from "src/utils/enum";
import { z } from "zod";
import { NullableToOptional, zObjectId } from "../general.schema";

type SafeBranchRegistration = NullableToOptional<
    Omit<BranchRegistration, "id" | "createdAt" | "updatedAt" | "status">
>;

const CreateBranchRegistrationSchema = z.object({
    checkType: z.enum(getEnumPrismaValues(CheckType)),
    branchSectionId: zObjectId(),
    vehicleId: zObjectId(),
    userId: zObjectId(),
}) satisfies z.ZodType<SafeBranchRegistration>;

const UpdateBranchRegistrationSchema = CreateBranchRegistrationSchema.partial();

type CreateBranchRegistration = z.infer<typeof CreateBranchRegistrationSchema>;
type UpdateBranchRegistration = z.infer<typeof UpdateBranchRegistrationSchema>;

export { CreateBranchRegistrationSchema, UpdateBranchRegistrationSchema };
export type { CreateBranchRegistration, UpdateBranchRegistration };
