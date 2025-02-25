import { Logger } from "@nestjs/common";
import { EnvSchema } from "src/schemas/env.schema";
import {
    hiddeBcryptPassword,
    hiddeGeneralPassword,
    hiddeMongoPassword,
} from "src/utils/reggex";

const validateEnv = (
    config: Record<string, unknown>,
): Record<string, unknown> => {
    const logger = new Logger("Configuration");
    const parsedEnv = EnvSchema.safeParse(config);

    if (parsedEnv.success) {
        logger.log(`

    ✅  Checking environment configuration
    
    PORT: ${parsedEnv.data?.PORT}
    DATABASE_URL: ${hiddeMongoPassword(parsedEnv.data.DATABASE_URL)}
    BCRYPT_PASSWORD: ${hiddeBcryptPassword(parsedEnv.data.BCRYPT_PASSWORD?.toString())}
    API_TOKEN: ${hiddeGeneralPassword(parsedEnv.data.API_TOKEN?.toString())}
    FRONT_TOKEN: ${hiddeGeneralPassword(parsedEnv.data.FRONT_TOKEN?.toString())}
    FRONT_URL: ${parsedEnv.data.FRONT_URL}
    JWT_PASSWORD: ${hiddeGeneralPassword(parsedEnv.data.JWT_PASSWORD?.toString())}
    
            `);
    } else {
        logger.error(`

    🆘   Environment configuration failed
    
                `);
        logger.error(parsedEnv.error);
        process.exit("Process finished");
    }

    return config;
};

export { validateEnv };
