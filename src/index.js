import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/sass/light-bootstrap-dashboard-react.scss?v=1.3.0";
import "./assets/css/demo.css";
import "./assets/css/pe-icon-7-stroke.css";

import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit, faWindowClose } from '@fortawesome/free-solid-svg-icons'
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons'


import AdminLayout from "layouts/Admin.jsx";

library.add(faEdit)
library.add(faMinusCircle)
library.add(faWindowClose)



ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/admin" render={props => <AdminLayout {...props} />} />
      <Redirect from="/" to="/admin/workload" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
