import React from 'react'
import Snackbar from 'material-ui/lib/snackbar'
import capitalize from '../../../tools/capitalize'


export default React.createClass({

  getInitialState() {
    return {open: false, duration: 5000}
  },

  handleRemove(id) {
    this.undo = this.props.Api.removeItem(id, this.state.duration)
    this.setState({open: true})
    setTimeout(this.handleRequestClose, this.state.duration)
  },

  handleRequestClose() {
    delete this.undo
    this.setState({open: false})
  },

  handleActionTouchTap() {
    this.undo()
    this.handleRequestClose()
  },

  render() {
    const name = capitalize(this.props.name.toLowerCase())
    return (
      <Snackbar
        open={this.state.open}
        message={`${name} was removed`}
        action='undo'
        autoHideDuration={this.state.duration}
        onActionTouchTap={this.handleActionTouchTap}
        onRequestClose={this.handleRequestClose}
      />
    )
  }
})
