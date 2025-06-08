import { SubBrand } from "@prisma/client";
import { z } from "zod";
import { NullableToOptional, zObjectId } from "../general.schema";

type SafeSubBrand = NullableToOptional<
    Omit<SubBrand, "id" | "createdAt" | "updatedAt" | "status">
>;

const CreateSubBrandSchema = z.object({
    subBrand: z.string(),
    description: z.string().nullable().optional(),
    brandId: zObjectId(),
}) satisfies z.ZodType<SafeSubBrand>;

const UpdateSubBrandSchema = CreateSubBrandSchema.partial();

type CreateSubBrand = z.infer<typeof CreateSubBrandSchema>;
type UpdateSubBrand = z.infer<typeof UpdateSubBrandSchema>;

export { CreateSubBrandSchema, UpdateSubBrandSchema };

export type { CreateSubBrand, UpdateSubBrand };
