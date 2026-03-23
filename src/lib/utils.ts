import { clsx } from "clsx";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function cn(...values: Array<string | false | null | undefined>) {
  return clsx(values);
}

export function formatDateTime(value?: Date | string | null) {
  if (!value) {
    return "-";
  }

  return format(new Date(value), "dd MMM yyyy, HH:mm", { locale: es });
}

export function formatDateInput(value?: Date | string | null) {
  if (!value) {
    return "";
  }

  return format(new Date(value), "yyyy-MM-dd");
}

export function normalizeOptional(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

export function buildQueryString(params: Record<string, string | undefined>) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      searchParams.set(key, value);
    }
  }

  const query = searchParams.toString();
  return query.length > 0 ? `?${query}` : "";
}
