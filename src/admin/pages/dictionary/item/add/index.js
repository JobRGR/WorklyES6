import React from 'react'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import capitalize from '../../../../tools/capitalize'


export default React.createClass({

  getInitialState() {
    return {value: '', open: false}
  },

  handleAdd(open = false) {
    this.setState({open, value: ''})
  },

  handleItem(event) {
    event.preventDefault()
    event.stopPropagation()
    this.setState({value: event.target.value})
  },

  addItem() {
    this.props.Api.addItem(this.state.value)
    this.handleAdd()
  },

  render() {
    const name = capitalize(this.props.name.toLowerCase())
    return (
      <Dialog
        title={`Add ${name}`}
        actions={[
          <FlatButton
            label='Cancel'
            secondary={true}
            onTouchTap={() => this.handleAdd()} />,
          <FlatButton
            label='Add'
            primary={true}
            keyboardFocused={true}
            onTouchTap={this.addItem} />
        ]}
        modal={false}
        open={this.state.open}
        onRequestClose={() => this.handleAdd}
      >
        <TextField
          hintText={`Add ${name}`}
          floatingLabelText='Add'
          inputStyle={{marginLeft: 5}}
          hintStyle={{marginLeft: 5}}
          floatingLabelStyle={{marginLeft: 5}}
          fullWidth
          value={this.state.value}
          onChange={this.handleItem} />
      </Dialog>
    )
  }
})
