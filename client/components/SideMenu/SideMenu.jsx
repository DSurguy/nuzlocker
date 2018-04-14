import React from 'react'

import './SideMenu.scss';

export default class SideMenu extends React.Component{
  constructor(props){
    super(props);

    this.state = {};

    ([]).forEach((funcName)=>{
      this[funcName] = this[funcName].bind(this)
    })
  }

  render(){
    return (<div className="SideMenu">

    </div>)
  }
}