import { auth } from "@/auth";
import { LoginForm } from "@/components/login-form";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="grid min-h-screen grid-cols-1 bg-[color:var(--background)] px-4 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
      <section className="grid-bg shell flex flex-col justify-between rounded-[2rem] border border-white/60 bg-[color:var(--background-strong)]/80 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)] lg:p-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-teal-800">PWA instalable</p>
            <h1 className="mt-3 max-w-xl text-4xl font-semibold tracking-tight text-slate-900 lg:text-6xl">
              Miso Phone DB
            </h1>
          </div>
          <div className="rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-teal-800">
            3 usuarios
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-6 text-slate-700">
            <p className="max-w-2xl text-lg leading-8 text-balance">
              Registra contactos, clasificalos por categoria, conserva historial de cambios y mantén un
              control centralizado de numeros telefonicos y WhatsApp desde una app web instalable en el
              movil.
            </p>
            <div className="grid gap-3 text-sm lg:grid-cols-2">
              <div className="glass rounded-[1.5rem] p-4">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-teal-700">Incluye</p>
                <p className="mt-2 text-base font-medium text-slate-900">CRUD, soft delete y buscador global</p>
              </div>
              <div className="glass rounded-[1.5rem] p-4">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-teal-700">Auditoria</p>
                <p className="mt-2 text-base font-medium text-slate-900">Historial de altas, ediciones, borrados y login</p>
              </div>
            </div>
          </div>

          <div className="glass rounded-[2rem] p-6">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-teal-700">Acceso restringido</p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Solo pueden ingresar los tres usuarios sembrados en la base de datos. Railway es un buen fit
              para alojar la app y PostgreSQL sin operar infraestructura adicional.
            </p>
          </div>
        </div>
      </section>

      <section className="shell flex items-center justify-center py-10 lg:py-0">
        <div className="w-full max-w-md space-y-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">Ingreso</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Dashboard de contactos</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              El acceso se valida contra la base de datos. Si necesitas cambiar usuarios, actualiza el seed
              o gestionalos directamente desde PostgreSQL.
            </p>
          </div>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
