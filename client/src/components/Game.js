// Import relevant libraries
import React from "react";
import { MDBMask, MDBView, MDBBtn } from "mdbreact";

// Import relevant components // Decoupling Pattern: Component
import BrowserHistory from "../BrowserHistory";

// Import global CSS file
import "../assets/css/main.css";

// Function that will direct the client to the "/host" path (i.e. changing the render to the host page)
const hostGame = () => {
  BrowserHistory.push("/host");
};

// Function that will direct the client to the "/join" path (i.e. changing the render to the join page)
const joinGame = () => {
  BrowserHistory.push("/join");
};

// Main Game page function
const Game = () => {
  return (
    <div id="game">
      <MDBView>
        <MDBMask className="gradient">
          <div
            className="text-center align-middle"
            style={{ marginTop: "20vh" }}
          >
            <MDBBtn className="w-25 p-3" color="red" onClick={hostGame}>
              Host Game
            </MDBBtn>
            <br />
            <MDBBtn className="w-25 p-3" color="red" onClick={joinGame}>
              Join Game
            </MDBBtn>
          </div>
        </MDBMask>
      </MDBView>
    </div>
  );
};

export default Game;
