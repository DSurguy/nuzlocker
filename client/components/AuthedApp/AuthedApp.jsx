import React from 'react'
import { Route, Link } from "react-router-dom"

import SideMenu from '../SideMenu/SideMenu.jsx'
import AuthedHeader from '../AuthedHeader/AuthedHeader.jsx'
import RunList from '../RunList/RunList.jsx'

export default class AuthedApp extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      menuOpen: false,
      authCheckComplete: false
    };

    ([]).forEach((funcName)=>{
      this[funcName] = this[funcName].bind(this)
    })
  }

  componentDidMount(){
    fetch('http://localhost:5000/api/v1/login', {
      body: JSON.stringify({}),
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    })
    .then(response=>{
      if( response.ok ){
        this.setState({
          authCheckComplete: true
        })
      }
    })
    .catch((err)=>{
      console.error(err);
    });
  }

  render(){
    if( !this.state.authCheckComplete ) return null;
    return (<div className="authedApp">
      <AuthedHeader />
      <SideMenu is-open={this.state.menuOpen} />
      <div className="pageContent container">
        {/* we omit the '/' because that's the base path here */}
        <Route exact path={`${this.props.match.url}dashboard`} component={AuthedAppContent} />
        <Route path={`${this.props.match.url}runs`} component={RunList} />
      </div>
    </div>)
  }
}

function AuthedAppContent(){
  return (<React.Fragment>I AM DASHBOARD CONTENT</React.Fragment>)
}