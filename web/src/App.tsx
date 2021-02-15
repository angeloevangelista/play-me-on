import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

import playIcon from "./play-icon.svg";

import "./App.css";

const API_HOST = "http://localhost:3333";

interface IMusic {
  artist: string;
  name: string;
  duration: string;
  cover: string;
  url: string;
}

interface ICatalogResponse {
  amount: number;
  musics: IMusic[];
}

function App() {
  const [musics, setMusics] = useState<IMusic[]>([]);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    axios
      .get<ICatalogResponse>("catalog", {
        baseURL: API_HOST,
      })
      .then((response) => {
        const { musics } = response.data;

        setMusics(musics);
      });
  }, []);

  const handlePlay = useCallback(
    (music: IMusic) => {
      if (audio) {
        audio.src = music.url;

        setAudio(audio);

        audio.play();
        return;
      }

      const newAudio = new Audio(music.url);

      newAudio.play();

      setAudio(newAudio);
    },
    [audio]
  );

  return (
    <>
      {!musics.length ? (
        <h1>Loading</h1>
      ) : (
        <>
          <h1>Choose a music</h1>

          <ul>
            {musics.map((music, index) => (
              <li key={music.name + index}>
                <span>
                  {music.artist} - {music.name}
                </span>

                <img
                  onClick={() => handlePlay(music)}
                  src={playIcon}
                  alt="Play"
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

export default App;
