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

// Main Host function
const Host = () => {
  // Set the player name to a default state (i.e. blank until a player name is entered) // (Traditional Design Pattern: State)
  const [playerName, setPlayerName] = useState("");

  // Below will only run once - i.e. if in the players local storage the name variable is set (i.e. they are logged in) then set the player name to the name that is set in the local storage.
  useEffect(() => {
    if (localStorage.getItem("name")) {
      setPlayerName(localStorage.getItem("name"));
    }
  }, []);

  // When the client clicks on the host game button, an emit is sent to the server side to run the relevant functions needed to set up a new game.
  const createNewGame = (e) => {
    e.preventDefault();
    BrowserSocket.emit("newGame", playerName);
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
                      {/* When the form has been submitted, run the create new game function. */}
                      <form onSubmit={createNewGame}>
                        <p className="white-text h4 text-center py-4">
                          Rush Racer - Host Game
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
                                disabled
                                className="form-control"
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

                        <div className="text-center py-4 mt-3">
                          {/* When the player clicks on the host game button, the player name and the start game signal is sent to the server side for processing. If this button is not clicked, nothing is sent. */}
                          <MDBBtn className="btn btn-elegant" type="submit">
                            Host Game
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

export default Host;
