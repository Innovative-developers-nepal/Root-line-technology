"use client";
import { useCallback, useState } from "react";

export function useToggle(initial = false): [boolean, () => void, (v: boolean) => void] {
  const [on, setOn] = useState(initial);
  const toggle = useCallback(() => setOn((p) => !p), []);
  return [on, toggle, setOn];
}
