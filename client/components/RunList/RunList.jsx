import React from 'react'

export default class RunList extends React.Component{
  constructor(props){
    super(props);

    this.state = {};

    ([]).forEach((funcName)=>{
      this[funcName] = this[funcName].bind(this)
    })
  }

  render(){
    return (<React.Fragment>
      THIS IS RUN LIST
    </React.Fragment>)
  }
}