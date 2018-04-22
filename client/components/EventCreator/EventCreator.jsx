import React from 'react'
import NzModal from '../shared/NzModal/NzModal.jsx'
import EventEncounterForm from '../EventDataForms/EventEncounterForm/EventEncounterForm.jsx'

import './EventCreator.scss';

export default class EventCreator extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      formData: {
        currentPage: 0
      }
    };

    ([
      'renderModalContent',
      'renderEventTypePage',
      'onEventTypePageSubmit',
      'renderEventDataPage',
      'onEventDataPageSubmit'
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
      {types.map((type)=>{
        return (<div key={type.id} className="eventCreator__typePage__type" onClick={this.onEventTypePageSubmit.bind(this, [type.id])}>
          <h5>{type.label}</h5>
          <p>{type.description}</p>
        </div>)
      })}
    </div>)
  }
  onEventTypePageSubmit(typeId){
    this.setState({
      formData: {
        0: {
          eventType: typeId
        },
        currentPage: 1
      }
    })
  }

  renderEventDataPage(){
    let typeFormMap = {
      0: (<EventEncounterForm onSubmit={this.onEventDataPageSubmit}/>)
    }
    return (
      <div className="eventCreator__dataPage">
        {typeFormMap[this.state.formData[0].eventType]}
      </div>
    )
  }
  onEventDataPageSubmit(eventData){

  }
}

