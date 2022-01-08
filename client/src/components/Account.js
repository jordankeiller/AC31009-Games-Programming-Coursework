// Import relevant libraries
import React from "react";
import { MDBModalBody} from "mdbreact";

// Main account function
function Account() {

  // Store the players name if they are already logged in using the local storage variable. This variable is set on the backend, so this is simply pulling that item into a variable on the front-end. 
  const name = localStorage.getItem("name");
  return (
    <MDBModalBody>
      <form>
        <label className="grey-text">
          Your username
        </label>

        {/* Display the players name */}
        <input
          type="text"
          value={name}
          disabled
          className="form-control"
        />
        <br />
      </form>
    </MDBModalBody>
  );
}

export default Account;
