import React from 'react'

import './AuthedHeader.scss';

export default class AuthedHeader extends React.Component{
  constructor(props){
    super(props);

    this.state = {};

    ([]).forEach((funcName)=>{
      this[funcName] = this[funcName].bind(this)
    })
  }

  render(){
    return (<div className="authedHeader">
      Yo this is a header and you are logged in sdfsdfsd
      <button onClick={this.props.toggleMenu}>Open/Close Menu</button>
    </div>)
  }
}