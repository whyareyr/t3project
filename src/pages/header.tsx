import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession(); // Access session data

  return (
    <header className="flex items-center justify-between bg-gradient-to-r from-[#3b1a6f] to-[#15162c] p-4 text-white">
      <div className="text-2xl font-bold">
        <Link href="/">MyApp</Link>
      </div>
      <nav>
        {session ? (
          // If logged in, show user's email and logout button
          <div className="flex items-center gap-4">
            <span>Welcome, {session.user?.email}</span>
            <button
              onClick={() => signOut()}
              className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          // If not logged in, show sign-in and sign-up links
          <div className="flex items-center gap-4">
            <Link href="/auth/signin">
              <button className="rounded bg-[#b63c8f] px-4 py-2 text-white hover:bg-[#ff71d2]">
                Sign In
              </button>
            </Link>
            <Link href="/auth/signup">
              <button className="rounded bg-[#b63c8f] px-4 py-2 text-white hover:bg-[#ff71d2]">
                Sign Up
              </button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
