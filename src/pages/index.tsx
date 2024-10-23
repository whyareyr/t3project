import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  const { data: sessionData, status } = useSession();

  return (
    <>
      <Head>
        <title>Welcome to YR App</title>
        <meta
          name="description"
          content="A modern application built with T3 stack."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#3b1a6f] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          {status === "loading" ? (
            <p className="text-2xl text-white">Loading...</p>
          ) : sessionData ? (
            <>
              <h1 className="text-6xl font-extrabold tracking-tight text-white">
                Welcome to{" "}
                <span className="text-[#b63c8f]">Yoosha Raza&apos;s </span>
                App
              </h1>
              <div className="flex justify-center">
                <iframe
                  src="https://giphy.com/embed/XD9o33QG9BoMis7iM4"
                  width="580"
                  height="360"
                  style={{ border: "none" }}
                  allowFullScreen
                  title="Brooklyn Nine-Nine GIF"
                ></iframe>
              </div>

              <div className="flex flex-col items-center gap-4">
                <AuthShowcase />
              </div>
            </>
          ) : (
            <div>
              <h1 className="text-6xl font-extrabold tracking-tight text-white">
                Hello, please sign in or sign up
              </h1>
              <AuthShowcase />
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {sessionData ? (
        <p className="text-center text-2xl text-white">
          You are logged in as {sessionData.user?.email}
        </p>
      ) : (
        <p className="text-center text-2xl text-white">You are not logged in</p>
      )}
      <div className="flex gap-4">
        {!sessionData ? (
          <>
            <Link href="/auth/signin">
              <button className="rounded-full bg-[#b63c8f] px-10 py-3 font-semibold text-white transition hover:bg-[#a02a6e]">
                Sign in
              </button>
            </Link>
            <Link href="/auth/signup">
              <button className="rounded-full border border-[#b63c8f] bg-transparent px-10 py-3 font-semibold text-white transition hover:bg-[#b63c8f] hover:text-white">
                Sign up
              </button>
            </Link>
          </>
        ) : (
          <button
            className="rounded-full bg-red-600 px-10 py-3 font-semibold text-white transition hover:bg-red-700"
            onClick={() => signOut()}
          >
            Sign out
          </button>
        )}
      </div>
    </div>
  );
}
