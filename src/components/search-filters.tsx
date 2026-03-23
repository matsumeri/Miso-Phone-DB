import { CATEGORY_OPTIONS, STATUS_OPTIONS } from "@/lib/constants";

type SearchFiltersProps = {
  category?: string;
  query?: string;
  status?: string;
};

export function SearchFilters({ category, query, status }: SearchFiltersProps) {
  return (
    <section className="glass rounded-[2rem] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-teal-700">Buscador</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Filtrar registros</h2>
        </div>
        <a
          href="/dashboard"
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-teal-700 hover:text-teal-800"
        >
          Limpiar
        </a>
      </div>

      <form className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.7fr_0.7fr_auto]">
        <input
          name="q"
          defaultValue={query}
          placeholder="Buscar por nombre, nick, telefono, WhatsApp, nacionalidad, localidad o usuario"
          className="rounded-2xl border border-[color:var(--border)] bg-white/90 px-4 py-3 outline-none transition focus:border-teal-700"
        />

        <select
          name="category"
          defaultValue={category ?? ""}
          className="rounded-2xl border border-[color:var(--border)] bg-white/90 px-4 py-3 outline-none transition focus:border-teal-700"
        >
          <option value="">Todas las categorias</option>
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          name="status"
          defaultValue={status ?? "ACTIVE"}
          className="rounded-2xl border border-[color:var(--border)] bg-white/90 px-4 py-3 outline-none transition focus:border-teal-700"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Buscar
        </button>
      </form>
    </section>
  );
}
