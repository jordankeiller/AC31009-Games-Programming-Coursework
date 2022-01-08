// Import the relevant libraries
import React, { useState } from "react";
import axios from "axios";
import { MDBModalBody, MDBModalFooter, MDBBtn } from "mdbreact";

// Main register function
function Register() {
  // Set the registering variables to default states (i.e. blank) until the user has inputted the relevant information. // (Traditional Design Pattern: State)
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  // Function that, when called upon, will send the registration information to the server side.
  const registerUser = () => {
    axios.post("http://localhost:3001/register", {
      email: registerEmail,
      username: registerUsername,
      password: registerPassword,
    });
  };
  return (
    <MDBModalBody>
      {/* Once the form has been submitted, the registration of the user function will be called upon to send the information to the server side for processing. */}
      <form onSubmit={registerUser}>
        <label className="grey-text">Email Address</label>
        {/* On each character entered, the registration email state will be updated to reflect the email address that the user wants to regiser. */}
        <input
          type="email"
          className="form-control"
          placeholder="example@email.com"
          required
          onChange={(e) => {
            setRegisterEmail(e.target.value);
          }}
        />
        <br />
        <label className="grey-text">Username</label>
        {/* On each character entered, the username state will be updated to reflect the username that the user wants to regiser. */}
        <input
          type="text"
          className="form-control"
          placeholder="Type username here.."
          required
          onChange={(e) => {
            setRegisterUsername(e.target.value);
          }}
        />
        <br />
        <label className="grey-text">Password</label>
        {/* On each character entered, the password state will be updated to reflect the password that the user wants to regiser. */}
        <input
          type="password"
          className="form-control"
          placeholder="**********"
          required
          onChange={(e) => {
            setRegisterPassword(e.target.value);
          }}
        />
        <br />
        <MDBModalFooter>
          
          {/* When the registration button is clicked, the form will be submitted to the server (provided it has passed the client-side validation checks) for processing.*/}
          <MDBBtn color="primary" type="submit">
            Register
          </MDBBtn>
        </MDBModalFooter>
      </form>
    </MDBModalBody>
  );
}

export default Register;