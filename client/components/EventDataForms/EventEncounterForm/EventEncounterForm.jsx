import React from 'react'

import api from '../../../services/api/api.js'

export default class EventEncounterForm extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      loaded: false,
      optionsRoutes: [],
      optionsPokemon: []
    };
    
    ([
      'onSubmit',
      'fetchRoutes',
      'fetchPokemon',
      'renderRouteSelection'
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
    return (<form className="eventEncounterForm" onSubmit={this.onSubmit}>
      {this.renderRouteSelection()}
      {this.renderPokemonSelection()}
    </form>)
  }

  renderRouteSelection(){
    return (<React.Fragment>
      <select>
        {[<option key={-1}>Select a route</option>].concat(this.state.optionsRoutes.map((route)=>{
          return (<option key={route.id} value={route.id}>{route.name}</option>)
        }))}
      </select>
    </React.Fragment>)
  }

  renderPokemonSelection(){
    return (<React.Fragment>
      <select>
        {[<option key={-1}>Select a pokemon</option>].concat(this.state.optionsPokemon.map((pokemon)=>{
          return (<option key={pokemon.id} value={pokemon.id}>{pokemon.name}</option>)
        }))}
      </select>
    </React.Fragment>)
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

  onSubmit(e){
    e.preventDefault();
  }
}