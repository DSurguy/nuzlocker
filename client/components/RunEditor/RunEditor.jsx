import React from 'react'

export default class RunEditor extends React.Component{
  constructor(props){
    super(props);

    this.state = {};

    ([]).forEach((funcName)=>{
      this[funcName] = this[funcName].bind(this)
    })
  }

  render(){
    return (<div className="runEditor">
      I am a run editor I guess, ID: {this.props.match.params.id}
    </div>)
  }
}