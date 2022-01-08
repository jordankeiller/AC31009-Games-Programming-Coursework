// Import the relevant libraries
import React from "react";
import { Router, Switch } from "react-router-dom";
import {
  MDBView,
  MDBMask,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBAnimation,
  MDBBtn,
  MDBLink,
} from "mdbreact";

// Import relevant components
import BrowserHistory from "../BrowserHistory";

// Import the global CSS file
import "../assets/css/main.css";

// Main home function
const Home = () => {
  return (
    <div id="home">
      <Router history={BrowserHistory}>
        <Switch>
          <MDBView>
            <MDBMask className="d-flex justify-content-center align-items-center gradient">
              <MDBContainer>
                <MDBRow>
                  <MDBCol
                    md="6"
                    className="white-text text-center text-md-left mt-xl-5 mb-5"
                  >
                    <MDBAnimation type="fadeInLeft" delay=".3s">
                      <h1 className="h1-responsive font-weight-bold mt-sm-5">
                        Rush Racer
                      </h1>
                      <hr className="hr-light" />
                      <h6 className="mb-4">
                        A speed-typing game, which you can play with your
                        friends to find out who is the quickest typer amongst
                        you all! If competitive play isn't your style, you can
                        always play for fun to improve your typing skills!
                      </h6>
                      <MDBLink to="/game">
                        <MDBBtn color="red">Play Game</MDBBtn>
                      </MDBLink>
                    </MDBAnimation>
                  </MDBCol>

                  <MDBCol md="6" xl="5" className="mt-xl-5">
                    <MDBAnimation type="fadeInLeft" delay=".3s">
                      {/* Image taken from : https://mdbootstrap.com/img/Mockups/Transparent/Small/admin-new.png License has been included in the references section in my report */}
                      <img
                        src="https://mdbootstrap.com/img/Mockups/Transparent/Small/admin-new.png"
                        alt=""
                        className="img-fluid"
                      />
                    </MDBAnimation>
                  </MDBCol>
                </MDBRow>
              </MDBContainer>
            </MDBMask>
          </MDBView>
        </Switch>
      </Router>
    </div>
  );
};

export default Home;
