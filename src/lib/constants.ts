import { AuditAction, ContactCategory } from "@prisma/client";

export const CATEGORY_LABELS = {
  SELLER: "Vendedor/a",
  HARASSER: "Hostigante",
  ANNOYING: "Molestoso/a",
  PERVERT: "Pervertido/a",
  UNCERTAIN: "En duda",
} satisfies Record<ContactCategory, string>;

export const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
  value: value as ContactCategory,
  label,
}));

export const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Activos" },
  { value: "DELETED", label: "Eliminados" },
  { value: "ALL", label: "Todos" },
] as const;

export const AUDIT_ACTION_LABELS = {
  CREATED: "Creado",
  UPDATED: "Actualizado",
  DELETED: "Eliminado",
  RESTORED: "Restaurado",
  LOGIN_SUCCESS: "Login correcto",
  LOGIN_FAILURE: "Login fallido",
} satisfies Record<AuditAction, string>;
