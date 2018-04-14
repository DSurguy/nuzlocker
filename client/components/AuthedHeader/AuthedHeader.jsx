import React from 'react'

export default class AuthedHeader extends React.Component{
  constructor(props){
    super(props);

    this.state = {};

    ([]).forEach((funcName)=>{
      this[funcName] = this[funcName].bind(this)
    })
  }

  render(){
    return (<div className="header">
      Yo this is a header and you are logged in
    </div>)
  }
}