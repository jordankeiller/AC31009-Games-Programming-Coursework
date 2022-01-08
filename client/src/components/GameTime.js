// Import relevant libraries
import React, { useState, useEffect } from "react";
import { MDBBadge } from "mdbreact";

// Import relevant components // Decoupling Pattern: Component
import BrowserSocket from "../BrowserSocket";

// Main GameTime function
const GameTime = () => {
  // Set the timer to a default state (i.e. there hasn't been anything received from the server side to otherwise update the game state to actual values) // (Traditional Design Pattern: State)
  const [timer, setTimer] = useState({
    remainingTime: "",
    message: "Not enough players are in the lobby to start. (2 or more needed)",
    readyCheck: false,
  });

  // useEffect is used to run the code within it once only. Upon receiving the "startGame" from the server, set the game timer and its values accordingly
  useEffect(() => {
    BrowserSocket.on("startGame", (currentTime) => {
      setTimer(currentTime);
    });
  }, []);

  // Pull out the actual values that were given from the server side
  const { remainingTime, message, readyCheck } = timer;

  // If the "readyCheck" value from the server is false (i.e. the conditions to start a game haven't been met or any other error has occurred)
  return !readyCheck ? (
    // Show an error message to the client
    <>{message}</>
  ) : (
    // Otherwise "readyCheck" value is true (i.e. the game has started) so show the countdown and main game timer
    <h4>
      <MDBBadge color="red">
        {message}: {remainingTime}
      </MDBBadge>
    </h4>
  );
};

export default GameTime;
