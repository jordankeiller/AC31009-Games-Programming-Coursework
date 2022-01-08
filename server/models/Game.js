// Requiring the mongoose library
const db = require("mongoose");

// New player schema created with defining fields for each new player
const Player = new db.Schema({
  // Player ID is obtained through the socket.io unique ID for each new connection
  playerID: { type: String, require: true },
  playerName: { type: String, default: "" },
  playerHost: { type: Boolean, default: false },

  // Traditional Design Pattern: State. State will change depending if a player is ready or not. Finit and can only be one state at one time.
  playerReady: { type: Boolean, default: false },

  playerWordsPerMinute: { type: Number, default: -99 },
  playerWordPosition: { type: Number, default: 0 },
  playerCorrectWord: { type: Boolean, default: true },
});

// New game schema created with defining fields for each new game created
const Game = new db.Schema({
  gameParagraph: [
    {
      type: String,
    },
  ],

  // Makes use of the player schema to identify which players are actually in the game, all fields from the player schema are thus available for use under the gamePlayers field.
  gamePlayers: [Player],

  // Traditional Design Pattern: State. States will change depending on if a game is open or closed. Finite and can only be one state at one time.
  gameOpen: { type: Boolean, default: true },
  gameClosed: { type: Boolean, default: false },

  // Start/end time used for calculating the WPM
  gameStartTime: { type: Number },
  gameEndTime: { type: Number },

  // How many TOTAL gamePlayers a GAME with ID has.
  gameTotalPlayers: { type: Number, default: 0 },

  // From the TOTAL players a GAME with ID has, how MANY of those players are actually ready (i.e. who has(nt) pressed the ready up button)
  gameTotalPlayersReady: { type: Number, default: 0 },
});

// Exports the Game schema (which already includes the player schema within it)
module.exports = db.model("Game", Game);
