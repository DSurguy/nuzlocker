import React from 'react';
import ReactDOM from 'react-dom';
import TestComponent from './test-component/testComponent.js'

ReactDOM.render(
  <React.Fragment>
    <h1>Hello, world!</h1>
    <TestComponent/>
  </React.Fragment>,
  document.getElementById('root')
);