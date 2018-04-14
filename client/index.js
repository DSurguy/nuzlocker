import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Dashboard from './components/Dashboard/Dashboard.jsx';
import Login from './components/Login/Login.jsx';

import './static/font-awesome/scss/fontawesome.scss';
import './static/font-awesome/scss/fa-solid.scss';

ReactDOM.render(<BrowserRouter><Switch>
  <Route path="/login" component={Login} />
  <Route path="/" component={Dashboard} />
</Switch></BrowserRouter>,
  document.getElementById('root')
);