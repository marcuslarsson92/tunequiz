// app/components/SpotifyPlayer.tsx
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function SpotifyPlayer() {
  const { data: session } = useSession();
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    const token = session?.accessToken;
    if (!token) return;

    // Load Spotify SDK
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: 'TuneQuiz Player',
        getOAuthToken: (cb: (t: string) => void) => cb(token),
        volume: 0.3,
      });

      setPlayer(spotifyPlayer);

      spotifyPlayer.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log('Ready with Device ID', device_id);
      });

      spotifyPlayer.addListener(
        'player_state_changed',
        (state: Spotify.PlaybackState | null) => {
          if (state) setIsPaused(state.paused);
        }
      );

      // (Add your error listeners back here if you like)

      spotifyPlayer.connect();
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [session]);

  const handlePlayPause = async () => {
    if (!player) return;
    if (isPaused) await player.resume();
    else await player.pause();
  };

  return (
    <div className="mt-4">
      <button onClick={handlePlayPause} className="btn btn-primary">
        {isPaused ? 'Play' : 'Pause'}
      </button>
    </div>
  );
}
