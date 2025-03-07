import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { AppController } from "src/controllers/app.controller";
import { BrandController } from "src/controllers/brand.controller";
import { ModelController } from "src/controllers/model.controller";
import { UserController } from "src/controllers/user.controller";
import { validateEnv } from "src/core/configuration";
import { LoggerMiddleware } from "src/middlewares/logger.middleware";
import { UserMiddleware } from "src/middlewares/user.middleware";
import { AppService } from "src/services/app.service";
import { BrandService } from "src/services/brand.service";
import { ModelService } from "src/services/model.service";
import { UserService } from "src/services/user.service";

@Module({
    imports: [
        ConfigModule.forRoot({
            validate: validateEnv,
            isGlobal: true,
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService): JwtModuleOptions => {
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
    ],
    providers: [AppService, UserService, BrandService, ModelService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(LoggerMiddleware).forRoutes("*path");
        consumer
            .apply(UserMiddleware)
            .exclude({
                path: "user/login",
                method: RequestMethod.POST,
            })
            .forRoutes("*path");
    }
}
