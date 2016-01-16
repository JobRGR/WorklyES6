import React from 'react'

export default React.createClass({
  render() {
    return (
      <div style={this.imgWrapper()}>
        <img src={this.props.src} style={this.imgStyle()} />
        <span src={this.props.email} style={this.emailStyle()}>{this.props.email}</span>
      </div>
    )
  },

  emailStyle() {
    return {
      display: 'inline-block',
      verticalAlign: 'middle',
      fontSize: 21,
      paddingLeft: 10,
      color: 'rgba(0, 0, 0, 0.87)'
    }
  },

  imgWrapper() {
    return {
      marginTop: 20,
      marginLeft: 10
    }
  },

  imgStyle() {
    return {
      borderRadius: 128,
      width: 55,
      display: 'inline-block',
      verticalAlign: 'middle'
    }
  }
})