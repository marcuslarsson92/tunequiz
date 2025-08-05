// app/playQuiz/page.tsx

import { Suspense } from "react"
import PlayQuizClient from "./PlayQuizClient";

export default function PlayQuizPage() {
  return (
    <main className="flex justify-center p-8">
      <Suspense fallback={
        <div className="text-center">
          <p>Loading quiz...</p>
        </div>
        }>
          <PlayQuizClient />
        </Suspense>
    </main>
  );
}