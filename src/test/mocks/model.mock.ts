import { Model } from "@prisma/client";

const mockedModel = (): Partial<Model> => {
    return {
        model: "Golf",
        description:
            "The Volkswagen Golf is a compact car produced by the German automotive manufacturer Volkswagen since 1974, marketed worldwide across eight generations, in various body configurations and under various nameplates.",
    };
};

export { mockedModel };
