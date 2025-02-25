import { z } from "zod";

const EnvSchema = z.object({
    PORT: z.coerce.number(),
    DATABASE_URL: z.string(),
    BCRYPT_PASSWORD: z.string(),
    API_TOKEN: z.string(),
    FRONT_TOKEN: z.string(),
    FRONT_URL: z.string(),
    JWT_PASSWORD: z.string(),
});

type Env = z.infer<typeof EnvSchema>;

export { EnvSchema };
export type { Env };
