import React, {Component} from 'react'
import {green700} from 'material-ui/styles/colors'


class Spinner extends Component {
  render() {
    return (
      <div className='spinner' style={this.props.style}>
        <div className='bounce1' style={this.props.bounceStyle}></div>
        <div className='bounce2' style={this.props.bounceStyle}></div>
        <div className='bounce3' style={this.props.bounceStyle}></div>
      </div>
    )
  }
}

Spinner.defaultProps = {
  style: {width: 120},
  bounceStyle: {
    width: 40,
    backgroundColor: green700
  }
}

export default Spinner