export type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    pagination?: {
      nextCursor?: string | null;
      total?: number;
    };
  };
};

export type CursorPage<T> = {
  items: T[];
  nextCursor: string | null;
};

export type ListFilters = {
  cursor?: string;
  take?: number;
  q?: string;
  published?: boolean;
  category?: string;
  industry?: string;
};
