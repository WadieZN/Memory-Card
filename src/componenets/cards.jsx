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

  const animeNames = [
    "Scissor Seven",
    "Boku no Hero Academia 7",
    "Attack on Titan",
    "Naruto Shippuden",
    "One Piece",
    "Hunter x Hunter",
    "Nanatsu no Taizai",
    "Kimetsu no Yaiba",
    "Jujutsu Kaisen",
    "JJBA",
    "Dragon Ball Z",
  ];

  const [currentAnime, setCurrentAnime] = useState("Kimetsu No Yaiba");
  const [remainingAnimes, setRemainingAnimes] = useState(animeNames); 

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

  const handleImageClick = (characterId) => {
    if (clickedCharacters.has(characterId)) {
      setScore(0);
      setClickedCharacters(new Set());
    } else {
      setScore((prevScore) => prevScore + 1);
      setClickedCharacters((prev) => new Set(prev).add(characterId));

      if (score + 1 === 14) {
        let updatedAnimes = remainingAnimes.filter(anime => anime !== currentAnime);

        if (updatedAnimes.length === 0) {
          updatedAnimes = [...animeNames];
        }

        const randomAnime = updatedAnimes[Math.floor(Math.random() * updatedAnimes.length)];
        setCurrentAnime(randomAnime);
        setRemainingAnimes(updatedAnimes);
        setScore(0);
      }
    }

    const shuffledCharacters = [...characters].sort(() => Math.random() - 0.5);
    setCharacters(shuffledCharacters);
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <ScoreBoard score={score} logo={animeLogo} animeName={currentAnime} title={currentAnime} />
      <h2 className="title">{currentAnime.toLocaleUpperCase()}</h2>
      <div className="cards">
        {characters.map((character) => (
          <div key={character.id} className="card">
            <img
              src={character.image.large}
              alt={character.name.full}
              onClick={() => handleImageClick(character.id)}
              draggable="false"
            />
            <h3>{character.name.full}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cards;
