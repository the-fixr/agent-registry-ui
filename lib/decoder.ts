import { Cl, cvToHex, hexToCV, cvToJSON } from "@stacks/transactions";

export function encodePrincipal(principal: string): string {
  return cvToHex(Cl.principal(principal));
}

export function encodeUint(value: number | bigint): string {
  return cvToHex(Cl.uint(value));
}

export function decodeResult(hex: string): any {
  const cv = hexToCV(hex);
  return cvToJSON(cv);
}

// Parse a decoded Clarity optional — returns the inner value or null
export function unwrapOptional(decoded: any): any {
  if (!decoded) return null;
  // cvToJSON returns type as "(optional ...)" for some, "(none)" for none
  const t = typeof decoded.type === "string" ? decoded.type : "";
  if (t === "(none)" || t === "none" || decoded.value === null || decoded.value === undefined) return null;
  if (t.startsWith("(optional") || t === "some" || t === "(some)") return decoded.value;
  return decoded;
}

// Parse a decoded Clarity tuple into a flat JS object
export function parseTuple(decoded: any): Record<string, any> {
  if (!decoded || !decoded.value) return {};
  // cvToJSON returns { type: "(tuple)", value: { field: { type, value } } }
  const result: Record<string, any> = {};
  for (const [key, val] of Object.entries(decoded.value as Record<string, any>)) {
    if (val && typeof val === "object" && "value" in val) {
      result[key] = val.value;
    } else {
      result[key] = val;
    }
  }
  return result;
}
