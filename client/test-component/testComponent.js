import React from 'react';

export default class TestComponent extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div className="testy-test">
        <h1>TEST COMPONENT</h1>
        <p>If you can see this, react is working!</p>
      </div>
    )
  }
}