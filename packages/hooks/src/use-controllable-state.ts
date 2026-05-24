"use client";
import { useCallback, useState } from "react";

export function useControllableState<T>(opts: {
  value?: T;
  defaultValue: T;
  onChange?: (v: T) => void;
}): [T, (v: T) => void] {
  const { value, defaultValue, onChange } = opts;
  const [internal, setInternal] = useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? (value as T) : internal;

  const set = useCallback(
    (v: T) => {
      if (!isControlled) setInternal(v);
      onChange?.(v);
    },
    [isControlled, onChange],
  );

  return [current, set];
}
