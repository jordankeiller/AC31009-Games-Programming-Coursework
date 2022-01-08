// Import relevant libraries
import React, { useState, useEffect } from "react";
import {
  MDBMask,
  MDBView,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBIcon,
  MDBContainer,
  MDBRow,
  MDBCol,
} from "mdbreact";

// Import relevant components // Decoupling Pattern: Component
import BrowserSocket from "../BrowserSocket";

// Import global CSS file
import "../assets/css/main.css";

// Main Join function
const Join = () => {
  // Set the player name to a default state (i.e. blank until a player name is entered) // (Traditional Design Pattern: State)
  const [playerName, setPlayerName] = useState("");

  // Set the Match ID to a default state (i.e. blank until a match ID is entered) // (Traditional Design Pattern: State)
  const [room_id, setMatchID] = useState("");

  // Below will only run once - i.e. if in the players local storage the name variable is set (i.e. they are logged in) then set the player name to the name that is set in the local storage.
  useEffect(() => {
    if (localStorage.getItem("name")) {
      setPlayerName(localStorage.getItem("name"));
    }
  }, []);

  // When the client clicks on the join game button, the player name and match ID that they entered is emitted to the server to be processed to allow the client to join a game, if it exists.
  const joinGame = (e) => {
    e.preventDefault();
    BrowserSocket.emit("joinGame", { playerName, room_id });
  };
  return (
    <div id="game">
      <MDBView>
        <MDBMask className="gradient">
          <div style={{ marginTop: "20vh" }}>
            <MDBContainer>
              <MDBRow>
                <MDBCol />
                <MDBCol md="4">
                  <MDBCard className="unique-color">
                    <MDBCardBody>
                      {/* When the form has been submitted, run the join game function above */}
                      <form onSubmit={joinGame}>
                        <p className="white-text h4 text-center py-4">
                          Rush Racer - Join Game
                        </p>
                        <label className="white-text font-weight-light">
                          What do you want to be known as?
                        </label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon">
                              <i className="fa fa-user-tag prefix"></i>
                            </span>
                          </div>

                          {/* If the player's name is set in local storage */}
                          {localStorage.getItem("name") ? (
                            <>
                              {/* Set the players name to the one that is in local storage and disable the input field (i.e. they cannot choose a custom name) */}
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Player name"
                                disabled
                                value={localStorage.getItem("name")}
                              />
                            </>
                          ) : (
                            // Otherwise if the players name is not set in local storage, allow the player to choose their own custom name.
                            <>
                              {/* On each letter the client types, the player name state is updated to reflect the changes */}
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Player name"
                                onChange={(e) => {
                                  setPlayerName(e.target.value);
                                }}
                              />
                            </>
                          )}
                        </div>
                        <br />
                        <label className="white-text font-weight-light">
                          What is the Room ID?
                        </label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon">
                              <i className="fa fa-door-open prefix"></i>
                            </span>
                          </div>
                          {/* On each character the client types, the match ID state is updated to reflect the changes */}
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Room ID"
                            onChange={(e) => {
                              setMatchID(e.target.value);
                            }}
                          />
                        </div>

                        <div className="text-center py-4 mt-3">
                          {/* When the player clicks on the join game button, the player name, match ID and join game signal is sent to the server to be processed. */}
                          <MDBBtn className="btn btn-elegant" type="submit">
                            Join Game
                            <MDBIcon far icon="paper-plane" className="ml-2" />
                          </MDBBtn>
                        </div>
                      </form>
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

export default Join;
