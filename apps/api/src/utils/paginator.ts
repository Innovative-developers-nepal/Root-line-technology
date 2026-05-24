export interface PaginationParams {
    cursor?: string;
    limit: number;
    sort: string;
    order: "asc" | "desc";
}

export interface PaginationMeta {
    nextCursor: string | null;
    limit: number;
    hasMore: boolean;
}

export const parsePagination = (query: Record<string, any>): PaginationParams => {
    const limit = Math.min(Number(query.limit) || 20, 100);
    const cursor = typeof query.cursor === "string" ? query.cursor : undefined;
    const sort = typeof query.sort === "string" ? query.sort : "createdAt";
    const order: "asc" | "desc" = query.order === "asc" ? "asc" : "desc";
    return { cursor, limit, sort, order };
};

// Expects items fetched with take = limit + 1. Mutates the array by popping the extra item.
export const buildPaginationMeta = <T extends { id: string }>(
    items: T[],
    limit: number
): PaginationMeta => {
    const hasMore = items.length > limit;
    if (hasMore) items.pop();
    const nextCursor = hasMore ? items[items.length - 1].id : null;
    return { nextCursor, limit, hasMore };
};
