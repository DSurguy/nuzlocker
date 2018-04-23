import React from 'react';
import './NzModal.scss';

export default class NzModal extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    if( !this.props.show ) return null;
    return (
      <div className={`nzModal-backdrop ${this.props.className}`}>
        <div className="nzModal-content container">
          {this.props.children}
        </div>
      </div>
    )
  }
}