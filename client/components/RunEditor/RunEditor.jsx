import React from 'react'

export default class RunEditor extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      events: undefined,
      loaded: false
    };

    ([
      'fetchRunEvents'
    ]).forEach((funcName)=>{
      this[funcName] = this[funcName].bind(this)
    })
  }

  componentDidMount(){
    this.fetchRunEvents(this.props.match.params.id);
  }

  render(){
    if( !this.state.loaded ) return (<div><i className="fas fa-sync fa-spin"></i></div>)
    return (<div className="runEditor">
      I am a run editor I guess, ID: {this.props.match.params.id}
      {this.state.events === undefined 
        ? (<div className="runEditor__loader">
          <i className="fas fa-sync fa-spin"></i>
        </div>)
        : (<div className="runEditor__eventList">
          {this.state.events.map((event)=>{
            return (<div className="runEditor__event">I AM EVENT</div>);
          })}
        </div>)
      }
    </div>)
  }

  fetchRunEvents(runId){
    return fetch(`http://localhost:5000/api/v1/events/${runId}`, {
      credentials: 'include'
    })
    .then(response=>response.json())
    .then((jsonData)=>{
      return new Promise((resolve)=>{
        this.setState({
          events: jsonData,
          loaded: true
        }, resolve)
      })
    })
    .catch((err)=>{
      console.error(err);
    });
  }
}