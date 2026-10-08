import { TDEE_FILTER_DATA } from "../data/staticData";

export type IdNameItem = {
  id: string;
  name: string;
};

export function getNameById(
  id: string | null | undefined,
  items: readonly IdNameItem[] = TDEE_FILTER_DATA,
  fallback = "",
): string {
  if (!id) return fallback;
  return items.find((x) => x.id === id)?.name ?? fallback;
}
