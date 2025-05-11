// app/createQuiz/CreateQuizClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useQuiz } from '../../providers';

export default function CreateQuizClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const [isLoading, setIsLoading] = useState(false);
  const { setQuizData } = useQuiz();
  const [artists, setArtists] = useState<string[]>(['']);
  const [nbrQuestions, setNbrQuestions] = useState<number>(10);

  // Redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/');
  }, [status, router]);

  const handleArtistChange = (value: string, idx: number) => {
    setArtists(a => {
      const copy = [...a];
      copy[idx] = value;
      if (value && idx === a.length - 1) copy.push('');
      return copy;
    });
  };

  const generateQuiz = async () => {
    const artistsToSend = artists.filter(a => a.trim());
    if (!artistsToSend.length) {
      alert('Please enter at least one artist.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('/api/gpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artists: artistsToSend, nbrQuestions }),
      });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setQuizData(data);
      router.push('/playQuiz');
    } catch (err: unknown) {
        const message =
        err instanceof Error ? err.message : 'Unknown error';
      alert(`Error generating quiz: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center">
        <h1 className="mb-4">Preparing your quiz…</h1>
        <div className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto text-center text-white">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {session?.user?.name ?? email}
      </h1>
      {session?.user?.image && (
        <div className="flex justify-center mb-6">
          <Image
            src={session.user.image}
            width={80}
            height={80}
            className="rounded-full"
            alt="Profile"
          />
        </div>
      )}
      <div className="space-y-2 mb-6">
        {artists.map((artist, i) => (
          <input
            key={i}
            type="text"
            placeholder={`Artist ${i + 1}`}
            value={artist}
            onChange={e => handleArtistChange(e.target.value, i)}
            className="w-full p-2 rounded text-black"
          />
        ))}
      </div>
      <div className="mb-6">
        <label className="block mb-2">Number of questions:</label>
        <select
          value={nbrQuestions}
          onChange={e => setNbrQuestions(+e.target.value)}
          className="w-full p-2 rounded text-black"
        >
          {Array.from({ length: 16 }, (_, i) => i + 1).map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>
      <button
        onClick={generateQuiz}
        className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
        disabled={isLoading}
      >
        {isLoading ? 'Generating…' : 'Create Quiz'}
      </button>
    </div>
  );
}
