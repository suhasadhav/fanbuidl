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

// reactstrap components
import { Button, Card, CardBody } from "reactstrap";

import { NETWORK_ID } from "../components/constants";

import React from "react";
import { Col } from "react-bootstrap";
import { Redirect } from "react-router-dom";
//import { useState, setState } from "react";

export class Login extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
      selectedAddress: undefined,
      networkError: undefined,
    };

    this.state = this.initialState;
  }
  // This method initializes the dapp
  _initialize(userAddress) {
    this.setState({
      selectedAddress: userAddress,
    });
    localStorage.setItem("isWalletConnected", true);
  }

  // Check if correct network is selected or not
  _checkNetwork() {
    if (window.ethereum.networkVersion === NETWORK_ID) {
      return true;
    }

    this.setState({
      networkError: "Please connect your wallet to NETWORK ID: " + NETWORK_ID,
    });

    return false;
  }

  // This method resets the state
  _resetState() {
    this.setState(this.initialState);
    localStorage.setItem("isWalletConnected", false);
  }

  // This method just clears part of the state.
  _dismissNetworkError() {
    this.setState({ networkError: undefined });
  }

  async _connectWallet() {
    const { ethereum } = window;
    const walletConnected = localStorage.getItem("isWalletConnected");
    if (!ethereum) {
      alert("No wallet found");
    } else {
      try {
        if (!walletConnected) {
          if (!this._checkNetwork()) {
            return;
          }
        }
        const [selectedAddress] = await ethereum.request({
          method: "eth_requestAccounts",
        });
        this._initialize(selectedAddress);
        // We reinitialize it whenever the user changes their account.
        window.ethereum.on("accountsChanged", ([newAddress]) => {
          // `accountsChanged` event can be triggered with an undefined newAddress.
          // This happens when the user removes the Dapp from the "Connected
          // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
          // To avoid errors, we reset the dapp state
          if (newAddress === undefined) {
            return this._resetState();
          }

          this._initialize(newAddress);
        });

        // We reset the dapp state if the network is changed
        window.ethereum.on("chainChanged", ([networkId]) => {
          //this._stopPollingData();
          this._resetState();
        });
      } catch (err) {
        console.log(err);
      }
    }
  }

  componentDidMount() {
    if (localStorage.getItem("isWalletConnected") === "true") {
      try {
        this._connectWallet();
        localStorage.setItem("isWalletConnected", true);
      } catch (ex) {
        console.log(ex);
      }
    }
  }

  render() {
    // Ethereum wallets inject the window.ethereum object. If it hasn't been
    // injected, we instruct the user to install MetaMask.
    if (window.ethereum === undefined) {
      console.log("No wallet detected!");
      //return <NoWalletDetected />;
    }

    if (!this.state.selectedAddress) {
      return (
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-5 py-lg-5">
              <div className="text-center">
                <Button
                  className="my-4"
                  color="primary"
                  type="button"
                  onClick={() => this._connectWallet()}
                >
                  Connect your Wallet
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      );
    }

    // If everything is loaded, we render the application.
    return <Redirect to="/admin" />;
  }
}

export default Login;
