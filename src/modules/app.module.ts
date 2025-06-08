import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { AppController } from "src/controllers/app.controller";
import { BranchController } from "src/controllers/branch.controller";
import { BrandController } from "src/controllers/brand.controller";
import { ColonyController } from "src/controllers/colony.controller";
import { CountryController } from "src/controllers/country.controller";
import { ModelController } from "src/controllers/model.controller";
import { MunicipalityController } from "src/controllers/municipality.controller";
import { StateController } from "src/controllers/state.controller";
import { SubBrandController } from "src/controllers/subBrand.controller";
import { UserController } from "src/controllers/user.controller";
import { VehicleController } from "src/controllers/vehicle.controller";
import { VersionController } from "src/controllers/version.controller";
import { validateEnv } from "src/core/configuration";
import { LoggerMiddleware } from "src/middlewares/logger.middleware";
import { UserMiddleware } from "src/middlewares/user.middleware";
import { AppService } from "src/services/app.service";
import { BranchService } from "src/services/branch.service";
import { BrandService } from "src/services/brand.service";
import { ColonyService } from "src/services/colony.service";
import { CountryService } from "src/services/country.service";
import { ModelService } from "src/services/model.service";
import { MunicipalityService } from "src/services/municipality.service";
import { StateService } from "src/services/state.service";
import { SubBrandService } from "src/services/subBrand.service";
import { UserService } from "src/services/user.service";
import { VehicleService } from "src/services/vehicle.service";
import { VersionService } from "src/services/version.service";

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
        SubBrandController,
        ModelController,
        VersionController,
        VehicleController,
        CountryController,
        StateController,
        MunicipalityController,
        ColonyController,
        BranchController,
    ],
    providers: [
        AppService,
        UserService,
        BrandService,
        SubBrandService,
        ModelService,
        VersionService,
        VehicleService,
        CountryService,
        StateService,
        MunicipalityService,
        ColonyService,
        ColonyService,
        BranchService,
    ],
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
