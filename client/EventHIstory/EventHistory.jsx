import React from 'react';

export default class EventFeed extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    console.log(this.props.events);
    return (
      <div className="eventHistory">
        {this.props.events.map((event)=>{
          return (<div key={event.id} className="card">
            {event.id} - {event.metadata.label}
          </div>);
        })}
      </div>
    )
  }
}