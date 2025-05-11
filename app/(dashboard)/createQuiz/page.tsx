// app/createQuiz/page.tsx
import { Suspense } from 'react';
import CreateQuizClient from './CreateQuizClient';

export default function CreateQuizPage() {
  return (
    <main className="flex justify-center p-8">
      <Suspense fallback={
        <div className="text-center">
          <p>Loading quiz builder…</p>
        </div>
      }>
        <CreateQuizClient />
      </Suspense>
    </main>
  );
}
