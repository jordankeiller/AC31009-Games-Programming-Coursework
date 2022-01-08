// Import relevant libraries
import { Redirect } from "react-router-dom";
import React from "react";
import {
  MDBView,
  MDBMask,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBBadge,
} from "mdbreact";

// Import relevant components // Decoupling Pattern: Component - all these components make up the game and are called upon into this file to make it easier to handle, rather than all of the code from THOSE files being in THIS one.
import WaitingLobby from "./WaitingLobby";
import GameTime from "./GameTime";
import Paragraph from "./Paragraph";
import UserInput from "./UserInput";
import Progress from "./Progress";
import BrowserSocket from "../BrowserSocket";

// Import global CSS file
import "../assets/css/main.css";

// Main playing of the game function, takes in the game update state provided by App.js
const Play = ({ gameStatus }) => {
  // Defines the game update state into useable variables that are used further down in the code.
  const {
    _id,
    gamePlayers,
    gameParagraph,
    gameOpen,
    gameClosed,
    gameTotalPlayersReady,
    gameTotalPlayers,
  } = gameStatus;

  // Function to find who a player is and then assign them to a variable.
  const player = whoIsPlayer(gamePlayers);

  // If the client trying to join the game doesn't have a playerID set (i.e. they haven't gone through the proper methods of hosting/joining a game or if the game is closed) then redirect them to the main page.
  if (_id === "") {
    return <Redirect to="/" />;
  }

  return (
    <div id="game">
      <MDBView>
        <MDBMask className="gradient">
          <div style={{ marginTop: "15vh" }}>
            <MDBContainer>
              <MDBRow>
                <MDBCol />
                <MDBCol md="10">
                  <MDBCard className="unique-color">
                    <MDBCardBody>
                      <div style={{ color: "white" }}>
                        <h4 className="float-left">
                          {/* Using the data from the game state, check if the game is currently open (i.e gameOpen = true) and if it is, it is still in the waiting lobby stage. */}
                          {gameOpen ? (
                            <>Rush Racer - Waiting Lobby</>
                          ) : (
                            // Otherwise, gameOpen = false and as such, the game is currently in progress so should reflect the title to show this.
                            <>Rush Racer - Game</>
                          )}
                        </h4>
                        <h6 className="float-right">
                          <GameTime />
                        </h6>
                        <br />
                        <hr />
                        <div>
                          <div className="float-left">
                            <h6 className="float-left">
                              {/* Show the Room ID to all clients which can be easily copy/pasted to give to friends to join their game */}
                              <b>
                                Room ID: <MDBBadge color="dark">{_id}</MDBBadge>
                              </b>
                            </h6>
                            <br />
                            <h6 className="float-left">
                              <b>
                                {/* Using the data from the game state, check if the game is currently open (i.e. gameOpen = true) */}
                                {gameOpen ? (
                                  // If the gameState is open, check if the number of players in the lobby is < 2
                                  gameTotalPlayers < 2 ? (
                                    <>
                                      {/* If players in the lobby is less than 2, show a message that atleast 2 players are needed in the lobby to be able to start */}
                                      Players Needed:{" "}
                                      <MDBBadge color="dark">
                                        {gameTotalPlayers} / 2
                                      </MDBBadge>
                                    </>
                                  ) : (
                                    // If the gameState is open AND there atleast 2 players in the lobby, display a message showing that atleast [totalPlayers] - 1 need to be ready for the game to be able to start
                                    <>
                                      Players Ready:{" "}
                                      <MDBBadge color="dark">
                                        {gameTotalPlayersReady} /{" "}
                                        {gameTotalPlayers} (need{" "}
                                        {gameTotalPlayers - 1})
                                      </MDBBadge>
                                    </>
                                  )
                                ) : // If the gameState is not open (i.e. gameState = false) then show null - i.e. the game is in progress so there are no further conditions for a game to be able to start, since it's already started and the conditions have been met.
                                null}
                              </b>
                            </h6>
                          </div>

                          <div className="float-right">
                            {/* Show the buttons to be able to start/ready up in a game. The relevant variables are passed using the game state further defined above. */}
                            <WaitingLobby
                              player={player}
                              matchID={_id}
                              gameOpen={gameOpen}
                            />
                          </div>
                        </div>
                      </div>
                      <br />
                      <br />
                      <br />

                      <MDBRow>
                        <MDBCol />
                        <MDBCol md="10">
                          <MDBCard className="bg-dark">
                            <MDBCardBody className="quote">
                              {/* Show the Paragraph that the players need to type. This is pulled from the game state already further defined above. */}
                              <Paragraph
                                gameParagraph={gameParagraph}
                                player={player}
                              />

                              {/* Show the user input bar (i.e the part the players need to type in when the game started) */}
                              <UserInput
                                gameOpen={gameOpen}
                                gameClosed={gameClosed}
                                matchID={_id}
                              />
                            </MDBCardBody>
                          </MDBCard>
                        </MDBCol>
                        <MDBCol />
                      </MDBRow>
                      <br />

                      <MDBCard className="bg-dark">
                        <MDBCardBody>
                          <h1 className="text-center leaderboardTitle">
                            Leaderboard
                          </h1>
                          {/* Show the progress bars/leaderboard of all players currently in the Match */}
                          <Progress
                            player={player}
                            gamePlayers={gamePlayers}
                            word_length={gameParagraph.length}
                          />
                        </MDBCardBody>
                      </MDBCard>
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
                <MDBCol />
              </MDBRow>
            </MDBContainer>
          </div>
        </MDBMask>
      </MDBView>
    </div>
  );
};

// Function will find out who a specific player is, which is important since it is passed into other components that use the player field as shown in the above code
const whoIsPlayer = (gamePlayers) => {
  return gamePlayers.find((player) => player.playerID === BrowserSocket.id);
};

export default Play;
