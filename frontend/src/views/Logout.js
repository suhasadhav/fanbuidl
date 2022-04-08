/*!

=========================================================
* Argon Dashboard React - v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import React from "react";
import { Redirect } from "react-router-dom";

export class Logout extends React.Component {
  initialState = {
    selectedAddress: undefined,
    networkError: undefined,
    loggedIn: false,
  };
  componentDidMount() {
    this.setState(this.initialState);
    localStorage.setItem("isWalletConnected", false);
  }
  render() {
    return <Redirect to="/auth/login" />;
  }
}

export default Logout;
