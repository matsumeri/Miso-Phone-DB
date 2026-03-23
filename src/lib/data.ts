import { ContactCategory, Prisma } from "@prisma/client";

export function buildContactWhere(
  query?: string,
  category?: string,
  status?: string,
): Prisma.ContactWhereInput {
  const where: Prisma.ContactWhereInput = {};

  if (status === "DELETED") {
    where.deletedAt = { not: null };
  } else if (status !== "ALL") {
    where.deletedAt = null;
  }

  if (category && Object.values(ContactCategory).includes(category as ContactCategory)) {
    where.category = category as ContactCategory;
  }

  const normalizedQuery = query?.trim();

  if (normalizedQuery) {
    const contains = {
      contains: normalizedQuery,
      mode: "insensitive" as const,
    };

    where.OR = [
      { fullName: contains },
      { nick: contains },
      { phone: contains },
      { whatsapp: contains },
      { nationality: contains },
      { locality: contains },
      { notes: contains },
      { reporter: { fullName: contains } },
      { reporter: { email: contains } },
    ];
  }

  return where;
}

export function buildAuditWhere(query?: string): Prisma.AuditLogWhereInput {
  const normalizedQuery = query?.trim();

  if (!normalizedQuery) {
    return {};
  }

  const contains = {
    contains: normalizedQuery,
    mode: "insensitive" as const,
  };

  return {
    OR: [
      { summary: contains },
      { entityType: contains },
      { entityId: contains },
      { actor: { fullName: contains } },
      { actor: { email: contains } },
    ],
  };
}
