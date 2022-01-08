// Import the relevant libraries
import React from "react";
import { Router, Switch } from "react-router-dom";
import Axios from "axios";
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavItem,
  MDBNavLink,
  MDBNavbarToggler,
  MDBCollapse,
  MDBBtn,
  MDBContainer,
  MDBModal,
  MDBModalHeader,
} from "mdbreact";

// Import the relevant components // Decoupling Pattern: Component
import BrowserHistory from "../BrowserHistory";
import Login from "./Login";
import Register from "./Register";
import Account from "./Account";

// Main navigation class
class Navigation extends React.Component {
  // Set the default states of variables
  state = {
    collapsed: false,
    modal1: false,
    modal2: false,
    modal3: false,
    authenticated: false,
  };

  // Function that, when called, will change the state of a bootstrap modal depending on the number (nr) that is passed into it.
  toggle = (nr) => () => {
    let modalNumber = "modal" + nr;
    this.setState({
      [modalNumber]: !this.state[modalNumber],
    });
  };

  // Function that, when called, will handle the collapsing of the navigation bar.
  handleTogglerClick = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  // Function that will only run ONCE when the component is mounted. Similar to the useEffect() in a functional component.
  // Due to the nature of what React does, i.e. constantly re-rendering components infinitely, the below is only needed to run once
  // once the component has been loaded.
  componentDidMount() {
    // GET call to the backend to check if the user is authenticated.
    Axios.get("http://localhost:3001/auth", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    }).then((response) => {
      // If the user is authenticated, then set the state above to reflect this.
      if (response.data.authenticated) {
        this.setState({ authenticated: true });
      }
    });
  }

  // Function that, when called, will clear the players local storage (i.e. removing their authentication token) and then refresh the webpage so they no longer have access to account-related privileges.
  logout = () => {
    localStorage.clear();
    window.location.reload(false);
  };

  // Main rendering component
  render() {
    const overlay = (
      <div
        id="sidenav-overlay"
        style={{ backgroundColor: "transparent" }}
        onClick={this.handleTogglerClick}
      />
    );
    return (
      <>
        <div id="navigation">
          <Router history={BrowserHistory}>
            <Switch>
              <div>
                <MDBNavbar
                  color="special-color-dark"
                  dark
                  expand="md"
                  fixed="top"
                  scrolling
                >
                  <MDBContainer>
                    <MDBNavbarBrand>
                      <strong className="white-text">AC31009 Coursework</strong>
                    </MDBNavbarBrand>
                    <MDBNavbarToggler onClick={this.handleTogglerClick} />
                    <MDBCollapse isOpen={this.state.collapsed} navbar>
                      {/* Items that will appear on the LEFT of the navigation bar. */}
                      <MDBNavbarNav left>
                        <MDBNavItem>
                          <MDBNavLink to="/">Home</MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem>
                          <MDBNavLink to="/game">Game</MDBNavLink>
                        </MDBNavItem>
                      </MDBNavbarNav>
                      {/* Items that will appear on the RIGHT of the navigation bar */}
                      <MDBNavbarNav right>
                        {/* If the user doesn't have an authenticated state attached to them (i.e. they are NOT logged in) then they are shown the register/login buttons */}
                        {!this.state.authenticated ? (
                          <>
                            <MDBBtn color="primary" onClick={this.toggle(1)}>
                              Login
                            </MDBBtn>
                            <MDBBtn color="primary" onClick={this.toggle(2)}>
                              Register
                            </MDBBtn>
                          </>
                        ) : (
                          // If the user is authenticated (i.e. the authenticated state is set to true)
                          <>
                            {/* Then show the account-specific buttons that will only show to logged in players. */}
                            <MDBBtn color="primary" onClick={this.toggle(3)}>
                              Your Account
                            </MDBBtn>

                            {/* When the log out button is clicked on, the log out function is run. */}
                            <MDBBtn color="danger" onClick={this.logout}>
                              Log Out
                            </MDBBtn>
                          </>
                        )}
                      </MDBNavbarNav>
                    </MDBCollapse>
                  </MDBContainer>
                </MDBNavbar>
                {this.state.collapsed && overlay}
              </div>
            </Switch>
          </Router>
        </div>
        {/* Login Modal */}
        <MDBModal isOpen={this.state.modal1} toggle={this.toggle(1)}>
          <MDBModalHeader toggle={this.toggle(1)}>Account Login</MDBModalHeader>
          <Login />
        </MDBModal>
        {/* Register Modal */}
        <MDBModal isOpen={this.state.modal2} toggle={this.toggle(2)}>
          <MDBModalHeader toggle={this.toggle(2)}>
            Account Register
          </MDBModalHeader>
          <Register />
        </MDBModal>
        {/* Account Modal */}
        <MDBModal isOpen={this.state.modal3} toggle={this.toggle(3)}>
          <MDBModalHeader toggle={this.toggle(3)}>Your Account</MDBModalHeader>
          <Account />
        </MDBModal>
      </>
    );
  }
}

export default Navigation;
