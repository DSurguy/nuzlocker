import React from 'react';
import find from 'lodash/find';
import each from 'lodash/each';
let _ = {
  find,
  each
};

export default class EventCreator extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      eventType: this.props.eventTypes[0]
    }

    _.each([
      'onChangeTypeSelect',
      'onClickCreateButton'
    ], (funcName)=>{
      this[funcName] = this[funcName].bind(this);
    })
  }

  render(){
    return (
      <div className="eventCreator">
        <div className="row mb-1">
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
        </div>
      </div>
    )
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
    this.props.createEvent({
      type: this.state.eventType.name,
      metadata: {}
    })
  }
}