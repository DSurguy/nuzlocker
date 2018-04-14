import React from 'react'

export default class SideMenu extends React.Component{
  constructor(props){
    super(props);

    this.state = {};

    ([]).forEach((funcName)=>{
      this[funcName] = this[funcName].bind(this)
    })
  }

  render(){
    return (<div className="sidemenu">

    </div>)
  }
}