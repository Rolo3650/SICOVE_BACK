import { Brand } from "@prisma/client";

const mockedBrand = (): Partial<Brand> => {
    return {
        brand: "Volkswagen",
        description:
            "Volkswagen AG, known internationally as the Volkswagen Group, is a German multinational automotive manufacturing corporation headquartered in Wolfsburg, Lower Saxony, Germany and indirectly majority owned by the Porsche and Piëch family.",
    };
};

export { mockedBrand };
