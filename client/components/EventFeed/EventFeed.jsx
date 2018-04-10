import React from 'react';
import EventCreator from '../EventCreator/EventCreator.jsx';
import EventHistory from '../EventHistory/EventHistory.jsx';
import extend from 'lodash/extend';
import each from 'lodash/each';
let _ = {
  extend,
  each
};
import fetch from 'better-fetch';

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
      'updateEventList'
    ], (funcName)=>{
      this[funcName] = this[funcName].bind(this);
    })
  }

  componentDidMount(){
    this.updateEventList();
  }

  render(){
    return (
      <div className="eventFeed">
        <EventCreator eventTypes={eventTypes} updateEventList={this.updateEventList}/>
        <EventHistory events={this.state.events} />
      </div>
    )
  }

  /**
   * Exposed Actions
   */
  updateEventList(){
    return fetch('http://localhost:5000/api/v1/encounters', {
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    })
    .then(response=>response.json())
    .then((jsonData)=>{
      return new Promise((resolve)=>{
        this.setState({
          events: jsonData
        }, resolve)
      })
    })
    .catch((err)=>{
      console.error(err);
    });
  }
}