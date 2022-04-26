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
import React, { useState } from "react";
import { useLocation, Route, Switch, Redirect } from "react-router-dom";
// reactstrap components
import { Container, Button } from "reactstrap";
// core components
import AdminNavbar from "../components/Navbars/AdminNavbar.js";
import AdminFooter from "../components/Footers/AdminFooter.js";
import Sidebar from "../components/Sidebar/Sidebar.js";
import routes from "../routes.js";

import { NETWORK_ID, NETWORK_NAME } from "../components/constants";
const Admin = (props) => {
  const mainContent = React.useRef(null);
  const [selectedAddress, setSelectedAddress] = useState();
  const { ethereum } = window;

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

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        props.location.pathname.indexOf(routes[i].layout + routes[i].path) !==
        -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  let accounts;
  const isMetaMaskConnected = () => accounts && accounts.length > 0;

  //Created check function to see if the MetaMask extension is installed
  const isMetaMaskInstalled = () => {
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  function handleNewAccounts(newAccounts) {
    accounts = newAccounts;
    if (isMetaMaskConnected()) {
      console.log("MM connected");
      console.log(accounts);
    }
  }

  const onClickConnect = async () => {
    try {
      const newAccounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      handleNewAccounts(newAccounts);
    } catch (error) {
      console.error(error);
    }
  };

  async function getNetworkAndChainId() {
    try {
      const chainId = await ethereum.request({
        method: "eth_chainId",
      });
      handleNewChain(chainId);

      const networkId = await ethereum.request({
        method: "net_version",
      });
    } catch (err) {
      console.error(err);
    }
  }
  function handleNewChain(chainId) {
    console.log("New Chain: " + chainId);
  }

  async function main() {
    if (isMetaMaskInstalled()) {
      ethereum.autoRefreshOnNetworkChange = false;
      getNetworkAndChainId();
      ethereum.on("chainChanged", handleNewChain);
      ethereum.on("accountsChanged", handleNewAccounts);

      try {
        const newAccounts = await ethereum.request({
          method: "eth_accounts",
        });
        handleNewAccounts(newAccounts);
      } catch (err) {
        console.error("Error on init when getting accounts", err);
      }
    }
  }
  main();

  return (
    <>
      <Sidebar
        {...props}
        routes={routes}
        logo={{
          innerLink: "/admin/index",
          imgSrc: require("../assets/img/brand/argon-react.png").default,
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContent}>
        <AdminNavbar
          {...props}
          brandText={getBrandText(props.location.pathname)}
          selectedAddress={selectedAddress}
        />
        <Switch>
          {getRoutes(routes)}
          <Redirect from="*" to="/admin/index" />
        </Switch>
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
};

export default Admin;
