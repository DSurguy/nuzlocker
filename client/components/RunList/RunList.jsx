import React from 'react'
import { Route, Link } from "react-router-dom"

import RunEditor from '../RunEditor/RunEditor.jsx'

export default class RunList extends React.Component{
  constructor(props){
    super(props);

    this.state = {};

    ([
      'renderContent'
    ]).forEach((funcName)=>{
      this[funcName] = this[funcName].bind(this)
    })
  }

  render(){
    return (<div className="runList">
      <div className="runList__controls">
        <button type="button"><i className="fas fa-plus"></i> New Run</button>
      </div>
      <div className="runList__runs">
        <Route exact path={`${this.props.match.url}`} render={this.renderContent}/>
        <Route path={`${this.props.match.url}/:id`} component={RunEditor}/>
      </div>
    </div>)
  }

  renderContent(){
    return (<div className="runList__dummy">
      THIS IS DUMMY RUN LIST
    </div>)
  }
}