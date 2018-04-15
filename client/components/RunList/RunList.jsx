import React from 'react'
import { Route, Link } from "react-router-dom"

import RunEditor from '../RunEditor/RunEditor.jsx'
import NzModal from '../shared/NzModal/NzModal.jsx'

import api from '../../services/api/api.js'

import merge from 'lodash/merge'
let _ = {
  merge
}

export default class RunList extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      runs: [],
      newRun: {
        modalOpen: false,
        formData: {
          name: '',
          game: ''
        }
      }
    };

    ([
      'renderContent',
      'onNewRunButtonClick',
      'onNewRunFormSubmit',
      'newRunFormValid',
      'onNewRunFormElementChange',
      'getUpdatedRunList'
    ]).forEach((funcName)=>{
      this[funcName] = this[funcName].bind(this)
    })
  }

  componentDidMount(){
    this.getUpdatedRunList();
  }

  render(){
    return (<div className="runList">
      <div className="runList__controls">
        <button type="button" className="btn btn-primary" onClick={this.onNewRunButtonClick}><i className="fas fa-plus"></i> New Run</button>
      </div>
      <div className="runList__runs">
        <Route exact path={`${this.props.match.url}`} render={this.renderContent}/>
        <Route path={`${this.props.match.url}/:id`} component={RunEditor}/>
      </div>
      <NzModal show={this.state.newRun.modalOpen} className="runList__createModal">
        <h2>Create New Run</h2>
        <form onSubmit={this.onNewRunFormSubmit}>
          <div className="form-group">
            <label>Run Name</label>
            <input type="text" className="form-control" name="name" onChange={this.onNewRunFormElementChange} value={this.state.newRun.formData.name}/>
          </div>
          <div className="form-group">
            <label>Game</label>
            <select className="form-control" name="game" onChange={this.onNewRunFormElementChange} value={this.state.newRun.formData.game}>
              <option value="">Select A Game</option>
              <option value="0">Red</option>
              <option value="1">Blue</option>
            </select>
          </div>
          <div className="form-group">
            <button className="btn btn-primary float-right" disabled={!this.newRunFormValid()}>Submit</button>
          </div>
        </form>
      </NzModal>
    </div>)
  }

  renderContent(){
    return (<div className="runList__runs">
      {this.state.runs.map((run)=>{
        return (<div key={run.id} className="runList__run">
          {run.name} - game:{run.game}
        </div>)
      })}
    </div>)
  }

  /**
   * Helpers
   */

  getUpdatedRunList(){
    api.fetch('/runs', {
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    })
    .then((runs)=>{
      this.setState({
        runs: runs
      })
    })
    .catch((err)=>{
      console.error(err);
    })
  }

  newRunFormValid(){
    return this.state.newRun.formData.name
    && this.state.newRun.formData.game
  }

  /**
   * Events
   */

  onNewRunButtonClick(e){
    this.setState(_.merge({}, this.state, {
      newRun: {
        modalOpen: true
      }
    }));
  }

  onNewRunFormElementChange(e){
    this.setState(_.merge({}, this.state, {
      newRun: {
        formData: {
          [e.target.name]: e.target.value
        }
      }
    }));
  }
  
  onNewRunFormSubmit(e){
    e.preventDefault();
    api.fetch('/run', {
      method: 'POST',
      body: this.state.newRun.formData,
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    })
    .then(()=>{
      this.getUpdatedRunList()
    })
    .catch((err)=>{
      console.error(err);
    })
  }
}