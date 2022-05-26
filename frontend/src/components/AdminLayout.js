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
import { Route, Switch, Redirect } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";

// Custom components
import Navbar from "./Navbar.js";
import Footer from "./Footer.js";
import Sidebar from "./Sidebar.js";
import routes from "../routes.js";

const AdminLayout = (props) => {
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

  return (
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
        <Navbar {...props} />
        <Switch>
          {getRoutes(routes)}
          <Redirect from="*" to="/admin/index" />
        </Switch>
        <Container fluid>
          <Footer />
        </Container>
      </div>
    </>
  );
};

export default AdminLayout;
