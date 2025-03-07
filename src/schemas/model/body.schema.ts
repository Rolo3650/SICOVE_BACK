import { Model } from "@prisma/client";
import { z } from "zod";
import { zObjectId } from "../general.schema";

type SafeModel = Omit<
    Model,
    "id" | "role" | "createdAt" | "updatedAt" | "staus"
>;

const CreateModelSchema = z.object({
    model: z.string(),
    description: z.string(),
    brandId: zObjectId(),
}) satisfies z.ZodType<SafeModel>;

const UpdateModelSchema = CreateModelSchema.partial();

type CreateModel = z.infer<typeof CreateModelSchema>;
type UpdateModel = z.infer<typeof UpdateModelSchema>;

export { CreateModelSchema, UpdateModelSchema };

export type { CreateModel, UpdateModel };
