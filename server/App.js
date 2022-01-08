// Requiring the relevant libraries for the webserver and components needed for the game to operate
const express = require("express");
const socketio = require("socket.io");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("mongoose");

// Importing the components/schemas used in the game
const Game = require("./models/Game");
const User = require("./models/User");
const Paragraph = require("./components/Paragraph");

// Creating a useable instance of the express server
const app = express();

// Variable to hold the frontend url so it is only needed to be changed in one place.
const frontEndURL = "http://localhost:3000"

// CORS policy being handled otherwise communication between the server->frontend would not be as easily possible as it is without CORS being implemented.
app.use(
  cors({
    origin: [frontEndURL],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Body Parser used to parse the data sent to/fr the server.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MongoDB connection, localhost details by default
db.connect(
  "mongodb://localhost:27017/ac31009coursework",
  {
    // Below options are required to stop mongoose deprecation warnings, fix here: https://mongoosejs.com/docs/deprecations.html
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  () => {
    // Once successfully connected, display a message.
    console.log("MongoDB connected successfully!");
  }
);

// Upon receiving the POST request on the "/register" path, run the following function.
app.post("/register", (request, response) => {
  // Grab the submitted variables from the frontend and assign them to useable variables within the backend
  const email = request.body.email;
  const username = request.body.username;
  const password = request.body.password;

  // Hash the password using the bcrypt hashing algorithm, 10 salt rounds
  bcrypt.hash(password, 10, (error, hashedPassword) => {
    // Add the user to the database using the HASHED password and not plaintext password
    let user = new User({
      email: email,
      username: username,
      password: hashedPassword,
    });

    // Save the database (i.e. updating it so the user is now a permanent record)
    user.save();
  });
});

// Upon receiving the POST request on the "/login" path, run the following function.
app.post("/login", async (request, response) => {
  // Grab the submitted variables from the frontend and assign them to useable variables within the backend
  const username = request.body.username;
  const password = request.body.password;

  // Find if the username submitted from the frontend actually exists within the database in the backend. The conditions for this are:
  // If the username matches the email OR username matches the username in the database, return the user that has been found.
  await User.findOne({
    $or: [{ email: username }, { username: username }],
  }).then((foundUser) => {
    // With the user found, compare the password in the database to the password that has been submitted in the frontend using the bcrypt compare function
    if (foundUser) {
      bcrypt.compare(password, foundUser.password, (err, result) => {
        // If the passwords DO NOT match, send an error to the front-end.
        if (err) {
          response.json({
            error: err,
          });
        }

        // If the passwords DO match, send the client a JSON web token, with a unique secret key and expiry of 10 minutes (i.e. client has only 10 minutes of authenticated access)
        if (result) {
          const token = jwt.sign(
            { username: foundUser.username },
            "MW%m39$bGZe",
            { expiresIn: 600 }
          );
          response.status(200).json({
            authenticated: true,
            token: token,
            user: foundUser.username,
          });
        }
      });
    }
    // If the username entered does not match a username or email in the database, log an error in the console.
    else {
      console.log("User not found.");
    }
  });
});

// Middleware function to verify user
const JWTVerify = (request, response, next) => {
  // Grab the token that would have been in the headers of the clients front-end.
  const token = request.headers["x-access-token"];

  // If through verifying the user doesn't actually have a token, return an error.
  if (!token) {
    response.send("Not Authenticated. No token assigned.");
  } else {
    // If the user does have a token, verify that it's actually a valid token for their user account and return the verified status. Otherwise return an error message.
    jwt.verify(token, "MW%m39$bGZe", (error, verified) => {
      if (error) {
        response.json({
          authenticated: false,
          message: "You failed to authenticate",
        });
      } else {
        request.ID = verified.id;
        next();
      }
    });
  }
};

// Upon receiving the GET request from the "/auth" path on front-end, call the middleware verify function and process if a user is actually verified and return a verified state if they are.
app.get("/auth", JWTVerify, (request, response) => {
  response.json({ authenticated: true });
});

// Creating an instance of the web server, which listens on port 3001 by default (localhost:3001) - can be changed to another port.
var port = process.env.PORT || 3001;
const server = app.listen(port);

// Creating an instance of the socket.io server, which listens on port 3000. CORS is a major issue with socket.io, fix here: https://socket.io/docs/v3/handling-cors/
const io = socketio(server, {
  cors: {
    origin: frontEndURL,
    methods: ["GET", "POST"],
  },
});

/*
Below function listens for all the socket.io events from the previously established connection to the front-end further up in the code. 
The events are displayed in a somewhat chronological order correspondent to what would be happening in the process of a game starting -> finishing. 
*/
io.on("connect", (socket) => {
  // Upon receiving the emit from the client on the front-end to start a new game, run the following asynchronous function. Also pulls the input from the front-end that the client gave for a player name.
  socket.on("newGame", async (playerName) => {
    // Grab a random paragraph from the API, do NOT move on until the promise has been settled - i.e. whether a paragraph has successfully been fetched or not.
    const paragraph = await Paragraph();

    // Create a new and unique match entry in the database to store the information relevant to that particular match.
    let Match = new Game();

    // Store the paragraph from the API into the database
    Match.gameParagraph = paragraph;

    // Assign the players values to a variable
    let player = {
      // Socket.io automatically assigns a unique ID for each connection, so this is used for the players ID.
      playerID: socket.id,

      // Player name is pulled from the front-end input, and since they are creating a game they automatically become the host of the game.
      playerName,
      playerHost: true,
    };

    // Create a new entry for the player in the relevant Match entry in the database and then increment the total players of the Match by 1
    Match.gamePlayers.push(player);
    Match.gameTotalPlayers++;

    // Save the state of the Match in the database following from the insertion of the new details, and wait for the save to complete before moving on
    Match = await Match.save();

    // Send the socket (i.e. the player) to the newly created game
    const matchID = Match._id.toString();
    socket.join(matchID);

    // Update the game state to show the waiting lobby and the host player details. ( // Sequencing Pattern: Update Method ) 
    io.to(matchID).emit("updateGame", Match);

    // Log the creation in the console for easier tracking if something goes wrong.
    console.log(
      "New Game Created... Match ID: " +
        Match._id +
        " Host: " +
        playerName +
        ", total number of players: " +
        Match.gameTotalPlayers
    );
  });

  // Upon receiving the emit from the client on the front-end to join a game, run the following asynchronous function. Also pulls in the match ID and player name from the input on the front end
  socket.on("joinGame", async ({ playerName, room_id: _id }) => {
    // Try-catch block incase a user enters a Match ID that doesn't exist, or any other major errors occur when trying to join.
    try {
      // Find the match ID entry in the database and store it as a variable
      let Match = await Game.findById(_id);

      // (Traditional Design Pattern: State) Checking if a match state is set to open before processing with allowing someone to join a game.
      if (Match.gameOpen) {
        // Send the socket (i.e. the player) to the entered game
        const matchID = Match._id.toString();
        socket.join(matchID);

        // Assign the players values to a variable
        let player = {
          // Socket.io automatically assigns a unique ID for each connection, so this is used for the players ID.
          playerID: socket.id,

          // Player name is pulled from the front-end input
          playerName,
        };

        // Create a new entry for the player in the relevant Match entry in the database and then increment the total players of the Match by 1
        Match.gamePlayers.push(player);
        Match.gameTotalPlayers++;
        Match = await Match.save();

        // Update the game state. ( // Sequencing Pattern: Update Method ) 
        io.to(matchID).emit("updateGame", Match);
        console.log(
          "Player Joined Game... Match ID: " +
            Match._id +
            " Player: " +
            playerName +
            ", total number of players: " +
            Match.gameTotalPlayers
        );
      }
    } catch (error) {
      console.log(
        "Error! Player: '" +
          playerName +
          "' tried joining Match ID: '" +
          _id +
          "' but didn't. (Likely game does not exist)"
      );
    }
  });

  // Upon receiving the ready up emit by the client on the front end, run the below asynchronous function.
  socket.on("readyUp", async ({ matchID }) => {
    // Find both the Match using the provided Match ID from the front-end and players within that match, then assign them both to seperate usable variables
    let Match = await Game.findById(matchID);
    let player = Match.gamePlayers.find(
      (player) => player.playerID === socket.id
    );

    // Set readyStatus to whatever the status is currently. i.e. readyStatus = false. // (Traditional Design Pattern: State)
    let readyStatus = player.playerReady;

    // If the ready status is false (which it should always be in this asynchronous function, but in case of erroneous errors, an if statement is required)
    if (!readyStatus) {
      // Set the player's ready status to true and increment the total players ready within the match by 1 (utilised in the conditions when looking if a match can be started or not) // (Traditional Design Pattern: State)
      player.playerReady = true;
      Match.gameTotalPlayersReady++;

      // Log to the console the ready up status change
      console.log(
        "Player Ready... Match ID: " +
          Match._id +
          ", Player Name: " +
          player.playerName +
          ", Player ID: " +
          player.playerID +
          ", Total Players Ready: " +
          Match.gameTotalPlayersReady
      );
    }

    // Save the Match entry in the database to reflect the newly ready player
    Match = await Match.save();

    // Update the game state to reflect the newly ready player ( // Sequencing Pattern: Update Method ) 
    io.to(matchID).emit("updateGame", Match);
  });

  // Upon receiving the unready emit by the client on the front end, run the below asynchronous function.
  socket.on("unready", async ({ matchID }) => {
    // Find both the Match using the provided Match ID from the front-end and players within that match, then assign them both to seperate usable variables
    let Match = await Game.findById(matchID);
    let player = Match.gamePlayers.find(
      (player) => player.playerID === socket.id
    );

    // Set readyStatus to whatever the status is currently. i.e. readyStatus = true.
    let readyStatus = player.playerReady;

    // If the ready status is true (which it should always be in this asynchronous function, but in case of erroneous errors, an if statement is required)
    if (readyStatus) {
      // Set the player's ready status to false and decrement the total players ready within the match by 1 (utilised in the conditions when looking if a match can be started or not) // (Traditional Design Pattern: State)
      player.playerReady = false;
      Match.gameTotalPlayersReady--;

      // Log to the console the unready status change
      console.log(
        "Player Unready... Match ID: " +
          Match._id +
          ", Player Name: " +
          player.playerName +
          ", Player ID: " +
          player.playerID +
          ", Total Players Ready: " +
          Match.gameTotalPlayersReady
      );
    }

    // Save the Match entry in the database to reflect the newly unready player
    Match = await Match.save();

    // Update the game state to reflect the newly unready player ( // Sequencing Pattern: Update Method ) 
    io.to(matchID).emit("updateGame", Match);
  });

  // Upon receiving the emit from the host on the front-end to start a new game, run the following asynchronous function.
  socket.on("startGame", async ({ matchID, playerID }) => {
    let Match = await Game.findById(matchID);

    /*
    Conditions for the game to be able to start (the if statement assumes the conditions have been met):
       - Atleast a minimum of 2 players are in the game lobby
       - Atleast [totalPlayers] - 1 have clicked on the Ready Up button
    */
    if (
      Match.gameTotalPlayers >= 2 &&
      Match.gameTotalPlayersReady >= Match.gameTotalPlayers - 1
    ) {
      // Time below doubles as a countdown until the game starts and the remaining time when the game has actually started.
      // The below is how long until the game will start.
      let remainingTime = 15;
      let player = Match.gamePlayers.id(playerID);

      let timer = setInterval(async () => {
        // If the countdown is still above or equal to 0, decrement the timer by one second and then repeat until hitting -1
        if (remainingTime >= 0) {
          io.to(matchID).emit("startGame", {
            readyCheck: true,
            readyStatus: true,
            remainingTime,
            message: "Game starting in.. ",
          });
          remainingTime--;

          // Close the waiting lobby (i.e. no other players can now join) and run the main game timer.
        } else {

          // (Traditional Design Pattern: State) Setting the match state to false (i.e. no-one else can join now since the open state is false.)
          Match.gameOpen = false;
          Match = await Match.save();
          io.to(matchID).emit("updateGame", Match); // ( // Sequencing Pattern: Update Method ) 
          gameTimer(matchID);
          clearInterval(timer);
        }
      }, 1000);

      // Log in the console details specific to the game starting
      console.log(
        "Game starting... Match ID: " +
          Match._id +
          " Host: " +
          player.playerName +
          " Total Players: " +
          Match.gameTotalPlayers +
          " Total Players Ready: " +
          Match.gameTotalPlayersReady
      );
    }
    // When the conditions for a game to start have not been met AND the host has clicked on the start game button, the following is run..
    else {
      /*
      If the following condition has been failed:
          - Atleast a minimum of 2 players are in the game lobby
      */
      if (Match.gameTotalPlayers < 2) {
        // Emit a message to the lobby to reflect not enough players are in the lobby to be able to start.
        io.to(matchID).emit("startGame", {
          readyCheck: false,
          readyStatus: false,
          message:
            "Not enough players are in the lobby to start. (2 or more needed)",
        });

        // Send a message to the console to reflect the error that there isn't enough players in the lobby to be able to start.
        console.log(
          "[FAILED] Game starting... Match ID: " +
            Match._id +
            " Error: Not enough players are in the lobby. (2 or more needed)"
        );
      }

      /*
      If the following condition has been failed:
          - Atleast [totalPlayers] - 1 have clicked on the Ready Up button
      */
      if (
        Match.gameTotalPlayers >= 2 &&
        Match.gameTotalPlayersReady <= Match.gameTotalPlayers - 1
      ) {
        // Calculate how many players need to click the ready up button to be able to start a game, then assign the value to a variable.
        let playersNeededToStart = Match.gameTotalPlayers - 1;

        // Emit a message to the lobby to reflect not enough players are ready in the lobby to be able to start.
        io.to(matchID).emit("startGame", {
          readyCheck: false,
          readyStatus: false,
          message:
            "Not enough players are ready in the lobby. (" +
            playersNeededToStart +
            " is needed)",
        });

        // Send a message to the console to reflect the error that there isn't enough players in the lobby ready to be able to start.
        console.log(
          "[FAILED] Game starting... Match ID: " +
            Match._id +
            " Error: Not enough players have clicked the Ready Up button. (" +
            playersNeededToStart +
            " needed)"
        );
      }
    }
  });

  // Upon receiving the player input emit the front-end, run the following asynchronous function.
  socket.on("input", async ({ input, matchID }) => {
    let Match = await Game.findById(matchID);

    // If the game is in progress (i.e. the game is not open and the game is not closed - indicating the timer is currently counting down) // (Traditional Design Pattern: State)
    if (!Match.gameOpen && !Match.gameClosed) {
      // Find the player using their player ID and store in a variable
      let player = Match.gamePlayers.find(
        (player) => player.playerID === socket.id
      );

      // Find which word they are on in the paragraph and store that word in a variable
      let currentWord = Match.gameParagraph[player.playerWordPosition];

      // If that word ^ matches the word that the player inputted on the front end
      if (currentWord === input) {
        // Increment the players word position by one (i.e. move them to the next word they need to type)
        player.playerWordPosition++;

        // Set the playerCorrectWord database field to true (used on the front end for formatting (in)correct words )
        player.playerCorrectWord = true;
        if (player.playerWordPosition !== Match.gameParagraph.length) {
          Match = await Match.save();
          io.to(matchID).emit("updateGame", Match); // ( // Sequencing Pattern: Update Method ) 
        } else {
          Match.gameEndTime = new Date().getTime();
          Match = await Match.save();
          let { gameStartTime, gameEndTime } = Match;
          player.playerWordsPerMinute = calculateWordsPerMinute(
            gameEndTime,
            gameStartTime,
            player
          );

          // Update the Match player entry to reflect their WPM
          Match = await Match.save();

          // Update the game state ( // Sequencing Pattern: Update Method ) 
          io.to(matchID).emit("updateGame", Match);
        }
      } else {
        // Set the playerCorrectWord database field to false (used on the front end for formatting (in)correct words )
        player.playerCorrectWord = false;

        // Update the game state ( // Sequencing Pattern: Update Method ) 
        io.to(matchID).emit("updateGame", Match);
      }
    }
  });
});

// Function for the main game timer - asynchronous
const gameTimer = async (matchID) => {
  // How much time a game should have once started (main game timer)
  let remainingTime = 45;

  // Find the Match using the Match ID provided by the front end
  let Match = await Game.findById(matchID);

  // Update and save the Match entry in the database to have a start time of the actual real time the game timer started
  Match.gameStartTime = new Date().getTime();
  Match = await Match.save();

  let timer = setInterval(() => {
    // If the countdown is still above or equal to 0, decrement the timer by one second and then repeat until hitting -1
    if (remainingTime >= 0) {
      io.to(matchID).emit("startGame", {
        readyCheck: true,
        readyStatus: true,
        remainingTime,
        message: "Time Remaining",
      });
      remainingTime--;
    } else {
      // After the main game timer has finished, run the following asynchronously.
      (async () => {
        let Match = await Game.findById(matchID);

        // Get and then set the Match entry in the database for the game end time
        Match.gameEndTime = new Date().getTime();
        Match = await Match.save();

        // Pull out the starting and ending time of the game from the database
        let { gameStartTime, gameEndTime } = Match;

        // Close the match (i.e. game is finished; players can no longer type to score higher in the leaderboard) // (Traditional Design Pattern: State)
        Match.gameClosed = true;

        // For each of the players that didn't manage to finish the game within the time limit, calculate their words per minute.
        // Players that finished before the timer hit 0 are handled in a seperate function further up.
        Match.gamePlayers.forEach((player, index) => {
          if (player.playerWordsPerMinute === -99) {
            Match.gamePlayers[
              index
            ].playerWordsPerMinute = calculateWordsPerMinute(
              gameEndTime,
              gameStartTime,
              player
            );
          }
        });

        // Update the Match entry in the database with the update words per minute information for each of the players
        Match = await Match.save();

        // Update the game state ( // Sequencing Pattern: Update Method ) 
        io.to(matchID).emit("updateGame", Match);
        clearInterval(timer);
      })();
    }
  }, 1000);
};

// Function to calculate the players words per minute
const calculateWordsPerMinute = (gameEndTime, gameStartTime, player) => {
  let numberOfWordsTyped = player.playerWordPosition;

  // Calculcate the time taken using the time the game started and ended and convert into minutes.
  const timeTaken = (gameEndTime - gameStartTime) / 1000 / 60;

  // Calculcate the players WPM, rounding to a whole number. (hence using Math.floor)
  const playerWordsPerMinute = Math.floor(numberOfWordsTyped / timeTaken);
  return playerWordsPerMinute;
};
