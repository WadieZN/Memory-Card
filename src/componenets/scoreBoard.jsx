import React from "react";

function ScoreBoard({ score, logo }) { 
  return (
    <div className="score-board">
      {logo && <img src={logo} alt="Anime Logo" className="banner" />}
      <h2 className="score">
        Score: <span style={score === 0 ? { color: 'red' } : { color: '#0099ff' }}>{score}</span>/14
      </h2>
    </div>
  );
}

export default ScoreBoard;
