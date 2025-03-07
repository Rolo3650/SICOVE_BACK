import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { db } from "src/database/connection.database";
// import { TokenGuard } from "src/guards/tokenGuard.guard";
import { ExceptionsHandler } from "src/middlewares/exceptions.middleware";
import { AppModule } from "src/modules/app.module";
import { hiddeMongoPassword } from "src/utils/reggex";

async function bootstrap(): Promise<void> {
    const logger = new Logger("Main");

    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix("/api/v1");

    const config = new DocumentBuilder()
        .setTitle("API SICUDI")
        .setDescription("Documentación de la API")
        .setVersion("1.0")
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("/api/docs", app, document);

    const configService = app.get(ConfigService);
    // app.useGlobalGuards(new TokenGuard(configService));
    const port = configService.get<number>("PORT");
    const dbUrl = configService.get<string>("DATABASE_URL");

    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new ExceptionsHandler(httpAdapter));
    await db.$connect();

    if (port) {
        await app.listen(port, () => {
            logger.log(`
                
    ▶️  Initializing application on port ${port}
    ▶️  Connectiong database url on ${hiddeMongoPassword(dbUrl ?? "")}
                
                `);
        });
    }
}
bootstrap().catch((err) => console.log(err));
