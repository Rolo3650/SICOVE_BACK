import { AppController } from "src/controllers/app.controller";
import { getApplication } from "src/test/core/application.core";

describe("AppController", () => {
    let appController: AppController;

    beforeAll(async () => {
        const app = await getApplication();

        appController = app.get<AppController>(AppController);
    });

    describe("root", () => {
        it('should return "Hello World!"', () => {
            expect(appController.getHello()).toBe("Hello World!");
        });
    });
});
