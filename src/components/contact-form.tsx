import type { Contact } from "@prisma/client";

import { upsertContactAction } from "@/app/dashboard/actions";
import { CATEGORY_OPTIONS } from "@/lib/constants";
import { formatDateInput } from "@/lib/utils";

type ContactFormProps = {
  currentUserId: string;
  editingContact: Contact | null;
  users: Array<{
    id: string;
    fullName: string;
    email: string;
  }>;
};

export function ContactForm({ currentUserId, editingContact, users }: ContactFormProps) {
  return (
    <section className="glass rounded-[2rem] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-teal-700">Formulario</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            {editingContact ? "Editar contacto" : "Nuevo contacto"}
          </h2>
        </div>
        {editingContact ? (
          <a
            href="/dashboard"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-teal-700 hover:text-teal-800"
          >
            Cancelar edicion
          </a>
        ) : null}
      </div>

      <form action={upsertContactAction} className="mt-6 grid gap-4 md:grid-cols-2">
        <input type="hidden" name="contactId" value={editingContact?.id ?? ""} />

        <div className="grid gap-1 md:col-span-2">
          <label htmlFor="fullName" className="text-sm font-medium text-slate-900">
            Nombre completo
          </label>
          <input
            id="fullName"
            name="fullName"
            required
            minLength={3}
            defaultValue={editingContact?.fullName ?? ""}
            className="rounded-2xl border border-[color:var(--border)] bg-white/90 px-4 py-3 outline-none transition focus:border-teal-700"
          />
        </div>

        <div className="grid gap-1">
          <label htmlFor="nick" className="text-sm font-medium text-slate-900">
            Nick
          </label>
          <input
            id="nick"
            name="nick"
            defaultValue={editingContact?.nick ?? ""}
            className="rounded-2xl border border-[color:var(--border)] bg-white/90 px-4 py-3 outline-none transition focus:border-teal-700"
          />
        </div>

        <div className="grid gap-1">
          <label htmlFor="category" className="text-sm font-medium text-slate-900">
            Categoria
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={editingContact?.category ?? CATEGORY_OPTIONS[0].value}
            className="rounded-2xl border border-[color:var(--border)] bg-white/90 px-4 py-3 outline-none transition focus:border-teal-700"
          >
            {CATEGORY_OPTIONS.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-1">
          <label htmlFor="phone" className="text-sm font-medium text-slate-900">
            Numero telefono
          </label>
          <input
            id="phone"
            name="phone"
            defaultValue={editingContact?.phone ?? ""}
            className="rounded-2xl border border-[color:var(--border)] bg-white/90 px-4 py-3 outline-none transition focus:border-teal-700"
          />
        </div>

        <div className="grid gap-1">
          <label htmlFor="whatsapp" className="text-sm font-medium text-slate-900">
            WhatsApp
          </label>
          <input
            id="whatsapp"
            name="whatsapp"
            defaultValue={editingContact?.whatsapp ?? ""}
            className="rounded-2xl border border-[color:var(--border)] bg-white/90 px-4 py-3 outline-none transition focus:border-teal-700"
          />
        </div>

        <div className="grid gap-1">
          <label htmlFor="nationality" className="text-sm font-medium text-slate-900">
            Nacionalidad
          </label>
          <input
            id="nationality"
            name="nationality"
            defaultValue={editingContact?.nationality ?? ""}
            className="rounded-2xl border border-[color:var(--border)] bg-white/90 px-4 py-3 outline-none transition focus:border-teal-700"
          />
        </div>

        <div className="grid gap-1">
          <label htmlFor="locality" className="text-sm font-medium text-slate-900">
            Localidad
          </label>
          <input
            id="locality"
            name="locality"
            defaultValue={editingContact?.locality ?? ""}
            className="rounded-2xl border border-[color:var(--border)] bg-white/90 px-4 py-3 outline-none transition focus:border-teal-700"
          />
        </div>

        <div className="grid gap-1">
          <label htmlFor="contactDate" className="text-sm font-medium text-slate-900">
            Fecha de contacto
          </label>
          <input
            id="contactDate"
            name="contactDate"
            type="date"
            defaultValue={formatDateInput(editingContact?.contactDate)}
            className="rounded-2xl border border-[color:var(--border)] bg-white/90 px-4 py-3 outline-none transition focus:border-teal-700"
          />
        </div>

        <div className="grid gap-1">
          <label htmlFor="reporterId" className="text-sm font-medium text-slate-900">
            Quien informa
          </label>
          <select
            id="reporterId"
            name="reporterId"
            defaultValue={editingContact?.reporterId ?? currentUserId}
            className="rounded-2xl border border-[color:var(--border)] bg-white/90 px-4 py-3 outline-none transition focus:border-teal-700"
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.fullName} - {user.email}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-1 md:col-span-2">
          <label htmlFor="notes" className="text-sm font-medium text-slate-900">
            Observacion
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={5}
            defaultValue={editingContact?.notes ?? ""}
            className="rounded-[1.5rem] border border-[color:var(--border)] bg-white/90 px-4 py-3 outline-none transition focus:border-teal-700"
          />
        </div>

        <div className="md:col-span-2 flex flex-wrap items-center gap-3 pt-2">
          <button
            type="submit"
            className="rounded-full bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
          >
            {editingContact ? "Guardar cambios" : "Agregar contacto"}
          </button>
          <p className="text-xs leading-6 text-slate-500">
            Debes indicar al menos un telefono o un WhatsApp para guardar el registro.
          </p>
        </div>
      </form>
    </section>
  );
}
