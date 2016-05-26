import React, {Component} from 'react'


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
    width: 30,
    margin: 5,
    backgroundColor: '#00bcd4'
  }
}

export default Spinner