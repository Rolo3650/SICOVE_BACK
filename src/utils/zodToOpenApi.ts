import { ApiBodyOptions, ApiParamOptions } from "@nestjs/swagger";
import {
    ReferenceObject,
    SchemaObject,
} from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import { ZodSchema } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const transformZodSchemaToBodySchema = (
    zodSchema: ZodSchema,
): ApiBodyOptions => {
    const body: ApiBodyOptions = { schema: {} };
    const schemaDto = zodToJsonSchema(zodSchema);

    if ("properties" in schemaDto) {
        body.schema = {
            ...body.schema,
            properties: schemaDto.properties as Record<
                string,
                SchemaObject | ReferenceObject
            >,
        };
    }
    if ("required" in schemaDto) {
        body.schema = {
            ...body.schema,
            required: schemaDto.required as string[],
        };
    }

    return body;
};

const transformZodSchemaToParamSchema = (
    zodSchema: ZodSchema,
    index: number,
): ApiParamOptions => {
    const param: ApiParamOptions = {
        name: "",
        type: "",
    };
    const schemaDto = zodToJsonSchema(zodSchema);

    if ("properties" in schemaDto) {
        const keys = Object.keys(schemaDto.properties);

        if (keys.length > index) {
            param.name = keys[index];
            const obj = schemaDto.properties[param.name];
            if ("type" in obj) {
                param.type = obj.type as string;
            }
        }
    }

    return param;
};

export { transformZodSchemaToBodySchema, transformZodSchemaToParamSchema };
