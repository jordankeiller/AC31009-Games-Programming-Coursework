// Import relevant libraries
import React, { useState, useEffect } from "react";
import { MDBProgress } from "mdbreact";

// Import relevant components // Decoupling Pattern: Component
import BrowserSocket from "../BrowserSocket";
import WPM from "./WPM";

// Function is used for calculating the players progress on typing through the paragraph shown to them on screen.
// The value that is returned will be used to populate the MDB Progress bar.
const calcProgress = (player, word_length) => {
  if (player.playerWordPosition !== 0) {
    return ((player.playerWordPosition / word_length) * 100).toFixed(2);
  }
  return 0;
};

// Function is used to display whether a player is ready or not, which updates for all players in the game.
const checkReadyStatus = (player, readyStatus) => {
  // If the readyStatus is false (i.e. the game is still in the waiting lobby stage) then the ready statuses can be shown.
  if (!readyStatus) {
    // If the player is ready
    if (player.playerReady) {
      // Display that they are ready
      return <span style={{ color: "green" }}>Ready</span>;
    } else {
      // Otherwise display that they are not ready.
      return <span style={{ color: "red" }}>Not Ready</span>;
    }
  }
};

// Main function for the progress
const Progress = ({ player, gamePlayers, word_length }) => {
  // Default player status to false.
  const [playerReadyStatus, setPlayerReadyStatus] = useState({
    readyStatus: false,
  });

  // Assigning the function for calculating the players progress to a useable variable
  const progress = calcProgress(player, word_length);

  // useEffect is used since it will only run the code within it once.
  // When receiving "startGame" from the server, the ready status will then be populated with the status that the server sends.
  useEffect(() => {
    BrowserSocket.on("startGame", (readyStatus) => {
      setPlayerReadyStatus(readyStatus);
    });
  }, []);

  // Assign the status that the server sends to a variable.
  const { readyStatus } = playerReadyStatus;

  return (
    <div>
      {
        <>
          <h5 className="float-left playerName">
            {/* On the players screen, their own player name will display a (you) next ot it. */}
            <b>
              {player.playerName} (you) {checkReadyStatus(player, readyStatus)}
            </b>
          </h5>
          <h5 className="float-right text-white">
            {/* Component is used for displaying the WPM of the player after the game has finished. */}
            <WPM player={player} />
          </h5>

          <br />
          <br />
          <div key={player._id}>
            {/* Progress bar is displayed, using the value from the calculating function */}
            <MDBProgress color="secondary" value={progress} />
          </div>
        </>
      }
      {gamePlayers.map((object) => {
        const progress = calcProgress(object, word_length);

        return object._id !== player._id ? (
          <>
            <br />
            <h5 className="float-left playerName">
              {/* Other players that are in the waiting lobby will be displayed without a (you) next to their player name */}
              {object.playerName} {checkReadyStatus(object, readyStatus)}
            </h5>
            <h5 className="float-right text-white">
              {/* Component is used for displaying the WPM of the player after the game has finished. */}
              <WPM player={object} />
            </h5>

            <br />
            <br />
            <div key={object._id}>
              {/* Progress bar is displayed, using the value from the calculating function */}
              <MDBProgress color="secondary" value={progress} />
            </div>
          </>
        ) : null;
      })}
    </div>
  );
};

export default Progress;
