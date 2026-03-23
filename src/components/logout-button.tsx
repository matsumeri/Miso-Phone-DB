import { logoutAction } from "@/app/dashboard/actions";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="rounded-full border border-white/40 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-600 hover:text-teal-800"
      >
        Salir
      </button>
    </form>
  );
}
