import { Vehicle } from "@prisma/client";

const mockedVehicle = (): Partial<Vehicle> => {
    return {
        chasisNumber: "123",
        color: "#222222",
        engineNumber: "123",
        licencePlate: "123",
        mileage: 20000,
        // biome-ignore lint/style/useNamingConvention: <explanation>
        VIN: "123456",
    };
};

export { mockedVehicle };
