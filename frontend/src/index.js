import React from "react";
//import "bootstrap/dist/css/bootstrap.min.css"; //REMOVE THIS
import "./assets/css/argon-dashboard-react.css";
import "./assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { createRoot } from "react-dom/client";
import "./assets/styles/index.css";
//import App from "./components/App";
import reportWebVitals from "./reportWebVitals";

//import { CreatorForm } from "./components/CreatorForm";

import AuthLayout from "./layouts/Auth.js";

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <Switch>
      <Route path="/auth" render={(props) => <AuthLayout {...props} />} />
      <Redirect from="/" to="/auth" />
    </Switch>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
