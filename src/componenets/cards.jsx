import React, { useEffect, useState } from "react";
import axios from "axios";
import ScoreBoard from "./scoreBoard";

function Cards() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animeLogo, setAnimeLogo] = useState("");
  const [score, setScore] = useState(0);
  const [clickedCharacters, setClickedCharacters] = useState(new Set());
  const [congratMessage, setCongratMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const animeNames = [
    "Scissor Seven",
    "Boku no Hero 7",
    "Boku no Hero Academia 4",
    "Attack on Titan",
    "Naruto Shippuden",
    "One Piece",
    'One Piece (Manga)',
    "Hunter x Hunter",
    'Kimetsu no Yaiba',
    'Attack on titan 3',
    'Jujutsu Kaisen',
    'JJBA',
    "Dragon Ball Z",
    "Blue Lock",
    'Haikyu!',
    'Cyberpunk Edgerunners',
    'Vinland Saga',
    'Overlord',
    'Kuroko no basket 3',
  ];

  const congratMessages = [
    "Splendid!",
    "Amazing Job!",
    "Fantastic!",
    "Well Done!",
    "You're Awesome!",
    "Great Work!",
    "Superb!",
    "Outstanding!",
  ];

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const [currentAnime, setCurrentAnime] = useState(animeNames[Math.floor(Math.random() * animeNames.length)]);
  const [remainingAnimes, setRemainingAnimes] = useState(shuffleArray([...animeNames]));

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await axios.post("https://graphql.anilist.co", {
          query: `
            query {
              Media(search: "${currentAnime}") {
                title {
                  romaji
                  english
                }
                coverImage {
                  large
                }
                characters(page: 1, perPage: 14) {
                  nodes {
                    id
                    name {
                      full
                    }
                    image {
                      large
                    }
                  }
                }
                bannerImage
              }
            }
          `,
        });

        const charactersData = response.data.data.Media.characters.nodes;
        const logo = response.data.data.Media.bannerImage;

        setCharacters(charactersData);
        setAnimeLogo(logo);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [currentAnime]);

  const handleCardClick = (characterId) => {
    if (clickedCharacters.has(characterId)) {
      setScore(0);
      setClickedCharacters(new Set());
    } else {
      setScore((prevScore) => prevScore + 1);
      setClickedCharacters((prev) => new Set(prev).add(characterId));

      if (score + 1 === 14) {
        const randomMessage = congratMessages[Math.floor(Math.random() * congratMessages.length)];
        setCongratMessage(randomMessage);
        setShowMessage(true);

        setTimeout(() => setShowMessage(false), 3000);

        let updatedAnimes = remainingAnimes.filter(anime => anime !== currentAnime);

        if (updatedAnimes.length === 0) {
          updatedAnimes = shuffleArray([...animeNames]);
        }

        const randomAnime = updatedAnimes[Math.floor(Math.random() * updatedAnimes.length)];
        setCurrentAnime(randomAnime);
        setRemainingAnimes(updatedAnimes);
        setScore(0);
        setClickedCharacters(new Set());
      }
    }

    const shuffledCharacters = [...characters].sort(() => Math.random() - 0.5);
    setCharacters(shuffledCharacters);
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error === 'Network Error' ? 'Too many requests, try again after a minute.' : error}</p>;

  return (
    <div>
      <ScoreBoard score={score} logo={animeLogo} animeName={currentAnime} title={currentAnime} />
      <h2 className="title">{currentAnime.toLocaleUpperCase()}</h2>
      <div className="cards">
        {characters.map((character) => (
          <div
            key={character.id}
            className="card"
            onClick={() => handleCardClick(character.id)}
          >
            <img
              src={character.image.large}
              alt={character.name.full}
              draggable="false"
            />
            <h3>{character.name.full}</h3>
          </div>
        ))}
      </div>
      {showMessage && (
        <div className="congrat-message">
          <p>{congratMessage}</p>
        </div>
      )}
    </div>
  );
}

export default Cards;
