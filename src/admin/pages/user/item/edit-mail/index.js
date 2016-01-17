import React from 'react'
import TextField from 'material-ui/lib/TextField/TextField'
import FlatButton from 'material-ui/lib/flat-button'
import Dialog from 'material-ui/lib/dialog'
import capitalize from '../../../../tools/capitalize'
import validateEmail from '../../../../tools/validateEmail'

export default React.createClass({

  getInitialState() {
    return {edit: null, errorTextMail: ''}
  },

  handleEdit(edit = null) {
    this.setState({edit})
  },

  handleEditMail(event) {
    event.preventDefault()
    event.stopPropagation()
    let errorTextMail = !event.target.value || validateEmail(event.target.value) ? '' : 'incorrect email address'
    this.setState(({edit}) => ({edit: {_id: edit._id, email: event.target.value}, errorTextMail}))
  },

  saveEdit() {
    if (!validateEmail(this.state.edit.email)) {
      let errorTextMail = 'incorrect email address'
      this.setState({errorTextMail})
      return
    }
    this.props.Api.editMail(this.state.edit._id, this.state.edit.email)
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
            onTouchTap={() => this.saveEdit()} />
        ]}
        modal={false}
        open={this.state.edit ? true : false}
        onRequestClose={() => this.handleEdit()} >
        <TextField
          hintText={`edit ${name} mail`}
          floatingLabelText='Edit'
          inputStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
          hintStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
          floatingLabelStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
          fullWidth
          value={this.state.edit ? this.state.edit.email : ''}
          errorText={this.state.errorTextMail}
          onChange={this.handleEditMail} />
      </Dialog>
    )
  }
})
