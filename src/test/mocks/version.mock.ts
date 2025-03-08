import { Version } from "@prisma/client";

const mockedVersion = (): Partial<Version> => {
    return {
        version: "GLI",
        description: "The most powerfull hasback car created.",
        fuelType: "Gasoline",
        engineSize: 1.8,
        transmissionType: "Automatic",
        vehicleType: "Sedan",
        year: new Date("2024-01-01"),
    };
};

export { mockedVersion };
