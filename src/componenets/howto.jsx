import React, { useState, useEffect, useRef } from "react";

function HowTo() {
  const [showInstructions, setShowInstructions] = useState(false);
  const instructionsRef = useRef(null);
  const buttonRef = useRef(null);

  const handleToggleInstructions = (event) => {
    event.stopPropagation(); 
    setShowInstructions(prevState => !prevState);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        instructionsRef.current &&
        !instructionsRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowInstructions(false);
      }
    };

    if (showInstructions) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showInstructions]);

  return (
    <div className="howTo">
      <button onClick={handleToggleInstructions} ref={buttonRef}>?</button>

      <div
        className={`instructions ${showInstructions ? "show" : ""}`}
        ref={instructionsRef}
      >
        <ul>
          <li>Don't click on the same card twice</li>
          <li>Clicking a card will shuffle all the cards</li>
          <li>You win by reaching a score of 14</li>
          <li>After winning, new anime characters will display and you'll start a new round</li>
          <li className="light">Developed by WadyZen</li>
        </ul>
      </div>
    </div>
  );
}

export default HowTo;
