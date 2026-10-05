import Link from "next/link";
import { AuthForm } from "~/app/_components/auth-form";

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-sm px-6 py-12">
      <h1 className="mb-6 text-2xl font-bold">Zaloguj się</h1>
      <AuthForm mode="login" />
      <p className="mt-4 text-sm text-gray-500">
        Nie masz konta?{" "}
        <Link href="/register" className="text-indigo-600 hover:underline">
          Zarejestruj się
        </Link>
      </p>
    </main>
  );
}
