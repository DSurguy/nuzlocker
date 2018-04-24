import React from 'react'
import NzModal from '../shared/NzModal/NzModal.jsx'
import EventEncounterForm from '../EventDataForms/EventEncounterForm/EventEncounterForm.jsx'

import extend from 'lodash/extend';
let _ = {
  extend
}
import api from '../../services/api/api.js'

import './EventCreator.scss';

export default class EventCreator extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      eventType: undefined,
      eventData: {},
      eventDataValidated: false,
      supplementEventType: undefined,
      supplementEventData: {}
    };

    ([
      'renderSectionEventType',
      'renderSectionEventData',
      'onEventTypeChange',
      'onEventDataChange',
      'onEventDataValidationChange',
      'createEvent',
      'cancel'
    ]).forEach((funcName)=>{
      this[funcName] = this[funcName].bind(this);
    })
  }

  render(){
    return (
      <NzModal show={this.props.active} className="eventCreator">
        <form onSubmit={this.createEvent}>
          {this.renderSectionEventType()}
          {this.renderSectionEventData()}
          {this.renderSectionSupplementEventType()}
          {this.renderSectionSupplementEventType()}
          <div className="diag">
            DataValidation: {this.state.eventDataValidated.toString()}
          </div>
          <div>
            <button type="button" onClick={this.cancel} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={!this.state.eventDataValidated}>Submit</button>
          </div>
        </form>
      </NzModal>
    )
  }

  renderSectionEventType(){
    let types = [{
      id: 0,
      label: 'Pokemon Encounter',
      description: 'Encountered a pokemon, in the wild or during a scripted event.'
    // }, {
    //   id: 1,
    //   label: 'Pokemon Update',
    //   description: 'Change the status of one or more pokemon, such as their level, name or if they are alive or dead.'
    }]
    return (
      <div className="eventCreator_eventType">
        <h4>Select An Event Type</h4>
        <select className="form-control" onChange={this.onEventTypeChange}>
          {
            [<option key={-1}>Select an Event Type</option>]
            .concat(
              types.map((type)=>{
                return (<option key={type.id} value={type.id}>{type.label}</option>)
              })
            )
          }
        </select>
      </div>
    )
  }

  renderSectionEventData(){
    if( this.state.eventType === undefined ) return null;
    let EventFormComponent;
    switch(this.state.eventType){
      case 0: EventFormComponent = EventEncounterForm; break;
      default: EventFormComponent = function(){return null}
    }
    return (<EventFormComponent onChange={this.onEventDataChange} updateValidation={this.onEventDataValidationChange} />)
  }
  renderSectionSupplementEventType(){
    return null
  }

  renderSectionSupplementEventData(){
    return null
  }

  onEventTypeChange(e){
    this.setState({
      eventType: parseInt(e.target.value),
      eventData: {}
    })
  }

  onEventDataChange(propName, data){
    return new Promise((resolve)=>{
      this.setState({
        eventData: _.extend({}, this.state.eventData, {
          [propName]: data
        })
      }, ()=>{
        resolve();
      })
    })
  }
  
  onEventDataValidationChange(validationStatus){
    this.setState({
      eventDataValidated: validationStatus
    })
  }

  createEvent(e){
    e.preventDefault();
    api.fetch(`/runs/${this.props.run.id}/events`, {
      method: 'POST',
      body: _.extend({}, {
        eventType: this.state.eventType
      }, this.state.eventData),
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    })
    .then(()=>{
      this.props.complete();
    })
    .catch((err)=>{
      console.error(err);
    })
  }

  cancel(){
    this.props.cancel();
  }
}

