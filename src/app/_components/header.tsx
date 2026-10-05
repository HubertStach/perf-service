import Link from "next/link";
import { getCurrentUser } from "~/lib/auth";
import { LogoutButton } from "~/app/_components/logout-button";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="flex items-center justify-between border-b bg-white px-6 py-4 shadow-sm">
      <Link href="/" className="text-xl font-bold text-indigo-600">
        Perf Shop
      </Link>
      <nav className="flex items-center gap-4 text-sm">
        <Link href="/cart" className="hover:text-indigo-600">
          Koszyk
        </Link>
        {user ? (
          <>
            <span className="text-gray-500">{user.email}</span>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link href="/login" className="hover:text-indigo-600">
              Zaloguj
            </Link>
            <Link href="/register" className="hover:text-indigo-600">
              Zarejestruj
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
