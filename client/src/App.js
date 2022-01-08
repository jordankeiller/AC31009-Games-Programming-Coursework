// Import the relevant react libraries and react-router-dom which is used for rendering different pages for clients
import React, { useEffect, useState } from "react";
import { Switch, Route, Router } from "react-router-dom";

// Import the history and socket.io client which will run throughout the App // Decoupling Pattern: Component
import BrowserHistory from "./BrowserHistory";
import BrowserSocket from "./BrowserSocket";

// Import components to be used within the App // Decoupling Pattern: Component
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import Game from "./components/Game";
import Host from "./components/Host";
import Join from "./components/Join";
import Play from "./components/Play";

function App() {

  // Set the game state to default values (Traditional Design Pattern: State) - relies on the Sequencing pattern for updating a method.
  const [gameStatus, setGameStatus] = useState({
    _id: "",
    gameOpen: false,
    gamePlayers: [],
    gameParagraph: [],
  });

  // Upon receiving an update game state from the server side, update the default values above to actual values.
  // useEffect is utilised since it will only run once when called upon. 
  useEffect(() => {

    //( // Sequencing Pattern: Update Method ) 
    BrowserSocket.on("updateGame", (Match) => {
      // console.log(Match);
      setGameStatus(Match);
    });

    // Remove the listener since the game state only needs to be updated when needed and not listening constantly.
    return () => {
      BrowserSocket.removeAllListeners();
    };
  }, []);

  // If statement to check if the game state has an ID, send the client to the page with that ID, otherwise allow the client to continue to browse the site as normal 
  // (i.e. they have not hosted or joined a game)
  useEffect(() => {
    if (gameStatus._id !== "") {
      BrowserHistory.push(`/play/${gameStatus._id}`);
    }
  }, [gameStatus._id]);

  return (
    <>

      {/* Render the components that were imported above. // Decoupling Pattern: Component */}
      <Router history={BrowserHistory}>
        <Navigation />
        <Switch>
          {/* Components are called upon using the variables that they were imported from upon above. "component={name}" */}
          <Route exact path="/" component={Home} />
          <Route path="/game" component={Game} />
          <Route path="/host" component={Host} />
          <Route path="/join" component={Join} />
          <Route
            path="/play/:matchID"
            render={(props) => <Play {...props} gameStatus={gameStatus} />}
          />
        </Switch>
      </Router>
    </>
  );
}

export default App;
