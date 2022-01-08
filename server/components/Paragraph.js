// Requiring the library needed to communicate with the paragraph API
const axios = require("axios");

// Assigning the API URL to a usable variable
const paragraph = "https://api.quotable.io/random";

// Returning the newly generated random paragraph to be used elsewhere in the main App.js
module.exports = newParagraph = () => {
  return axios
    .get(paragraph)
    .then((response) => response.data.content.split(" "));
};
