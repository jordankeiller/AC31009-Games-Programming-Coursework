// Import relevant libraries
import React, { useState } from "react";
import Axios from "axios";
import { MDBModalBody, MDBModalFooter, MDBBtn } from "mdbreact";

// Main login function
function Login() {
  // Used on the backend when the parameteres for logging in are passed over
  Axios.defaults.withCredentials = true;

  // Set the logging variables to the default state (i.e. blank) until the user has inputted the relevant information. // (Traditional Design Pattern: State)
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Function that, when called upon, will send the login information to the server. Asynchronous function.
  const loginUser = async (e) => {
    e.preventDefault();

    // Wait for the login to be posted to the server before moving on in the function.
    await Axios.post("http://localhost:3001/login", {
      username: loginUsername,
      password: loginPassword,
    }).then((response) => {
      if (response.data.authenticated) {
        localStorage.setItem("name", response.data.user);
        localStorage.setItem("token", response.data.token);
      }
    });

    // After logging in, reload the screen (i.e. refresh the entire webpage to update the login state if it was successfull, or allow the player to re-login if unsuccessful.)
    window.location.reload(false);
  };

  return (
    <MDBModalBody>
      {/* Once the form has been submitted, the login user function above will be called to process the input details */}
      <form onSubmit={loginUser}>
        <label className="grey-text">Email Address/Username</label>

        {/* Input field to ask for the login username */}
        <input
          type="text"
          className="form-control"
          placeholder="example@email.com"
          onChange={(e) => {
            setLoginUsername(e.target.value);
          }}
        />
        <br />
        <label className="grey-text">Password</label>

        {/* Input field to ask for the login password */}
        <input
          type="password"
          className="form-control"
          placeholder="**********"
          onChange={(e) => {
            setLoginPassword(e.target.value);
          }}
        />

        <MDBModalFooter>
          {/* When the button below is clicked, the form is submitted. */}
          <MDBBtn color="primary" type="submit">
            Login
          </MDBBtn>
        </MDBModalFooter>
      </form>
    </MDBModalBody>
  );
}

export default Login;
