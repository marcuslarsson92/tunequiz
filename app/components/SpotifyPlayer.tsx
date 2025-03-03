// app/Components/SpotifyPlayer.tsx
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

declare global {
  interface Window {
    Spotify: any;
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

interface SpotifyPlayerProps {
  // You can pass additional props if needed
}

export default function SpotifyPlayer(props: SpotifyPlayerProps) {
  const { data: session } = useSession();
  const [player, setPlayer] = useState<any>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    if (!session?.accessToken) return;

    console.log('Spotify Access Token:', session.accessToken);

    // Dynamically load the Spotify Web Playback SDK
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);
    
    // Initializes the Spotify Web Playback SDK and sets up a player instance when the SDK is ready
    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = session.accessToken!;
      const spotifyPlayer = new window.Spotify.Player({
        name: 'Hi you from TuneQuiz',
        getOAuthToken: (cb: (token: string) => void) => { cb(token); },
        volume: 0.3,
      });

      setPlayer(spotifyPlayer);

      // Event listeners
      spotifyPlayer.addListener('initialization_error', ({ message }: { message: string }) => console.error(message));
      spotifyPlayer.addListener('authentication_error', ({ message }: { message: string }) => console.error(message));
      spotifyPlayer.addListener('account_error', ({ message }: { message: string }) => console.error(message));
      spotifyPlayer.addListener('playback_error', ({ message }: { message: string }) => console.error(message));

      spotifyPlayer.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log('Ready with Device ID', device_id);
        setDeviceId(device_id);
      });

      spotifyPlayer.addListener('player_state_changed', (state: any) => {
        if (state) setIsPaused(state.paused);
      });

      spotifyPlayer.connect();
    };

    // Cleanup the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, [session]);

  const handlePlayPause = async () => {
    if (!player) return;
    if (isPaused) {
      await player.resume();
    } else {
      await player.pause();
    }
  };

  return (
    <div className="mt-4">
      <button onClick={handlePlayPause} className="btn btn-primary">
        {isPaused ? 'Play' : 'Pause'}
      </button>
    </div>
  );
}
