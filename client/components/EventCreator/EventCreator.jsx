import React from 'react';
import find from 'lodash/find';
import each from 'lodash/each';
import extend from 'lodash/extend';
import upperFirst from 'lodash/upperFirst';
import get from 'lodash/get';
import POKEMON from '../../data/pokemon.json';
let _ = {
  find,
  each,
  extend,
  upperFirst,
  get
};
import fetch from 'better-fetch';

import NzModal from '../shared/NzModal/NzModal.jsx';
import './EventCreator.scss';

/**
 * Statics
 */

const OUTCOMES = [
  'defeated',
  'escaped',
  'ran away',
  'captured'
];

export default class EventCreator extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      eventType: this.props.eventTypes[0],
      optionsRoutes: [],
      optionsPokemon: POKEMON,
      optionsOutcomes: OUTCOMES,
      newEventData: {},
      showCreateModal: false,
      modalSaving: false
    }

    _.each([
      'onChangeTypeSelect',
      'onClickCreateButton',
      'renderModalContent',
      'modalOnChangePokemon',
      'modalOnChangeRoute',
      'modalOnChangeOutcome',
      'modalOnChangeNickname',
      'modalOnSubmit',
      'initState'
    ], (funcName)=>{
      this[funcName] = this[funcName].bind(this);
    })
  }

  initState(){
    return new Promise((resolve) => {
      this.setState({
        eventType: this.props.eventTypes[0],
        optionsRoutes: [],
        optionsPokemon: POKEMON,
        optionsOutcomes: OUTCOMES,
        newEventData: {},
        showCreateModal: false,
        modalSaving: false
      }, resolve);
    })
  }

  componentDidMount(){
    fetch('http://localhost:5000/api/v1/routes', {
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    })
    .then(response=>response.json())
    .then((jsonData)=>{
      this.setState({
        optionsRoutes: jsonData
      })
    })
    .catch((err)=>{
      console.error(err);
    });
  }

  render(){
    return (
      <div className="eventCreator">
        {/* <div className="row mb-1">
          <select className="form-control" onChange={this.onChangeTypeSelect}>
            {this.props.eventTypes.map((type)=>{
              return (<option key={type.id} value={type.id}>{type.label}</option>)
            })}
          </select>
        </div>
        <div className="row">
          <div className="clearfix">
            <button className="btn btn-default" onClick={this.onClickCreateButton}>Create new {this.state.eventType.label}</button>
          </div>
        </div> */}
        <div className="row">
          <div className="clearfix">
            <button className="btn btn-primary" onClick={this.onClickCreateButton}>Create new {this.state.eventType.label}</button>
          </div>
        </div>
        <NzModal show={this.state.showCreateModal} className="eventCreator-modal">
          {this.state.showCreateModal ? this.renderModalContent():null}
        </NzModal>
      </div>
    )
  }

  /**
   * Renderers
   */
  renderModalContent(){
    let submitEnabled = (
      this.state.newEventData.pokemon 
        && _.get(this.state.newEventData.pokemon, 'id', -1) !== -1
        && _.get(this.state.newEventData.pokemon, 'metadata.nickname')
      && _.get(this.state.newEventData, 'routeId', -1) !== -1
      && _.get(this.state.newEventData, 'outcome', -1) !== -1
    )
    return (<React.Fragment>
      <h2>Create New {this.state.eventType.label}</h2>
      {this.state.modalSaving ? 
        <div className="modal-submit-overlay"><i className="fas fa-sync fa-spin"></i></div>
        : null
      }
      <form onSubmit={this.modalOnSubmit}>
        <div className="form-group">
          <label>Pokemon</label>
          <select className="form-control" onChange={this.modalOnChangePokemon} disabled={this.state.modalSaving}>
            {[(<option key={-1} value={-1}>Select A Pokemon</option>)].concat(this.state.optionsPokemon.map((pokemon)=>{
              return (<option key={pokemon.id} value={pokemon.id}>{pokemon.id} - {pokemon.name}</option>)
            }))}
          </select>
        </div>
        <div className="form-group">
          <label>Route</label>
          <select className="form-control" onChange={this.modalOnChangeRoute} disabled={this.state.modalSaving}>
            {[(<option key={-1} value={-1}>Select A Route</option>)].concat(this.state.optionsRoutes.map((route)=>{
              return (<option key={route.id} value={route.id}>{route.id} - {route.name}</option>)
            }))}
          </select>
        </div>
        <div className="form-group">
          <label>Outcome</label>
          <select className="form-control" onChange={this.modalOnChangeOutcome} disabled={this.state.modalSaving}>
            {[(<option key={-1} value={-1}>Select An Outcome</option>)].concat(this.state.optionsOutcomes.map((outcome, index)=>{
              return (<option key={index} value={outcome}>{_.upperFirst(outcome)}</option>)
            }))}
          </select>
        </div>
        <div className="form-group">
          <label>Pokemon Nickname</label>
          <input type="text" className="form-control" onChange={this.modalOnChangeNickname}  disabled={this.state.modalSaving}/>
        </div>
        <div className="form-group">
          <button disabled={!submitEnabled||this.state.modalSaving} className="form-control pull-right btn btn-success" type="submit">Save {this.state.eventType.label}</button>
        </div>
      </form>
      <div>
        <label>Post Object: </label>
        <br/><code>{JSON.stringify(this.state.newEventData)}</code>
      </div>
    </React.Fragment>);
  }

  /**
   * Event Handlers
   */
  onChangeTypeSelect(event){
    let newEventType = _.find(this.props.eventTypes, {id: event.target.value});
    this.setState({
      eventType: newEventType
    })
  }

  onClickCreateButton(){
    this.setState({
      showCreateModal: true
    })
  }

  /**
   * Modal Event Handlers
   */
  modalOnChangePokemon(event){
    this.setState({
      newEventData: _.extend(this.state.newEventData, {
        pokemon: _.extend(this.state.newEventData.pokemon, {
          id: event.target.value == -1 ? undefined : event.target.value
        })
      })
    })
  }

  modalOnChangeRoute(event){
    this.setState({
      newEventData: _.extend(this.state.newEventData, {
        routeId: event.target.value == -1 ? undefined : event.target.value
      })
    })
  }

  modalOnChangeOutcome(event){
    this.setState({
      newEventData: _.extend(this.state.newEventData, {
        outcome: event.target.value == -1 ? undefined : event.target.value
      })
    })
  }

  modalOnChangeNickname(event){
    this.setState({
      newEventData: _.extend(this.state.newEventData, {
        pokemon: _.extend(this.state.newEventData.pokemon||{}, {
          metadata: _.extend((this.state.newEventData.pokemon||{}).metadata||{}, {
            nickname: event.target.value
          })
        })
      })
    })
  }

  modalOnSubmit(event){
    event.preventDefault();
    this.setState({
      modalSaving: true
    })
    fetch('http://localhost:5000/api/v1/encounter', {
      body: JSON.stringify(this.state.newEventData),
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    })
    .then(response=>{
      if( response.ok ){
        this.props.updateEventList()
        .then(this.initState);
      }
    })
    .catch((err)=>{
      console.error(err);
    });
  }
}

