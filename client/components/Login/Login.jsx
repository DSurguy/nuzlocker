import React from 'react'

export default class Login extends React.Component{
  constructor(props){
    super(props);

    this.state = {};

    ([
      'onFormSubmit'
    ]).forEach((funcName)=>{
      this[funcName] = this[funcName].bind(this)
    })
  }

  render(){
    return (<div className="login">
      <div className="login__form">
        <form onSubmit={this.onFormSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" className="form-control" name="username" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" name="password" />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary pull-right">Login</button>
          </div>
        </form>
      </div>
    </div>)
  }

  onFormSubmit(e){
    e.preventDefault();
    e.stopPropagation();
  }
}