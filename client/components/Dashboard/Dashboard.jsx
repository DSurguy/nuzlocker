import React from 'react'
import { BrowserRouter, Route, Link } from "react-router-dom"

import SideMenu from '../SideMenu/SideMenu.jsx'
import AuthedHeader from '../AuthedHeader/AuthedHeader.jsx'
import RunList from '../RunList/RunList.jsx'

export default class Dashboard extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      menuOpen: false
    };

    ([]).forEach((funcName)=>{
      this[funcName] = this[funcName].bind(this)
    })
  }

  render(){
    return (<BrowserRouter>
      <div className="dashboard">
        <AuthedHeader />
        <SideMenu />
        <div className="pageContent">
          <Route path="/dashboard" component={DashboardContent} />
          <Route path="/runs" component={RunList} />
        </div>
      </div>
    </BrowserRouter>)
  }
}

function DashboardContent(){
  return (<React.Fragment>I AM DASHBOARD CONTENT</React.Fragment>)
}