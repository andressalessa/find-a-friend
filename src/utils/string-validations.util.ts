/** Celular brasileiro: 11 dígitos (DDD + 9 + 8 dígitos), sem código do país. Aceita formatado. */
export const celularRegex = /^[1-9]\d9\d{8}$/;
export const normalizePhone = (v: string) => v.replace(/\D/g, "");
