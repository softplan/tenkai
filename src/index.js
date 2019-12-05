import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import * as reducers from './stores/reducers';

import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/animate.min.css';
import './assets/sass/light-bootstrap-dashboard-react.scss?v=1.3.0';
import './assets/css/demo.css';
import './assets/css/pe-icon-7-stroke.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faEdit, faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';

import AdminLayout from 'layouts/Admin.jsx';

library.add(faEdit);
library.add(faMinusCircle);
library.add(faWindowClose);

const store = createStore(combineReducers(reducers), applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route path="/admin" render={props => <AdminLayout {...props} />} />
        <Redirect from="/" to="/admin/deployment" />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
