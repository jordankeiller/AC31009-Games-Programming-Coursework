// Import relevant libraries
import React, { useState } from "react";

// Import relevant components // Decoupling Pattern: Component
import BrowserSocket from "../BrowserSocket";

// Main user input function
const UserInput = ({ gameOpen, gameClosed, matchID }) => {
  // Set the user input to nothing by default (i.e. the user hasn't typed anything) // (Traditional Design Pattern: State)
  const [input, setInput] = useState("");

  // Function is used to set the input state back to blank/nothing when the conditions have been met for the state to actually be cleared.
  const clear = () => {
    setInput("");
  };

  return (
    <div>
      <form>
        <br></br>
        {/* Shows the input box */}
        <input
          type="text"
          // If the game state shows the game as being open OR closed, the input box will be shown as readOnly and the user will not be able to type.
          // (i.e. the game is either in waiting lobby stage or finished completely)
          // in effect -> the user will ONLY be able to type when the game is in progress.
          readOnly={gameOpen || gameClosed}
          // The value is taken from the input state set further above.
          value={input}
          placeholder="Type here when game starts..."
          className="form-control"
          onChange={(e) => {
            let value = e.target.value;
            let last_character = value.charAt(value.length - 1);

            // If the last character the player enters in the input box is in the spacebar character (" ") then send their input to the server for VALIDATION
            // Important that the server validates whether ot not the word is correct rather than doing this on the client side to avoid any manipulation from the client side to cheat.
            if (last_character === " ") {
              BrowserSocket.emit("input", { input, matchID });

              // Clear the input after the space bar has been entered
              clear();
            } else {
              setInput(e.target.value);
            }
          }}
        />
      </form>
    </div>
  );
};

export default UserInput;
