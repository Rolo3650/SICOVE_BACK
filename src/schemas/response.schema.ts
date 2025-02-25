import { z } from "zod";

const GeneralResponseSchema = z.object({
    token: z.string().optional().nullable(),
    message: z.string(),
    statusCode: z.number(),
});

const SuccessResponseSchema = GeneralResponseSchema.extend({
    data: z.record(z.any()),
});

const ErrorResponseSchema = GeneralResponseSchema.extend({
    error: z.record(z.any()),
});

type GeneralResponse = z.infer<typeof GeneralResponseSchema>;
type SuccessResponse = z.infer<typeof SuccessResponseSchema>;
type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

export { GeneralResponseSchema, ErrorResponseSchema, SuccessResponseSchema };
export type { GeneralResponse, ErrorResponse, SuccessResponse };
