// dataTypes.ts

export function detectDataType(value: unknown): "number" | "date" | "string" {
  if (typeof value === "number" && !isNaN(value)) return "number"
  if (typeof value === "string") {
    if (!isNaN(Date.parse(value))) return "date"
    if (!isNaN(Number(value))) return "number"
    return "string"
  }
  return "string"
}

export function parseValueByType(
  value: string,
  type: "number" | "date" | "string"
) {
  if (type === "number") return parseFloat(value)
  if (type === "date") return new Date(value)
  return value
}
