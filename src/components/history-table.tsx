import type { AuditLog, User } from "@prisma/client";

import { AUDIT_ACTION_LABELS } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";

type HistoryLog = AuditLog & {
  actor: Pick<User, "fullName" | "email"> | null;
};

type HistoryTableProps = {
  logs: HistoryLog[];
};

export function HistoryTable({ logs }: HistoryTableProps) {
  return (
    <section className="glass overflow-hidden rounded-[2rem]">
      <div className="border-b border-[color:var(--border)] px-6 py-5">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-teal-700">Historial</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Registros y cambios</h2>
      </div>

      <div className="grid gap-4 p-6">
        {logs.map((log) => (
          <article
            key={log.id}
            className="rounded-[1.5rem] border border-[color:var(--border)] bg-white/75 p-5"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                {AUDIT_ACTION_LABELS[log.action]}
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">
                {log.entityType}
              </span>
              {log.entityId ? <span className="text-xs text-slate-500">ID: {log.entityId}</span> : null}
            </div>
            <p className="mt-4 text-base font-medium text-slate-900">{log.summary}</p>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
              <span>Fecha: {formatDateTime(log.createdAt)}</span>
              <span>
                Usuario: {log.actor?.fullName ?? "Sistema"}
                {log.actor?.email ? ` (${log.actor.email})` : ""}
              </span>
            </div>
            {log.changes ? (
              <pre className="mt-4 overflow-x-auto rounded-[1.25rem] bg-slate-950 p-4 text-xs text-slate-100">
                {JSON.stringify(log.changes, null, 2)}
              </pre>
            ) : null}
          </article>
        ))}

        {logs.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-[color:var(--border)] bg-white/60 px-6 py-12 text-center text-sm text-slate-500">
            Todavia no existen eventos en el historial para esta busqueda.
          </div>
        ) : null}
      </div>
    </section>
  );
}
