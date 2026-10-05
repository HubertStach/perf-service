import Link from "next/link";
import { AuthForm } from "~/app/_components/auth-form";

export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-sm px-6 py-12">
      <h1 className="mb-6 text-2xl font-bold">Załóż konto</h1>
      <AuthForm mode="register" />
      <p className="mt-4 text-sm text-gray-500">
        Masz już konto?{" "}
        <Link href="/login" className="text-indigo-600 hover:underline">
          Zaloguj się
        </Link>
      </p>
    </main>
  );
}
