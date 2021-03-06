import React from "react";
import { createRoot } from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import AdminLayout from "./components/AdminLayout";

//css and other stylesheets
import "./assets/css/argon-dashboard-react.css";
import "./assets/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

//Fix for web3 issue with create-react-app >v5
import "./polyfill.js";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <Switch>
      <Route
        path="/admin/index"
        render={(props) => <AdminLayout {...props} />}
      />
      <Redirect from="*" to="/admin/index" />
    </Switch>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
