import { HistoryTable } from "@/components/history-table";
import { LogoutButton } from "@/components/logout-button";
import { requireUser } from "@/lib/auth-helpers";
import { buildAuditWhere } from "@/lib/data";
import { prisma } from "@/lib/prisma";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function pickValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireUser();
  const resolvedSearchParams = await searchParams;
  const query = pickValue(resolvedSearchParams.q) ?? "";

  const logs = await prisma.auditLog.findMany({
    where: buildAuditWhere(query),
    include: {
      actor: {
        select: {
          fullName: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });

  return (
    <main className="shell py-6 md:py-10">
      <section className="grid gap-6 rounded-[2rem] border border-white/60 bg-[color:var(--background-strong)]/75 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-teal-700">Auditoria</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              Historial de registros
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
              Consulta altas, ediciones, borrados, restauraciones e intentos de acceso. Se muestran los
              ultimos 100 eventos ordenados por fecha.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/dashboard"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Volver al dashboard
            </a>
            <LogoutButton />
          </div>
        </div>

        <form className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
          <input
            name="q"
            defaultValue={query}
            placeholder="Buscar por accion, usuario, resumen o entidad"
            className="rounded-2xl border border-[color:var(--border)] bg-white/90 px-4 py-3 outline-none transition focus:border-teal-700"
          />
          <button
            type="submit"
            className="rounded-full bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
          >
            Buscar
          </button>
          <a
            href="/dashboard/history"
            className="rounded-full border border-slate-200 px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-teal-700 hover:text-teal-800"
          >
            Limpiar
          </a>
        </form>
      </section>

      <section className="mt-6">
        <HistoryTable logs={logs} />
      </section>
    </main>
  );
}
