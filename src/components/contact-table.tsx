import type { Contact, User } from "@prisma/client";

import { deleteContactAction, restoreContactAction } from "@/app/dashboard/actions";
import { CATEGORY_LABELS } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";

type ContactWithReporter = Contact & {
  reporter: Pick<User, "fullName" | "email">;
};

type ContactTableProps = {
  contacts: ContactWithReporter[];
};

export function ContactTable({ contacts }: ContactTableProps) {
  return (
    <section className="glass overflow-hidden rounded-[2rem]">
      <div className="flex items-center justify-between gap-4 border-b border-[color:var(--border)] px-6 py-5">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-teal-700">Listado</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Contactos registrados</h2>
        </div>
        <p className="text-sm text-slate-500">{contacts.length} visibles</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/70 text-xs uppercase tracking-[0.2em] text-slate-500">
            <tr>
              <th className="px-6 py-4 font-medium">Contacto</th>
              <th className="px-6 py-4 font-medium">Categoria</th>
              <th className="px-6 py-4 font-medium">Ubicacion</th>
              <th className="px-6 py-4 font-medium">Informa</th>
              <th className="px-6 py-4 font-medium">Fechas</th>
              <th className="px-6 py-4 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--border)] bg-[color:var(--card-strong)]/70">
            {contacts.map((contact) => (
              <tr key={contact.id} className={contact.deletedAt ? "bg-red-50/70" : undefined}>
                <td className="px-6 py-5 align-top">
                  <div className="grid gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-slate-900">{contact.fullName}</span>
                      {contact.deletedAt ? (
                        <span className="rounded-full bg-red-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-red-700">
                          Papelera
                        </span>
                      ) : null}
                    </div>
                    {contact.nick ? <span className="text-slate-500">@{contact.nick}</span> : null}
                    {contact.phone ? <span>Telefono: {contact.phone}</span> : null}
                    {contact.whatsapp ? <span>WhatsApp: {contact.whatsapp}</span> : null}
                    {contact.notes ? <span className="line-clamp-2 text-slate-500">{contact.notes}</span> : null}
                  </div>
                </td>
                <td className="px-6 py-5 align-top">
                  <span className="rounded-full bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-800">
                    {CATEGORY_LABELS[contact.category]}
                  </span>
                </td>
                <td className="px-6 py-5 align-top text-slate-600">
                  <div>{contact.nationality || "-"}</div>
                  <div>{contact.locality || "-"}</div>
                </td>
                <td className="px-6 py-5 align-top text-slate-600">
                  <div className="font-medium text-slate-800">{contact.reporter.fullName}</div>
                  <div>{contact.reporter.email}</div>
                </td>
                <td className="px-6 py-5 align-top text-slate-600">
                  <div>Contacto: {formatDateTime(contact.contactDate)}</div>
                  <div>Creado: {formatDateTime(contact.createdAt)}</div>
                  <div>Editado: {formatDateTime(contact.updatedAt)}</div>
                  <div>Eliminado: {formatDateTime(contact.deletedAt)}</div>
                </td>
                <td className="px-6 py-5 align-top">
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`/dashboard?edit=${contact.id}`}
                      className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-700 transition hover:border-teal-700 hover:text-teal-800"
                    >
                      Editar
                    </a>

                    {contact.deletedAt ? (
                      <form action={restoreContactAction}>
                        <input type="hidden" name="contactId" value={contact.id} />
                        <button
                          type="submit"
                          className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-emerald-800 transition hover:border-emerald-500"
                        >
                          Restaurar
                        </button>
                      </form>
                    ) : (
                      <form action={deleteContactAction}>
                        <input type="hidden" name="contactId" value={contact.id} />
                        <button
                          type="submit"
                          className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-red-700 transition hover:border-red-500"
                        >
                          Eliminar
                        </button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {contacts.length === 0 ? (
        <div className="px-6 py-12 text-center text-sm text-slate-500">
          No hay contactos para los filtros aplicados.
        </div>
      ) : null}
    </section>
  );
}
