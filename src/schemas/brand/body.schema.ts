import { Brand } from "@prisma/client";
import { z } from "zod";

type SafeBrand = Omit<Brand, "id" | "createdAt" | "updatedAt" | "staus">;

const CreateBrandSchema = z.object({
    brand: z.string(),
    description: z.string(),
}) satisfies z.ZodType<SafeBrand>;

const UpdateBrandSchema = CreateBrandSchema.partial();

type CreateBrand = z.infer<typeof CreateBrandSchema>;
type UpdateBrand = z.infer<typeof UpdateBrandSchema>;

export { CreateBrandSchema, UpdateBrandSchema };

export type { CreateBrand, UpdateBrand };
