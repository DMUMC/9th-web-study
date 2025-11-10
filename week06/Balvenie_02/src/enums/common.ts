export const PAGENATION_ORDER = {
    ASC: "asc",
    DESC: "desc"
} as const;

export type PagenationOrder = typeof PAGENATION_ORDER[keyof typeof PAGENATION_ORDER];