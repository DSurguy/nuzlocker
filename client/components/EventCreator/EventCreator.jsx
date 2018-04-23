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
      formData: {
        currentPage: 0,
        pages: []
      }
    };

    ([
      'renderModalContent',
      'renderEventTypePage',
      'renderEventDataPage',
      'onEventPageSubmit',
      'onEventPageCancel'
    ]).forEach((funcName)=>{
      this[funcName] = this[funcName].bind(this);
    })
  }

  render(){
    return (
      <NzModal show={this.props.active} className="eventCreator">
        {this.renderModalContent()}
      </NzModal>
    )
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
  onEventPageSubmit(pageFormData){
    let nextFormData = _.extend({}, this.state.formData);
    nextFormData[this.state.formData.currentPage] = pageFormData;
    nextFormData.currentPage++;
    this.setState({
      formData: nextFormData
    });
  }
  onEventPageCancel(pageFormData){
    let nextFormData = _.extend({}, this.state.formData);
    nextFormData[this.state.formData.currentPage] = pageFormData;
    nextFormData.currentPage--;
    this.setState({
      formData: nextFormData
    });
  }
}

