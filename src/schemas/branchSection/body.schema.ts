import { BranchSection } from "@prisma/client";
import { z } from "zod";
import { NullableToOptional, zObjectId } from "../general.schema";

type SafeBranchSection = NullableToOptional<
    Omit<BranchSection, "id" | "createdAt" | "updatedAt" | "status">
>;

const CreateBranchSectionSchema = z.object({
    name: z.string(),
    capacity: z.number().int(),
    branchId: zObjectId(),
}) satisfies z.ZodType<SafeBranchSection>;

const UpdateBranchSectionSchema = CreateBranchSectionSchema.partial();

type CreateBranchSection = z.infer<typeof CreateBranchSectionSchema>;
type UpdateBranchSection = z.infer<typeof UpdateBranchSectionSchema>;

export { CreateBranchSectionSchema, UpdateBranchSectionSchema };
export type { CreateBranchSection, UpdateBranchSection };
