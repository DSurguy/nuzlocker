import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import AuthedApp from './components/AuthedApp/AuthedApp.jsx';
import Login from './components/Login/Login.jsx';
import HomePage from './components/HomePage/HomePage.jsx';

import './static/font-awesome/scss/fontawesome.scss';
import './static/font-awesome/scss/fa-solid.scss';

ReactDOM.render(<BrowserRouter><Switch>
  <Route path="/login" component={Login} />
  <Route exact path="/" component={HomePage} />
  <Route path="/" component={AuthedApp} />
</Switch></BrowserRouter>,
  document.getElementById('root')
);