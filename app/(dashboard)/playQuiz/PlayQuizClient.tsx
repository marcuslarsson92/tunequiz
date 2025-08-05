// app/(dashboard)/playQuiz/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useQuiz } from '../../providers';

interface SpotifyDevice {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number;
}

interface SpotifyDevicesResponse {
  devices: SpotifyDevice[];
}

interface SpotifyArtist {
  id: string;
  name: string;
}

interface SpotifyTrack {
  id: string;
  name: string;
  uri: string;
  artists: SpotifyArtist[];
}

interface SpotifySearchResponse {
  artists?: {
    items: SpotifyArtist[];
  };
}

interface SpotifyTopTracksResponse {
  tracks: SpotifyTrack[];
}

// interface Question {
//   questionText: string;
//   options: string[];
//   correctOption: string;
//   artist?: string;
// }

export default function PlayQuizClient() {
  const router = useRouter();
  const { data: session } = useSession();
  const { quizData } = useQuiz();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeDevice, setActiveDevice] = useState('');
  const [currentTrack, setCurrentTrack] = useState('');

  // Get active Spotify unit
  const getActiveDevice = useCallback(async () => {
    if (!session?.accessToken) return;

    try {
      const res = await fetch('https://api.spotify.com/v1/me/player/devices', {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
      const data = (await res.json()) as SpotifyDevicesResponse;
      const active =
        data.devices.find(d => d.is_active) || data.devices[0];
      setActiveDevice(active ? active.name : 'No active device');
    } catch (err: unknown) {
      console.error('Error getting devices:', err);
      setActiveDevice('Unable to detect device');
    }
  }, [session?.accessToken]);

  // Reset transparancy of correct answer when new question
  useEffect(() => {
    setShowCorrectAnswer(false);
  }, [currentQuestionIndex]);

  // Do once when session-token is available
  useEffect(() => {
    getActiveDevice();
  }, [getActiveDevice]);

  if (!quizData) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-950">
        <div className="text-center p-8 bg-blue-900 rounded-xl shadow-lg border border-blue-800">
          <h2 className="text-xl font-bold text-white mb-4">
            No Quiz Data Available
          </h2>
          <p className="text-blue-200 mb-6">
            Please create a quiz first before attempting to play.
          </p>
          <button
            onClick={() => router.push('/createQuiz')}
            className="px-6 py-3 bg-blue-700 hover:bg-blue-600 transition-colors rounded-lg font-medium text-white"
          >
            Create a Quiz
          </button>
        </div>
      </div>
    );
  }

  const totalQuestions = quizData.questions.length;
  const allQuestionsAnswered = currentQuestionIndex >= totalQuestions;
  const question = !allQuestionsAnswered
    ? quizData.questions[currentQuestionIndex]
    : null;

  const playArtistTopTrack = async (artistName: string) => {
    if (!session?.accessToken) {
      alert('No Spotify access token found. Please log in.');
      return;
    }

    try {
      await getActiveDevice();

      const searchRes = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          artistName
        )}&type=artist&limit=1`,
        {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        }
      );
      const searchData = (await searchRes.json()) as SpotifySearchResponse;
      const artistId = searchData.artists?.items[0]?.id;
      if (!artistId) {
        alert(`No artist found for "${artistName}".`);
        return;
      }

      const topRes = await fetch(
        `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,
        {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        }
      );
      const topData = (await topRes.json()) as SpotifyTopTracksResponse;
      const track = topData.tracks[0];
      if (!track) {
        alert(`No top tracks for ${artistName}.`);
        return;
      }

      await fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uris: [track.uri] }),
      });

      setIsPlaying(true);
      setCurrentTrack(track.name);
    } catch (err: unknown) {
      console.error('Error playing track:', err);
      alert('Failed to play track. Check console for details.');
    }
  };

  const pausePlayback = async () => {
    if (!session?.accessToken) {
      alert('No Spotify access token found.');
      return;
    }
    try {
      await fetch('https://api.spotify.com/v1/me/player/pause', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      setIsPlaying(false);
    } catch (err: unknown) {
      console.error('Error pausing playback:', err);
      alert('Failed to pause playback. Check console for details.');
    }
  };

  const handleNext = () =>
    setCurrentQuestionIndex(i =>
      i < totalQuestions ? i + 1 : i
    );
  const handlePrev = () =>
    setCurrentQuestionIndex(i =>
      i > 0 ? i - 1 : i
    );

  return (
    <div className="text-white p-4 max-w-4xl mx-auto min-h-screen flex flex-col">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-200">
        Let&apos;s Play!
      </h1>

      {allQuestionsAnswered ? (
        <div className="p-6 bg-gradient-to-b from-blue-900 to-blue-950 rounded-xl shadow-lg border border-blue-800 animate-fadeIn">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Quiz Completed!
          </h2>
          <p className="text-lg leading-relaxed">
            {quizData.summary}
          </p>
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setCurrentQuestionIndex(0)}
              className="px-6 py-3 bg-blue-700 hover:bg-blue-600 transition-colors rounded-lg font-medium"
            >
              Play Again
            </button>
          </div>
        </div>
      ) : question ? (
        <div className="flex-1 flex flex-col">
          <div className="p-6 bg-gradient-to-b from-blue-950 to-blue-900 rounded-xl shadow-lg border border-blue-800 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold text-blue-300">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <span className="bg-blue-800 px-3 py-1 rounded-full text-sm">
                {Math.round(
                  ((currentQuestionIndex + 1) / totalQuestions) * 100
                )}
                %
              </span>
            </div>

            <h2 className="text-xl font-bold mb-6 text-white">
              {question.questionText}
            </h2>

            <ul className="mb-6 space-y-3">
              {question.options.map((opt, i) => (
                <li
                  key={i}
                  className="p-3 bg-blue-900 hover:bg-blue-800 transition-colors rounded-lg border border-blue-700 cursor-pointer"
                >
                  <span className="inline-flex items-center">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-800 flex items-center justify-center mr-3 text-sm">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </span>
                </li>
              ))}
            </ul>

            {showCorrectAnswer ? (
              <div className="p-4 bg-green-900 rounded-lg border border-green-700 animate-fadeIn">
                <p className="font-semibold text-green-300">
                  <span className="mr-2">✓</span>
                  Correct Answer: {question.correctOption}
                </p>
              </div>
            ) : (
              <button
                onClick={() => setShowCorrectAnswer(true)}
                className="w-full py-3 bg-blue-700 hover:bg-blue-600 transition-colors rounded-lg font-medium"
              >
                Show Correct Answer
              </button>
            )}

            {question.artist && (
              <div className="mt-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() =>
                      playArtistTopTrack(question.artist!)
                    }
                    className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-500 transition-colors rounded-lg font-medium flex items-center justify-center"
                  >
                    <span className="mr-2">🎵</span>
                    Play {question.artist}&apos;s Top Track
                  </button>
                  <button
                    onClick={pausePlayback}
                    className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 transition-colors rounded-lg font-medium"
                  >
                    <span className="mr-2">⏸️</span>
                    Pause
                  </button>
                </div>

                <div className="mt-3 text-sm text-blue-300 flex items-center justify-center">
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      isPlaying
                        ? 'bg-green-500 animate-pulse'
                        : 'bg-gray-500'
                    }`}
                  ></div>
                  {isPlaying
                    ? `Now playing: "${currentTrack}" by ${question.artist} on ${activeDevice}`
                    : `Ready to play music on ${activeDevice || 'your Spotify device'}`}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between mt-6 px-2">
            <button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className={`px-5 py-2 rounded-lg font-medium flex items-center ${
                currentQuestionIndex === 0
                  ? 'bg-blue-900 text-blue-500 cursor-not-allowed'
                  : 'bg-blue-800 hover:bg-blue-700 text-white transition-colors'
              }`}
            >
              <span className="mr-2">←</span> Previous
            </button>

            <button
              onClick={handleNext}
              disabled={currentQuestionIndex === totalQuestions}
              className={`px-5 py-2 rounded-lg font-medium flex items-center ${
                currentQuestionIndex === totalQuestions
                  ? 'bg-blue-900 text-blue-500 cursor-not-allowed'
                  : 'bg-blue-800 hover:bg-blue-700 text-white transition-colors'
              }`}
            >
              {currentQuestionIndex === totalQuestions - 1
                ? 'Finish'
                : 'Next'}{' '}
              <span className="ml-2">→</span>
            </button>
          </div>
        </div>
      ) : null}

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
