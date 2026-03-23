"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import { loginSchema } from "@/lib/validators";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const parsedCredentials = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!parsedCredentials.success) {
      setError(parsedCredentials.error.issues[0]?.message ?? "Credenciales invalidas");
      setIsPending(false);
      return;
    }

    const result = await signIn("credentials", {
      email: parsedCredentials.data.email,
      password: parsedCredentials.data.password,
      redirect: false,
      redirectTo: "/dashboard",
    });

    if (result?.error) {
      setError("Correo o contraseña incorrectos");
      setIsPending(false);
      return;
    }

    router.replace(result?.url ?? "/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="glass grid gap-4 rounded-[2rem] p-6 text-sm text-slate-700">
      <div className="grid gap-1">
        <label htmlFor="email" className="font-medium text-slate-900">
          Correo
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="rounded-2xl border border-[color:var(--border)] bg-white/90 px-4 py-3 outline-none transition focus:border-teal-700"
          placeholder="usuario@dominio.com"
        />
      </div>

      <div className="grid gap-1">
        <label htmlFor="password" className="font-medium text-slate-900">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
          className="rounded-2xl border border-[color:var(--border)] bg-white/90 px-4 py-3 outline-none transition focus:border-teal-700"
          placeholder="Minimo 8 caracteres"
        />
      </div>

      {error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-teal-700 px-5 py-3 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Validando..." : "Entrar"}
      </button>
    </form>
  );
}
