import { Municipality } from "@prisma/client";
import { z } from "zod";
import { NullableToOptional, zObjectId } from "../general.schema";

type SafeMunicipality = NullableToOptional<
    Omit<Municipality, "id" | "createdAt" | "updatedAt" | "status">
>;

const CreateMunicipalitySchema = z.object({
    municipality: z.string(),
    stateId: zObjectId(),
}) satisfies z.ZodType<SafeMunicipality>;

const UpdateMunicipalitySchema = CreateMunicipalitySchema.partial();

type CreateMunicipality = z.infer<typeof CreateMunicipalitySchema>;
type UpdateMunicipality = z.infer<typeof UpdateMunicipalitySchema>;

export { CreateMunicipalitySchema, UpdateMunicipalitySchema };

export type { CreateMunicipality, UpdateMunicipality };
