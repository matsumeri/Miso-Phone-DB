import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { buildContactWhere } from "@/lib/data";
import { ContactForm } from "@/components/contact-form";
import { ContactTable } from "@/components/contact-table";
import { LogoutButton } from "@/components/logout-button";
import { SearchFilters } from "@/components/search-filters";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function pickValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function buildFeedback(searchParams: Awaited<SearchParams>) {
  const saved = pickValue(searchParams.saved);
  const error = pickValue(searchParams.error);

  if (error) {
    return {
      tone: "error" as const,
      message: error,
    };
  }

  if (saved) {
    return {
      tone: "success" as const,
      message: `Registro ${saved} correctamente.`,
    };
  }

  return null;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await requireUser();
  const resolvedSearchParams = await searchParams;
  const query = pickValue(resolvedSearchParams.q) ?? "";
  const category = pickValue(resolvedSearchParams.category) ?? "";
  const status = pickValue(resolvedSearchParams.status) ?? "ACTIVE";
  const edit = pickValue(resolvedSearchParams.edit);
  const feedback = buildFeedback(resolvedSearchParams);

  const where = buildContactWhere(query, category, status);

  const [contacts, users, activeCount, deletedCount, historyCount, editingContact] = await Promise.all([
    prisma.contact.findMany({
      where,
      include: {
        reporter: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: [{ deletedAt: "asc" }, { updatedAt: "desc" }],
    }),
    prisma.user.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
      },
      orderBy: {
        fullName: "asc",
      },
    }),
    prisma.contact.count({
      where: {
        deletedAt: null,
      },
    }),
    prisma.contact.count({
      where: {
        deletedAt: {
          not: null,
        },
      },
    }),
    prisma.auditLog.count(),
    edit
      ? prisma.contact.findUnique({
          where: {
            id: edit,
          },
        })
      : Promise.resolve(null),
  ]);

  return (
    <main className="shell py-6 md:py-10">
      <section className="grid gap-6 rounded-[2rem] border border-white/60 bg-[color:var(--background-strong)]/75 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-teal-700">Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              Mantenedor de contactos
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
              Gestiona telefonos, WhatsApp, categorias sensibles y observaciones. Cada cambio queda
              registrado en el historial para auditoria.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/dashboard/history"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Ver historial
            </a>
            <LogoutButton />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <article className="glass rounded-[1.75rem] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-teal-700">Sesion</p>
            <p className="mt-3 text-lg font-semibold text-slate-900">{user.name ?? user.email}</p>
            <p className="mt-1 text-sm text-slate-500">{user.email}</p>
          </article>
          <article className="glass rounded-[1.75rem] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-teal-700">Activos</p>
            <p className="mt-3 text-4xl font-semibold text-slate-900">{activeCount}</p>
          </article>
          <article className="glass rounded-[1.75rem] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-orange-700">Papelera</p>
            <p className="mt-3 text-4xl font-semibold text-slate-900">{deletedCount}</p>
          </article>
          <article className="glass rounded-[1.75rem] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">Eventos</p>
            <p className="mt-3 text-4xl font-semibold text-slate-900">{historyCount}</p>
          </article>
        </div>

        {feedback ? (
          <div
            className={
              feedback.tone === "error"
                ? "rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
                : "rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800"
            }
          >
            {feedback.message}
          </div>
        ) : null}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-6">
          <ContactForm currentUserId={user.id} editingContact={editingContact} users={users} />
          <SearchFilters category={category} query={query} status={status} />
        </div>
        <ContactTable contacts={contacts} />
      </section>
    </main>
  );
}
