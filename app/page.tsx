"use client";

import { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Footer from "./components/Footer";

// If the user is already authenticated, we redirect them to /createQuiz
export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/createQuiz");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center">
        <h1 className="mb-6 mt-6">Loading...</h1>
        <span className="loading loading-infinity loading-xl"></span>
      </div>
    );
  }

  // If user is not logged in, show the login button
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-center mt-6">
      <button onClick={() => signIn("spotify")} className="btn btn-primary">
        Login With Spotify
      </button>
        
      </div>
      <Footer />
    </div>
  );
}
