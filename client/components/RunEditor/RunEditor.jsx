import React from 'react'
import EventCreator from '../EventCreator/EventCreator.jsx'

import api from '../../services/api/api.js'

export default class RunEditor extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      run: undefined
    };

    ([
      'fetchRun',
      'renderRun',
      'onNewEventClick',
      'cancelCreateEvent',
      'eventCreateComplete'
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
      <div className="runEditor__runControls">
        <button onClick={this.onNewEventClick}><i className="fas fa-plus"></i> New Event</button>
      </div>
      {this.state.run === undefined ? (
        <div className="runEditor__loader">
          <i className="fas fa-sync fa-spin"></i>
        </div>
      ) : this.renderRun()}
      <EventCreator active={this.state.eventCreatorActive} run={this.state.run} cancel={this.cancelCreateEvent} complete={this.eventCreateComplete}/>
    </div>)
  }

  renderRun(){
    return (
      <div className="runEditor__eventList">
        {this.state.run.events.map((event)=>{
          return (
            <div key={event.id} className="runEditor__event m-1">
              Event
              <br/><code>{JSON.stringify(event)}</code>
            </div>
          );
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

  onNewEventClick(){
    //do the thing
    this.setState({
      eventCreatorActive: true
    })
  }

  cancelCreateEvent(){
    this.setState({
      eventCreatorActive: false
    })
  }

  eventCreateComplete(){
    this.setState({
      eventCreatorActive: false
    }, ()=>{
      this.fetchRun();
    })
  }
}