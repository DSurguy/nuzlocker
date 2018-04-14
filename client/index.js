import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './components/Dashboard/Dashboard.jsx';

import './static/font-awesome/scss/fontawesome.scss';
import './static/font-awesome/scss/fa-solid.scss';

ReactDOM.render(
  <div className="container">
    <Dashboard />
  </div>,
  document.getElementById('root')
);