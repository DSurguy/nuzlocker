import React from 'react'

import api from '../../services/api/api.js'

export default class RunEditor extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      run: undefined
    };

    ([
      'fetchRun',
      'renderRun'
    ]).forEach((funcName)=>{
      this[funcName] = this[funcName].bind(this)
    })
  }

  componentDidMount(){
    this.fetchRun(this.props.match.params.id);
  }

  render(){
    return (<div className="runEditor">
      I am a run editor I guess, ID: {this.props.match.params.id}
      {this.state.run === undefined ? (
        <div className="runEditor__loader">
          <i className="fas fa-sync fa-spin"></i>
        </div>
      ) : this.renderRun()}
    </div>)
  }

  renderRun(){
    return (
      <div className="runEditor__eventList">
        {this.state.run.events.map((event)=>{
          return (<div className="runEditor__event">I AM EVENT</div>);
        })}
      </div>
    )
  }

  fetchRun(runId){
    api.fetch(`/runs/${runId}`, {
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    })
    .then((run)=>{
      this.setState({
        run: run
      })
    })
    .catch((err)=>{
      console.error(err);
    })
  }
}