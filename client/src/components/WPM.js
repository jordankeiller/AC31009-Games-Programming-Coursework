// Import relevant libraries
import React from "react";

const WPM = ({ player }) => {
  return (
    <>
      {/* Return the players words per minute. */}
      {player.playerWordsPerMinute !== -99 ? (
        <>WPM: {player.playerWordsPerMinute}</>
      ) : null}
    </>
  );
};

export default WPM;
