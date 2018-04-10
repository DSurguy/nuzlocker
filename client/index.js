import React from 'react';
import ReactDOM from 'react-dom';
import EventFeed from './components/EventFeed/EventFeed.jsx';

import './static/font-awesome/scss/fontawesome.scss';
import './static/font-awesome/scss/fa-solid.scss';

ReactDOM.render(
  <div className="container">
    <EventFeed/>
  </div>,
  document.getElementById('root')
);