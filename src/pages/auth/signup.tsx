import { type FormEvent, useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function SignUp() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (session) {
      const redirectToHome = async () => {
        await router.push("/");
      };
      void redirectToHome(); // This is fine as it explicitly ignores the promise
    }
  }, [session, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        setSuccess("Sign-up successful! Please sign in.");
        setError(null);

        // Use an async function to handle the timeout
        const timeoutRedirect = async () => {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          await router.push("/auth/signin"); // Await the navigation
        };
        void timeoutRedirect(); // Explicitly ignore the promise
      } else {
        setError("Error in sign-up. Please try again.");
        setSuccess(null);
      }
    } catch (err) {
      setError("Unexpected error. Please try again.");
      console.error(err); // Log the error for debugging
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up</title>
        <meta name="description" content="Create a new account" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#3b1a6f] to-[#15162c]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-md bg-white p-8 shadow-md"
        >
          <h2 className="text-2xl font-bold">Sign Up</h2>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="border p-2"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="border p-2"
          />
          <button
            type="submit"
            className="rounded-md bg-[#b63c8f] p-2 text-white hover:bg-[#a02a6e]"
          >
            Sign Up
          </button>
          <p className="mt-4">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-blue-500 hover:underline">
              Sign-In here
            </Link>
          </p>
        </form>
      </main>
    </>
  );
}
