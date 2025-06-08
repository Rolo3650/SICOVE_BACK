import { CirculationType, Road, RoadEntity, RoadType } from "@prisma/client";
import { getEnumPrismaValues } from "src/utils/enum";
import { z } from "zod";
import { NullableToOptional, zObjectId } from "../general.schema";

type SafeRoad = NullableToOptional<
    Omit<Road, "id" | "createdAt" | "updatedAt" | "status">
>;

const CreateRoadSchema = z.object({
    roadName: z.string(),
    roadType: z.enum(getEnumPrismaValues(RoadType)),
    roadEntity: z.enum(getEnumPrismaValues(RoadEntity)),
    circulationType: z.enum(getEnumPrismaValues(CirculationType)),
    colonyId: zObjectId(),
}) satisfies z.ZodType<SafeRoad>;

const UpdateRoadSchema = CreateRoadSchema.partial();

type CreateRoad = z.infer<typeof CreateRoadSchema>;
type UpdateRoad = z.infer<typeof UpdateRoadSchema>;

export { CreateRoadSchema, UpdateRoadSchema };

export type { CreateRoad, UpdateRoad };
