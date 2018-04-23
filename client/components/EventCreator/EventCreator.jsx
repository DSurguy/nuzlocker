import React from 'react'
import NzModal from '../shared/NzModal/NzModal.jsx'
import EventEncounterForm from '../EventDataForms/EventEncounterForm/EventEncounterForm.jsx'

import extend from 'lodash/extend';
let _ = {
  extend
}

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
      'onEventDataValidationChange'
    ]).forEach((funcName)=>{
      this[funcName] = this[funcName].bind(this);
    })
  }

  render(){
    return (
      <NzModal show={this.props.active} className="eventCreator">
        {this.renderSectionEventType()}
        {this.renderSectionEventData()}
        {this.renderSectionSupplementEventType()}
        {this.renderSectionSupplementEventType()}
        <div className="diag">
          DataValidation: {this.state.eventDataValidated.toString()}
        </div>
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

  /**
   * Renderers
   */
  renderModalContent(){
    let pageRenderers = [
      this.renderEventTypePage,
      this.renderEventDataPage
    ]
    return pageRenderers[this.state.formData.currentPage]()
  }

  renderEventTypePage(){
    let types = [{
      id: 0,
      label: 'Pokemon Encounter',
      description: 'Encountered a pokemon, in the wild or during a scripted event.'
    // }, {
    //   id: 1,
    //   label: 'Pokemon Update',
    //   description: 'Change the status of one or more pokemon, such as their level, name or if they are alive or dead.'
    }]

    return (<div className="eventCreator__typePage">
      <h4>Select An Event Type</h4>
      {types.map((type)=>{
        return (<div key={type.id} className="eventCreator__typePage__type" onClick={this.onEventPageSubmit.bind(this, {eventType: type.id})}>
          <h5>{type.label}</h5>
          <p>{type.description}</p>
        </div>)
      })}
    </div>)
  }
  renderEventDataPage(){
    let typeFormMap = {
      0: (<EventEncounterForm initData={this.state.formData[this.state.formData.currentPage]} onSubmit={this.onEventPageSubmit} onCancel={this.onEventPageCancel} />)
    }
    return (
      <div className="eventCreator__dataPage">
        {typeFormMap[this.state.formData[0].eventType]}
      </div>
    )
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
}

