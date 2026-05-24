export function isString(x: unknown): x is string {
  return typeof x === "string";
}

export function isNonEmpty(x: unknown): x is string {
  return typeof x === "string" && x.length > 0;
}

export function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

export function assertNever(x: never): never {
  throw new Error(`Unexpected: ${JSON.stringify(x)}`);
}
