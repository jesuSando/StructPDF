import { StyleObject } from "../ast/types";

export function parseInlineStyle(style?: string): StyleObject {
    if (!style) return {};

    const result: StyleObject = {};

    const rules = style.split(";").map(r => r.trim()).filter(Boolean);

    for (const rule of rules) {
        const [rawKey, rawValue] = rule.split(":").map(s => s.trim());
        if (!rawKey || !rawValue) continue;

        const key = toCamelCase(rawKey);
        const value = parseValue(rawValue);

        (result as any)[key] = value;
    }

    return result;
}

function toCamelCase(str: string): string {
    return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function parseValue(value: string): any {
    if (!isNaN(Number(value))) {
        return Number(value);
    }

    if (value === "true") return true;
    if (value === "false") return false;

    return value;
}