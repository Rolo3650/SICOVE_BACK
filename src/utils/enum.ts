// biome-ignore lint/nursery/useExplicitType: <explanation>
export function getEnumPrismaValues<T extends Record<string, unknown>>(obj: T) {
    return Object.values(obj) as [(typeof obj)[keyof T]];
}
