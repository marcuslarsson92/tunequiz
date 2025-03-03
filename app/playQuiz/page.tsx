// app/playQuiz/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useQuiz } from '../providers';


export default function PlayQuiz() {
  const router = useRouter();
  const { data: session } = useSession(); // We can get Spotify token from session
  const { quizData } = useQuiz();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  // If no quiz data, show an error
  if (!quizData) {
    return <p>No quiz data. Please create a quiz first.</p>;
  }

  const totalQuestions = quizData.questions.length;
  const allQuestionsAnswered = currentQuestionIndex >= totalQuestions;

  useEffect(() => {
    setShowCorrectAnswer(false);
  }, [currentQuestionIndex]);

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) => (prev < totalQuestions ? prev + 1 : prev));
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  // ---- New: Function to search for the artist, get top track, and play it
  async function playArtistTopTrack(artistName: string) {
    if (!session?.accessToken) {
      alert('No Spotify access token found. Please log in.');
      return;
    }
    try {
      // 1) Search for the artist to get the ID
      const searchResp = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );
      const searchData = await searchResp.json();
      console.log("Search data on line 55: " + searchData);
      if (!searchData.artists.items.length) {
        alert(`No artist found for "${artistName}".`);
        return;
      }
      const artistId = searchData.artists.items[0].id;

      // 2) Get top tracks
      const topTracksResp = await fetch(
        `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );
      const topTracksData = await topTracksResp.json();
      if (!topTracksData.tracks.length) {
        alert(`No top tracks found for ${artistName}.`);
        return;
      }
      const topTrackUri = topTracksData.tracks[0].uri; // e.g. "spotify:track:1234abcd..."

      // 3) Play the track
      await fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uris: [topTrackUri] }),
      });
      console.log(`Playing top track for artist: ${artistName}`);
    } catch (err) {
      console.error('Error playing track:', err);
      alert('Failed to play track. Check console for details.');
    }
  }

  // ---- New: Pause playback
  async function pausePlayback() {
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
      console.log('Playback paused');
    } catch (err) {
      console.error('Error pausing playback:', err);
      alert('Failed to pause playback. Check console for details.');
    }
  }

  // Get current question
  let question = null;
  if (!allQuestionsAnswered) {
    question = quizData.questions[currentQuestionIndex];
  }

  return (
    <div className="text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Let's Play!</h1>

      {allQuestionsAnswered ? (
        <div className="p-4 bg-blue-900 rounded">
          <p>{quizData.summary}</p>
        </div>
      ) : question ? (
        <div className="p-4 bg-blue-950 rounded-2xl">
          {/* Show the question */}
          <p className="mb-2">
            {currentQuestionIndex + 1}. {question.questionText}
          </p>
          <ul className="mb-2">
            {question.options.map((option, index) => (
              <li key={index} className="mb-1">
                {option}
              </li>
            ))}
          </ul>

          {showCorrectAnswer ? (
            <p className="font-semibold">
              Correct Answer: {question.correctOption}
            </p>
          ) : (
            <button
              onClick={() => setShowCorrectAnswer(true)}
              className="btn btn-secondary mb-4"
            >
              Show Correct Answer
            </button>
          )}

          {/* NEW: If the question has an artist, show a "Play" and "Pause" button */}
          {question.artist && (
            <div>
              <button
                onClick={() => playArtistTopTrack(question.artist!)}
                className="btn btn-primary mr-2"
              >
                Play {question.artist}'s Top Track
              </button>
              <button onClick={pausePlayback} className="btn btn-secondary">
                Pause
              </button>
            </div>
          )}
        </div>
      ) : null}

      {/* Next/Previous buttons at the bottom */}
      <div className="flex justify-center space-x-4 p-4">
        <button
          onClick={handlePreviousQuestion}
          className="btn btn-secondary"
          disabled={currentQuestionIndex === 0}
        >
          Previous Question
        </button>
        <button
          onClick={handleNextQuestion}
          className="btn btn-secondary"
          disabled={currentQuestionIndex === totalQuestions}
        >
          Next Question
        </button>
      </div>
    </div>
  );
}
