import React from 'react'
import TextField from 'material-ui/lib/TextField/TextField'
import FlatButton from 'material-ui/lib/flat-button'
import Dialog from 'material-ui/lib/dialog'
import capitalize from '../../../tools/capitalize'


export default React.createClass({

  getInitialState() {
    return {edit: null}
  },

  handleEdit(edit = null) {
    this.setState({edit})
  },

  handleEditItem(event) {
    event.preventDefault()
    event.stopPropagation()
    this.setState(({edit}) => ({edit: {_id: edit._id, name: event.target.value}}))
  },

  saveEdit() {
    this.props.Api.editItem(this.state.edit._id, this.state.edit.name)
    this.handleEdit()
  },

  render() {
    const name = capitalize(this.props.name.toLowerCase())
    return (
      <Dialog
        title={`Edit ${name}`}
        actions={[
          <FlatButton
            label='Cancel'
            secondary={true}
            onTouchTap={() => this.handleEdit()} />,
          <FlatButton
            label='Update'
            primary={true}
            keyboardFocused={true}
            onTouchTap={this.saveEdit} />
        ]}
        modal={false}
        open={this.state.edit ? true : false}
        onRequestClose={() => this.handleEdit}
      >
        <TextField
          hintText={`Edit ${name}`}
          floatingLabelText='Edit'
          inputStyle={{marginLeft: 5}}
          hintStyle={{marginLeft: 5}}
          floatingLabelStyle={{marginLeft: 5}}
          fullWidth
          value={this.state.edit ? this.state.edit.name : ''}
          onChange={this.handleEditItem}
        />
      </Dialog>
    )
  }
})
