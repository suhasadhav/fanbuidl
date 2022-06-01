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
import React, { useEffect, useState } from "react";
//import { Route, Switch, Redirect } from "react-router-dom";
import { Route } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";

// Custom components
import Navbar from "./Navbar.js";
import Footer from "./Footer.js";
import Sidebar from "./Sidebar.js";
import routes from "../routes.js";

import WalletConnect from "./WalletConnect.js";
import Dashboard from "./Dashboard.js";

const AdminLayout = (props) => {
  const [accounts, setAccounts] = useState([]);
  const { ethereum } = window;
  const isMetaMaskConnected = () => accounts && accounts.length > 0;
  const isMetaMaskInstalled = () => Boolean(ethereum && ethereum.isMetaMask);

  const mainContent = React.useRef(null);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  // Connect to wallet on click
  const onClickConnect = async () => {
    if (isMetaMaskInstalled()) {
      console.log("Called onclickconnect");
      try {
        const newAccounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log(newAccounts);
        handleNewAccounts(newAccounts);
      } catch (error) {
        if (error.code === 4001) {
          console.log("Please connect to MetaMask.");
        } else {
          console.error(error);
        }
      }
    } else {
      alert("Please install Metamask wallet");
    }
  };

  // Whenever new account is selected
  function handleNewAccounts(newAccounts) {
    console.log("Handling new accounts: " + newAccounts);
    setAccounts(newAccounts);
    if (isMetaMaskConnected()) {
      //initializeAccountButtons();
    }
    //updateButtons();
  }

  // This will run everytime page refreshes
  useEffect(() => {
    async function checkConnection() {
      try {
        await ethereum
          .request({
            method: "eth_accounts",
          })
          .then((res) => {
            setAccounts(res);
          });
      } catch (err) {
        console.error("Error on init when getting accounts", err);
      }
    }

    // If metamask is installed
    if (Boolean(ethereum && ethereum.isMetaMask)) {
      ethereum.autoRefreshOnNetworkChange = true;

      //getNetworkAndChainId();
      //ethereum.on("chainChanged", handleNewChain);
      //ethereum.on("networkChanged", handleNewNetwork);
      ethereum.on("accountsChanged", function (newAccounts) {
        console.log("Account changed: " + newAccounts);
        setAccounts(newAccounts);
      });
      checkConnection();
    }
  }, [ethereum]);

  return (
    <>
      {!isMetaMaskConnected() && <WalletConnect onClick={onClickConnect} />}
      {isMetaMaskConnected() && (
        <>
          <Sidebar
            {...props}
            routes={routes}
            logo={{
              innerLink: "/admin/index",
              imgSrc: require("../assets/img/logo.png"),
              imgAlt: "...",
            }}
          />
          <div className="main-content" ref={mainContent}>
            <Navbar accounts={accounts} {...props} />
            <Dashboard accounts={accounts} />
            {/*
            <Switch>
              {getRoutes(routes)}
              <Redirect from="*" to="/admin/index" />
            </Switch>
          */}
            <Container fluid>
              <Footer />
            </Container>
          </div>
        </>
      )}
    </>
  );
};

export default AdminLayout;
