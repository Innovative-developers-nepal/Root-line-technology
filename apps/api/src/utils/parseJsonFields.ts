export function parseJsonFields<T extends Record<string, unknown>, K extends keyof T>(
    obj: T,
    fields: K[],
): T {
    const result = { ...obj };
    for (const field of fields) {
        const val = result[field];
        if (typeof val === "string") {
            try {
                (result as Record<string, unknown>)[field as string] = JSON.parse(val);
            } catch {
                // leave as-is if not valid JSON
            }
        }
    }
    return result;
}

export function parseJsonList<T extends Record<string, unknown>, K extends keyof T>(
    items: T[],
    fields: K[],
): T[] {
    return items.map((item) => parseJsonFields(item, fields));
}
