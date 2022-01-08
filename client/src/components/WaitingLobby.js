// Import relevant libraries
import React from "react";
import { MDBBtn } from "mdbreact";

// Import relevant components // Decoupling Pattern: Component
import BrowserSocket from "../BrowserSocket";

// Main waiting lobby function
const WaitingLobby = ({ player, matchID, gameOpen }) => {
  // Pull whether the player is the host of the game and if they are ready using the variables that are passed in from the server
  const { playerHost, playerReady } = player;

  // Function that will start the game when run
  const startGame = () => {
    BrowserSocket.emit("startGame", { playerID: player._id, matchID });
  };

  // Function that will change the players ready status from "unready" to "ready". This function emits the change to the server side for processing.
  const ready_up = () => {
    BrowserSocket.emit("readyUp", { matchID });
  };

  // Function that will change the players ready status from "ready" to "unready". This function emits the change to the server side for processing.
  const unready_up = () => {
    BrowserSocket.emit("unready", { matchID });
  };

  // If the player is the host of the game
  return playerHost ? (
    <>
      {/* AND if the game state is showing the game as being open to new players joining */}
      {gameOpen ? (
        // Show the start game button to the host only
        <MDBBtn color="light-blue" onClick={startGame}>
          Start Game
        </MDBBtn>
      ) : // Otherwise if the player is not the host of the game, but the game state is showing the game as open - just return null (i.e. do not show non-hosts the start game button)
      null}

      {/* AND if the game state is showing the game as being open to new players joining */}
      {gameOpen ? (
        // If the players ready status is showing as false, show the ready up button that when clicked will be processed on the server side using the function above.
        !playerReady ? (
          <MDBBtn color="danger" onClick={ready_up}>
            Ready Up
          </MDBBtn>
        ) : (
          // If the player ready status is showing as true, show the unready up button that when clicked will be processed on the server side using the function above.
          <MDBBtn color="purple" onClick={unready_up}>
            Unready
          </MDBBtn>
        )
      ) : null}
    </>
  ) : (
    // Otherwise, if the player is NOT the host of the game
    <>
      {/* Show the ready up buttons only, following the exact same commenting as above. */}
      {gameOpen ? (
        !playerReady ? (
          <MDBBtn color="danger" onClick={ready_up}>
            Ready Up
          </MDBBtn>
        ) : (
          <MDBBtn color="purple" onClick={unready_up}>
            Unready
          </MDBBtn>
        )
      ) : null}
    </>
  );
};

export default WaitingLobby;
