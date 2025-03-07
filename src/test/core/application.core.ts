import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { Test, type TestingModule } from "@nestjs/testing";
import { AppController } from "src/controllers/app.controller";
import { BrandController } from "src/controllers/brand.controller";
import { ModelController } from "src/controllers/model.controller";
import { UserController } from "src/controllers/user.controller";
import { VersionController } from "src/controllers/version.controller";
import { validateEnv } from "src/core/configuration";
import { AppService } from "src/services/app.service";
import { BrandService } from "src/services/brand.service";
import { ModelService } from "src/services/model.service";
import { UserService } from "src/services/user.service";
import { VersionService } from "src/services/version.service";

const getApplication = async (): Promise<TestingModule> => {
    const app = await Test.createTestingModule({
        imports: [
            ConfigModule.forRoot({
                validate: validateEnv,
                isGlobal: true,
            }),
            JwtModule.registerAsync({
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (
                    configService: ConfigService,
                ): JwtModuleOptions => {
                    return {
                        secret: configService.get<string>("JWT_PASSWORD"),
                        signOptions: {
                            expiresIn: "30d",
                        },
                    };
                },
            }),
        ],
        controllers: [
            AppController,
            UserController,
            BrandController,
            ModelController,
            VersionController,
        ],
        providers: [
            AppService,
            UserService,
            BrandService,
            ModelService,
            VersionService,
        ],
    }).compile();

    return app;
};

export { getApplication };
