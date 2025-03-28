import { City } from "@prisma/client";
import { z } from "zod";
import { NullableToOptional, zObjectId } from "../general.schema";

type SafeCity = NullableToOptional<
    Omit<City, "id" | "createdAt" | "updatedAt" | "status">
>;

const CreateCitySchema = z.object({
    city: z.string(),
    municipalityId: zObjectId(),
}) satisfies z.ZodType<SafeCity>;

const UpdateCitySchema = CreateCitySchema.partial();

type CreateCity = z.infer<typeof CreateCitySchema>;
type UpdateCity = z.infer<typeof UpdateCitySchema>;

export { CreateCitySchema, UpdateCitySchema };

export type { CreateCity, UpdateCity };
