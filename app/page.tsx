// app/page.tsx
'use client';

import { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();


  // Om användaren redan är inloggad, omdirigera till CreateQuiz-sidan.
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/createQuiz");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center">
        <h1 className="mb-8 mt-8">Loading...</h1>
        <span className="loading loading-infinity loading-xl"></span>
      </div>
    );
  }
  return (
    <>
      <div className="mt-8">
        <button
          onClick={() => signIn("spotify")}
          className="btn btn-primary"
        >
          Login With Spotify
        </button>
      </div>
    </>
  );
}
