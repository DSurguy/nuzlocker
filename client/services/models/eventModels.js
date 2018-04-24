import merge from 'lodash/merge'
let _ = { merge }

export function EncounterEvent(data){
  return _.merge({
    outcomeId: 0,
    pokemonDexId: 151,
    routeId: 1,
    pokemonLevel: 0,
    pokemonName: ''
  }, data)
}

export function PokemonUpdateEvent(){

}