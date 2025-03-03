// app/createQuiz/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { useQuiz } from '../providers';



export default function CreateQuiz() {
  // Authentication session check
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [isLoading, setIsLoading] = useState(false);

  
  const { setQuizData } = useQuiz();
  const [artists, setArtists] = useState<string[]>(['']);
  const [nbrQuestions, setNbrQuestions] = useState<number>(10);

  console.log("Inside Create Quiz, expires at: " + session?.expiresAt);
  

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Handle artist input changes
  const handleArtistChange = (value: string, index: number) => {
    const newArtists = [...artists];
    newArtists[index] = value;
    setArtists(newArtists);
    if (value !== '' && index === artists.length - 1) {
      setArtists(prev => [...prev, '']);
    }
  };

  // Generate quiz by calling the API route
  const generateQuiz = async () => {
    const artistsToSend = artists.filter(artist => artist.trim() !== '');
    if (artistsToSend.length === 0) {
      alert('Please enter at least one artist.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/gpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artists: artistsToSend,
          nbrQuestions: Number(nbrQuestions)
        })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Quiz generated:', data);

      // Sets the response with setQuizData context and then navigate to playQuiz
      setQuizData(data);
      router.push('/playQuiz')

    } catch (error: any) {
      console.error('Error generating quiz:', error);
      alert(`Error generating quiz: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
    <div className='flex items-center justify-center'>
      <h1 className='mb-6 mt-6'>Prepare for your quiz, take a sip, it's loading...</h1>
      <span className="loading loading-ring loading-xs"></span>
      <span className="loading loading-ring loading-sm"></span>
      <span className="loading loading-ring loading-md"></span>
      <span className="loading loading-ring loading-lg"></span>
    </div>
)
  }

  return (
    <div className="flex flex-col text-white text-center items-center">
      <div className="mx-auto p-4">
        <h1 className="text-2xl font-bold mb-2">Welcome, {session?.user?.name || email}
        </h1>
        {session?.user?.image && (
          <div className='flex justify-center'>
         <Image
          src={session.user.image} 
          width={80}
          height={80}
          className="rounded-full mb-6"
          alt="User's profile picture" 
          />
          </div>
        )}
        {/* Artist input fields */}
        <div className="mb-4">
          {artists.map((artist, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Artist ${index + 1}`}
              value={artist}
              onChange={(e) => handleArtistChange(e.target.value, index)}
              className="w-full p-2 mb-2 rounded border border-gray-300 text-black"
            />
          ))}
        </div>
        {/* Dropdown to select number of questions */}
        <div className="mb-6">
          <label className="block font-semibold mb-3">Select number of questions:</label>
          <select
            value={nbrQuestions}
            onChange={(e) => setNbrQuestions(Number(e.target.value))}
            className="p-2 rounded border border-gray-300 text-black"
          >
            {Array.from({ length: 16 }, (_, i) => i + 1).map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
        {/* Button to create the quiz */}
        <div>
          <button
            onClick={generateQuiz}
            // DaisyUI trick: "btn btn-primary loading" to show a spinner on the button
            className={`btn btn-primary ${isLoading ? 'loading-md' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Create Quiz'}
          </button>
        </div>
        {/* Sign out button */}
        <div className="mt-4">
          <button onClick={() => signOut()} className="btn btn-secondary">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
