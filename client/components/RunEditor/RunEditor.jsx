import React from 'react'
import EventCreator from '../EventCreator/EventCreator.jsx'

import api from '../../services/api/api.js'

export default class RunEditor extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      run: undefined,
      runEvents: undefined
    };

    ([
      'fetchRun',
      'fetchRunEvents',
      'renderRun',
      'onNewEventClick',
      'cancelCreateEvent',
      'eventCreateComplete'
    ]).forEach((funcName)=>{
      this[funcName] = this[funcName].bind(this)
    })
  }

  componentDidMount(){
    let run;
    this.fetchRun(this.props.match.params.id)
    .then((fetchedRun)=>{
      run = fetchedRun
      return this.fetchRunEvents(run.id)
    })
    .then((events)=>{
      this.setState({
        run,
        runEvents: events
      })
    })
    .catch((error)=>{
      console.error(error)
    })
  }

  render(){
    return (<div className="runEditor">
      I am a run editor I guess, ID: {this.props.match.params.id}
      <div className="runEditor__runControls">
        <button onClick={this.onNewEventClick}><i className="fas fa-plus"></i> New Event</button>
      </div>
      {this.state.run === undefined || this.state.runEvents === undefined ? (
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
        {this.state.runEvents.map((event)=>{
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
    return api.fetch(`/runs/${runId}`, {
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    })
  }

  fetchRunEvents(runId){
    return api.fetch(`/runs/${runId}/events`, {
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      }
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
    this.fetchRunEvents(this.state.run.id)
    .then((events)=>{
      this.setState({
        eventCreatorActive: false,
        runEvents: events
      })
    })
  }
}