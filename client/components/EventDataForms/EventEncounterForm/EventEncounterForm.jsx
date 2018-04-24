import React from 'react'

import api from '../../../services/api/api.js'
import merge from 'lodash/merge'
let _ = {
  merge
}

import './EventEncounterForm.scss'

export default class EventEncounterForm extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      loaded: false,
      optionsRoutes: [],
      optionsPokemon: [],
      optionsOutcomes: [{
        id: 0,
        name: 'Knock Out'
      }, {
        id: 1,
        name: 'Captured'
      }, {
        id: 2,
        name: 'Escaped'
      }],
      formData: this.props.initData||{}
    };
    
    ([
      'onSubmit',
      'onCancel',
      'fetchRoutes',
      'fetchPokemon',
      'renderRouteSelection',
      'renderPokemonSection',
      'renderOutcomeSelection',
      'onFormElementChange'
    ]).forEach((funcName)=>{
      this[funcName] = this[funcName].bind(this);
    })
  }

  componentDidMount(){
    this.fetchRoutes()
    .then(()=>this.fetchPokemon())
    .then(()=>{
      this.setState({
        loaded: true
      })
    })
  }

  render(){
    return (<div className="eventEncounterForm" onSubmit={this.onSubmit}>
      <h4>Pokemon Encountered!</h4>
      {this.renderRouteSelection()}
      {this.renderOutcomeSelection()}
      {this.renderPokemonSection()}
    </div>)
  }

  renderRouteSelection(){
    return (<div className="form-group row">
      <label className="col-sm-2 col-form-label">Route</label>
      <div className="col-sm-10">
        <select className="form-control" name="routeId" defaultValue={this.state.formData.routeId} onChange={this.onFormElementChange}>
          {[<option key={-1}>Select a route</option>].concat(this.state.optionsRoutes.map((route)=>{
            return (<option key={route.id} value={route.id}>{route.name}</option>)
          }))}
        </select>
      </div>
    </div>)
  }

  renderOutcomeSelection(){
    return (<div className="form-group row">
      <label className="col-sm-2 col-form-label">Outcome</label>
      <div className="col-sm-10">
        <select className="form-control" name="outcomeId" defaultValue={this.state.formData.outcomeId} onChange={this.onFormElementChange}>
          {[<option key={-1}>Select an outcome</option>].concat(this.state.optionsOutcomes.map((outcome)=>{
            return (<option key={outcome.id} value={outcome.id}>{outcome.name}</option>)
          }))}
        </select>
      </div>
    </div>)
  }

  renderPokemonSection(){
    return (<div className="eventEncounterForm__pokemonData">
      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Pokemon</label>
        <div className="col-sm-10">
          <select className="form-control" name="pokemonId" defaultValue={this.state.formData.pokemonId} onChange={this.onFormElementChange}>
            {[<option key={-1}>Select a pokemon</option>].concat(this.state.optionsPokemon.map((pokemon)=>{
              return (<option key={pokemon.id} value={pokemon.id}>{pokemon.name}</option>)
            }))}
          </select>
        </div>
      </div>
      {this.renderPokemonMetadata()}
    </div>)
  }

  renderPokemonMetadata(){
    let controls;
    if( this.state.formData.outcomeId && this.state.formData.pokemonId ){
      if( this.state.formData.outcomeId == 1 ){
        controls = (<React.Fragment>
          <div className="form-group">
            <label>Name your pokemon: </label>
            <input className="form-control" type="text" name="pokemonName" defaultValue={this.state.formData.pokemonName} onChange={this.onFormElementChange}/>
          </div>
          <div className="form-group">
            <label>Pokemon level</label>
            <input className="form-control" type="text" name="pokemonLevel" defaultValue={this.state.formData.pokemonLevel} onChange={this.onFormElementChange}/>
          </div>
        </React.Fragment>)
      }
      else {
        controls = (
          <div className="form-group">
            <label>Pokemon level</label>
            <input className="form-control" type="text" name="pokemonLevel" defaultValue={this.state.formData.pokemonLevel} onChange={this.onFormElementChange}/>
          </div>
        )
      }
    }
    return (
      <div className="eventEncounterForm__pokemonMetadata row">
        <div className="sprite col-sm-6"></div>
        <div className="col-sm-6">
          {controls}
        </div>
      </div>
    )
  }

  /**
   * API Functions
   */
  fetchRoutes(){
    return api.fetch(`/data/routes`, {
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    })
    .then((routes)=>{
      this.setState({
        optionsRoutes: routes
      })
    })
    .catch((err)=>{
      console.error(err);
    })
  }

  fetchPokemon(){
    return api.fetch(`/data/pokemon`, {
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    })
    .then((pokemon)=>{
      this.setState({
        optionsPokemon: pokemon
      })
    })
    .catch((err)=>{
      console.error(err);
    })
  }

  /**
   * EVENT HANDLERS
   */
  onFormElementChange(e){
    let elementName = e.target.name;
    let elementValue = e.target.value;
    this.setState(_.merge(this.state, {
      formData: {
        [elementName]: elementValue
      }
    }), ()=>{
      this.props.onChange(elementName, elementValue)
      .then(()=>{
        this.props.updateValidation(this.validateData())
      })
    });
  }

  validateData(){
    if( this.state.formData.pokemonId === undefined
    || this.state.formData.routeId === undefined
    || this.state.formData.outcomeId === undefined )
      return false
    if( this.state.formData.outcomeId == 1 && !this.state.formData.pokemonName )
      return false
    return true;
  }

  onSubmit(e){
    e.preventDefault();
    console.log(this.state.formData);
  }

  onCancel(e){
    this.props.onCancel(this.state.formData);
  }
}