import React from 'react';
import find from 'lodash/find';
import each from 'lodash/each';
let _ = {
  find,
  each
};

let eventTypes = [{
  id: '0',
  name: 'encounter',
  label: 'Pokemon Encounter'
}, {
  id: '1',
  name: 'pokemonStatusUpdate',
  label: 'Pokemon Update'
}, {
  id: '2',
  name: 'goalStatusUpdate',
  label: 'Goal Update'
}];

export default class EventCreator extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      eventType: eventTypes[0]
    }

    _.each([
      'onChangeTypeSelect'
    ], (funcName)=>{
      this[funcName] = this[funcName].bind(this);
    })
  }

  render(){
    return (
      <div className="eventCreator">
        <select onChange={this.onChangeTypeSelect}>
          {eventTypes.map((type)=>{
            return (<option key={type.id} value={type.id}>{type.label}</option>)
          })}
        </select>
        <button>Create new {this.state.eventType.label}</button>
      </div>
    )
  }

  /**
   * Event Handlers
   */
  onChangeTypeSelect(event){
    let newEventType = _.find(eventTypes, {id: event.target.value});
    this.setState({
      eventType: newEventType
    })
  }
}