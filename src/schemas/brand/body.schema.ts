import { Brand } from "@prisma/client";
import { z } from "zod";

type SafeBrand = Omit<
    Brand,
    "id" | "role" | "createdAt" | "updatedAt" | "staus"
>;

const CreateBrandSchema = z.object({
    brand: z.string(),
    description: z.string(),
}) satisfies z.ZodType<SafeBrand>;

const LoginSchema = z.object({
    email: z.string(),
    password: z.string(),
});

const UpdateBrandSchema = CreateBrandSchema.partial();

type CreateBrand = z.infer<typeof CreateBrandSchema>;
type Login = z.infer<typeof LoginSchema>;
type UpdateBrand = z.infer<typeof UpdateBrandSchema>;

export { LoginSchema, CreateBrandSchema, UpdateBrandSchema };

export type { Login, CreateBrand, UpdateBrand };
