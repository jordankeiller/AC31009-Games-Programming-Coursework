// This code/logic was copied and has been referenced [ref 7] in my report.

import React from "react";

import "../assets/css/main.css";

const words_typed = (gameParagraph, player) => {
  let typed_words = gameParagraph.slice(0, player.playerWordPosition);
  typed_words = typed_words.join(" ");

  return <span className="correct">{typed_words} </span>;
};

const current_word = (gameParagraph, player) => {
  return player.playerCorrectWord ? (
    <span className="current_word">
      {gameParagraph[player.playerWordPosition]}
    </span>
  ) : (
    <span className="incorrect">
      {gameParagraph[player.playerWordPosition]}
    </span>
  );
};

const words_left = (gameParagraph, player) => {
  let words_left_to_type = gameParagraph.slice(
    player.playerWordPosition + 1,
    gameParagraph.length
  );

  words_left_to_type = words_left_to_type.join(" ");

  return <span> {words_left_to_type}</span>;
};

const Paragraph = ({ gameParagraph, player }) => {
  return (
    <>
      {words_typed(gameParagraph, player)}
      {current_word(gameParagraph, player)}
      {words_left(gameParagraph, player)}
    </>
  );
};

export default Paragraph;
