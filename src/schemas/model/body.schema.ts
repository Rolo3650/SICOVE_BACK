import { Model } from "@prisma/client";
import { z } from "zod";
import { NullableToOptional, zObjectId } from "../general.schema";

type SafeModel = NullableToOptional<
    Omit<Model, "id" | "createdAt" | "updatedAt" | "status">
>;

const CreateModelSchema = z.object({
    model: z.string(),
    description: z.string().nullable().optional(),
    brandId: zObjectId(),
}) satisfies z.ZodType<SafeModel>;

const UpdateModelSchema = CreateModelSchema.partial();

type CreateModel = z.infer<typeof CreateModelSchema>;
type UpdateModel = z.infer<typeof UpdateModelSchema>;

export { CreateModelSchema, UpdateModelSchema };

export type { CreateModel, UpdateModel };
