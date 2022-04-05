import React from "react";
import "../assets/styles/App.css";
import { Row, Col } from "react-bootstrap";
import { ConnectWallet } from "./ConnectWallet";
import { Navigation } from "./Navigation";
//import { useState, setState } from "react";

const NETWORK_ID = "31337";

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
      selectedAddress: undefined,
      networkError: undefined,
    };

    this.state = this.initialState;
  }

  _initialize(userAddress) {
    // This method initializes the dapp
    this.setState({
      selectedAddress: userAddress,
    });
    localStorage.setItem('isWalletConnected', true);
  }

  // Check if correct network is selected or not
  _checkNetwork() {
    console.log(window.ethereum.networkVersion);
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
    localStorage.setItem('isWalletConnected', false);
  }

  // This method just clears part of the state.
  _dismissNetworkError() {
    this.setState({ networkError: undefined });
  }

  async _connectWallet() {
    const { ethereum } = window;
    const walletConnected = localStorage.getItem('isWalletConnected');
    if (!ethereum) {
      alert("No wallet found");
    } else {
      try {
        if(!walletConnected){
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

componentDidMount(){
  if (localStorage.getItem('isWalletConnected') === 'true') {
    try {
      this._connectWallet();
      localStorage.setItem('isWalletConnected', true);
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
        <ConnectWallet
          connectWallet={() => this._connectWallet()}
          networkError={this.state.networkError}
          dismiss={() => this._dismissNetworkError()}
        />
      );
    }

    // If everything is loaded, we render the application.
    return (
      <div className="container">
        <Navigation ></Navigation>
        <Row className="mx-0">
          <Col xs={5}>
            
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
