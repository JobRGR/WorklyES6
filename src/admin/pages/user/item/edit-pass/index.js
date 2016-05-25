import React from 'react'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import capitalize from '../../../../tools/capitalize'

export default React.createClass({

  getInitialState() {
    return {edit: null, errorTextPass: ''}
  },

  handleEdit(edit = null) {
    this.setState({edit})
  },

  handleChangePass1(event) {
    event.preventDefault()
    event.stopPropagation()
    this.setState(({edit}) => ({
      edit: {
        _id: edit._id,
        pass1: event.target.value,
        pass2: edit.pass2
      },
      errorTextPass: edit.pass2 && edit.pass2 != event.target.value ? 'passwords are not equal' : ''
    }))
  },

  handleChangePass2(event) {
    event.preventDefault()
    event.stopPropagation()
    this.setState(({edit}) => ({
      edit: {
        _id: edit._id,
        pass1: edit.pass1,
        pass2: event.target.value
      },
      errorTextPass: event.target.value && edit.pass1 != event.target.value ? 'passwords are not equal' : ''
    }))
  },

  saveEdit() {
    if (this.state.edit.pass1 != this.state.edit.pass2) {
      this.setState({errorTextPass: 'passwords are not equal'})
      return
    }
    if (!this.state.edit.pass1 || this.state.edit.pass1.length < 4) {
      this.setState({errorTextPass: 'password must contain at least 4 characters'})
      return
    }
    this.props.Api.editPass(this.state.edit._id, this.state.edit.pass1)
    this.handleEdit()
  },

  render() {
    const name = capitalize(this.props.name.toLowerCase())
    return (
      <Dialog
        title={`Edit ${name} password`}
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
          hintText={`password`}
          floatingLabelText='Enter password'
          fullWidth
          inputStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
          hintStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
          floatingLabelStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
          value={this.state.edit ? this.state.edit.pass1 : ''}
          type='password'
          onChange={this.handleChangePass1} />
        <TextField
          hintText={`password`}
          floatingLabelText='Repeat password'
          fullWidth
          inputStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
          hintStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
          floatingLabelStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
          value={this.state.edit ? this.state.edit.pass2 : ''}
          errorText={this.state.errorTextPass}
          type='password'
          onChange={this.handleChangePass2} />
      </Dialog>
    )
  }
})
