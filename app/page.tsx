// app/page.tsx
'use client';

import { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "./components/Header";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  console.log("Status from useSession: " + session);

  // Om användaren redan är inloggad, omdirigera till CreateQuiz-sidan.
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/createQuiz");
    }
  }, [status, router]);

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
