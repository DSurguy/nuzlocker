import React from 'react';
import EventCreator from '../EventCreator/EventCreator.jsx';
import EventHistory from '../EventHistory/EventHistory.jsx';
import extend from 'lodash/extend';
import each from 'lodash/each';
let _ = {
  extend,
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

export default class EventFeed extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      events: []
    }

    _.each([
      'createEvent'
    ], (funcName)=>{
      this[funcName] = this[funcName].bind(this);
    })
  }

  render(){
    return (
      <div className="eventFeed">
        <EventCreator eventTypes={eventTypes} createEvent={this.createEvent}/>
        <EventHistory events={this.state.events} />
      </div>
    )
  }

  /**
   * Exposed Actions
   */
  createEvent(newEvent){
    console.log(newEvent);
    this.setState({
      events: this.state.events.concat([_.extend({
        id: this.state.events.length
      }, newEvent)])
    })
  }
}