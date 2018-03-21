import React from 'react';
import EventCreator from '../EventCreator/EventCreator.js';

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
  }

  render(){
    return (
      <div className="eventFeed">
        <EventCreator eventTypes={eventTypes} createEvent={this.createEvent}/>
      </div>
    )
  }

  /**
   * Exposed Actions
   */
  createEvent(newEvent){
    console.log(`Creating Event Type: ${newEvent.type}`);
  }
}