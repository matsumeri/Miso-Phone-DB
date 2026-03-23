"use server";

import { AuditAction, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth, signOut } from "@/auth";
import { buildQueryString, normalizeOptional } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validators";

async function requireActorId() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return session.user.id;
}

function redirectToDashboard(params: Record<string, string | undefined>): never {
  return redirect(`/dashboard${buildQueryString(params)}`);
}

function redirectToHistory(params: Record<string, string | undefined>): never {
  return redirect(`/dashboard/history${buildQueryString(params)}`);
}

function extractContactFormValues(formData: FormData) {
  return {
    contactId: normalizeOptional(formData.get("contactId")) ?? undefined,
    fullName: String(formData.get("fullName") ?? ""),
    nick: String(formData.get("nick") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    whatsapp: String(formData.get("whatsapp") ?? ""),
    category: String(formData.get("category") ?? ""),
    nationality: String(formData.get("nationality") ?? ""),
    locality: String(formData.get("locality") ?? ""),
    contactDate: String(formData.get("contactDate") ?? ""),
    reporterId: String(formData.get("reporterId") ?? ""),
    notes: String(formData.get("notes") ?? ""),
  };
}

function buildContactData(parsedData: ReturnType<typeof contactSchema.parse>) {
  return {
    fullName: parsedData.fullName.trim(),
    nick: parsedData.nick?.trim() || null,
    phone: parsedData.phone?.trim() || null,
    whatsapp: parsedData.whatsapp?.trim() || null,
    category: parsedData.category,
    nationality: parsedData.nationality?.trim() || null,
    locality: parsedData.locality?.trim() || null,
    contactDate: parsedData.contactDate ? new Date(parsedData.contactDate) : null,
    reporterId: parsedData.reporterId,
    notes: parsedData.notes?.trim() || null,
  } satisfies Prisma.ContactUncheckedCreateInput;
}

async function writeAuditLog(input: {
  action: AuditAction;
  actorId: string;
  entityId?: string;
  summary: string;
  changes?: Prisma.InputJsonValue;
}) {
  await prisma.auditLog.create({
    data: {
      action: input.action,
      actorId: input.actorId,
      entityType: "CONTACT",
      entityId: input.entityId,
      summary: input.summary,
      changes: input.changes,
    },
  });
}

export async function upsertContactAction(formData: FormData) {
  const actorId = await requireActorId();
  const rawValues = extractContactFormValues(formData);
  const parsedValues = contactSchema.safeParse(rawValues);

  if (!parsedValues.success) {
    redirectToDashboard({
      error: parsedValues.error.issues[0]?.message ?? "No se pudo guardar el contacto",
      edit: rawValues.contactId,
    });
  }

  const values = parsedValues.data;

  const reporter = await prisma.user.findUnique({
    where: {
      id: values.reporterId,
    },
    select: {
      id: true,
      fullName: true,
      isActive: true,
    },
  });

  if (!reporter?.isActive) {
    redirectToDashboard({
      error: "El usuario informante no existe o esta inactivo",
      edit: rawValues.contactId,
    });
  }

  const contactData = buildContactData(values);

  if (values.contactId) {
    const previousContact = await prisma.contact.findUnique({
      where: {
        id: values.contactId,
      },
    });

    if (!previousContact) {
      redirectToDashboard({
        error: "El contacto a editar no existe",
      });
    }

    const updatedContact = await prisma.contact.update({
      where: {
        id: values.contactId,
      },
      data: contactData,
    });

    await writeAuditLog({
      action: AuditAction.UPDATED,
      actorId,
      entityId: updatedContact.id,
      summary: `Se actualizo el contacto ${updatedContact.fullName}`,
      changes: {
        before: previousContact,
        after: updatedContact,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/history");
    redirectToDashboard({
      saved: "actualizado",
    });
  }

  const createdContact = await prisma.contact.create({
    data: contactData,
  });

  await writeAuditLog({
    action: AuditAction.CREATED,
    actorId,
    entityId: createdContact.id,
    summary: `Se creo el contacto ${createdContact.fullName}`,
    changes: {
      after: createdContact,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/history");
  redirectToDashboard({
    saved: "creado",
  });
}

export async function deleteContactAction(formData: FormData) {
  const actorId = await requireActorId();
  const contactId = normalizeOptional(formData.get("contactId"));

  if (!contactId) {
    redirectToDashboard({
      error: "No se indico el contacto a eliminar",
    });
  }

  const deletedContact = await prisma.contact.update({
    where: {
      id: contactId,
    },
    data: {
      deletedAt: new Date(),
    },
  });

  await writeAuditLog({
    action: AuditAction.DELETED,
    actorId,
    entityId: deletedContact.id,
    summary: `Se envio a papelera el contacto ${deletedContact.fullName}`,
    changes: {
      deletedAt: deletedContact.deletedAt,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/history");
  redirectToDashboard({
    saved: "eliminado",
  });
}

export async function restoreContactAction(formData: FormData) {
  const actorId = await requireActorId();
  const contactId = normalizeOptional(formData.get("contactId"));

  if (!contactId) {
    redirectToDashboard({
      error: "No se indico el contacto a restaurar",
      status: "DELETED",
    });
  }

  const restoredContact = await prisma.contact.update({
    where: {
      id: contactId,
    },
    data: {
      deletedAt: null,
    },
  });

  await writeAuditLog({
    action: AuditAction.RESTORED,
    actorId,
    entityId: restoredContact.id,
    summary: `Se restauro el contacto ${restoredContact.fullName}`,
    changes: {
      deletedAt: null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/history");
  redirectToDashboard({
    saved: "restaurado",
    status: "DELETED",
  });
}

export async function logoutAction() {
  await signOut({
    redirectTo: "/login",
  });
}

export async function clearHistorySearchAction() {
  redirectToHistory({});
}
