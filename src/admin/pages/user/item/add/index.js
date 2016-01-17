import React from 'react'
import TextField from 'material-ui/lib/TextField/TextField'
import FlatButton from 'material-ui/lib/flat-button'
import FloatingActionButton from 'material-ui/lib/floating-action-button'
import Add from 'material-ui/lib/svg-icons/content/add'
import Dialog from 'material-ui/lib/dialog'
import capitalize from '../../../../tools/capitalize'
import validateEmail from '../../../../tools/validateEmail'

const style = {
  position: 'fixed',
  left: 'calc(100% - 100px)',
  top: 'calc(100% - 100px)',
}

export default React.createClass({
  getInitialState() {
    return {open: false}
  },

  handleOpen() {
    this.setState({open: true})
  },

  handleClose() {
    this.setState({open: false});
  },

  handleChangeName(event) {
    event.preventDefault()
    event.stopPropagation()
    this.setState({name: event.target.value, errorTextName: ''})
  },

  handleChangeMail(event) {
    event.preventDefault()
    event.stopPropagation()
    let errorTextMail = validateEmail(event.target.value) ? '' : 'incorrect email address'
    this.setState({email: event.target.value, errorTextMail})
  },

  handleChangePass1(event) {
    event.preventDefault()
    event.stopPropagation()
    let errorTextPass = this.state.pass2 && this.state.pass2 != event.target.value ? 'passwords are not equal' : ''
    this.setState({pass1: event.target.value, errorTextPass})
  },

  handleChangePass2(event) {
    event.preventDefault()
    event.stopPropagation()
    let errorTextPass = event.target.value && this.state.pass1 != event.target.value ? 'passwords are not equal' : ''
    this.setState({pass2: event.target.value, errorTextPass})
  },

  handleAdd() {
    if (!this.state.name || this.state.name.length < 3){
      this.setState({errorTextName: 'the name is too short'})
      return
    }
    if (!this.state.email && !validateEmail(this.state.email)) {
      this.setState({errorTextMail: 'incorrect email address'})
      return
    }
    if (this.state.pass1 != this.state.pass2) {
      this.setState({errorTextPass: 'passwords are not equal'})
      return
    }
    if (!this.state.pass1 || this.state.pass1.length < 4) {
      this.setState({errorTextPass: 'password must contain at least 4 characters'})
      return
    }
    this.props.Api.addItem({
      name: this.state.name,
      email: this.state.email,
      password: this.state.pass1
    })
    this.handleClose()
  },

  render() {
    const actions = [
      <FlatButton
        label='Cancel'
        secondary={true}
        onTouchTap={() => this.handleClose()} />,
      <FlatButton
        label='Add'
        primary={true}
        keyboardFocused={true}
        onTouchTap={() => this.handleAdd()} />
    ]
    const name = capitalize(this.props.name.toLowerCase())

    return (
      <div>
        <FloatingActionButton style={style} onTouchTap={() => this.handleOpen()}>
          <Add />
        </FloatingActionButton>
        <Dialog
          title={`Add ${name}`}
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={() => this.handleClose()} >
          <TextField
            hintText={`${name} name`}
            floatingLabelText='Enter name'
            fullWidth
            inputStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
            hintStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
            floatingLabelStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
            value={this.state.name}
            errorText={this.state.errorTextName}
            onChange={this.handleChangeName}/>
          <TextField
            hintText={`${name} email`}
            floatingLabelText='Enter email'
            fullWidth
            inputStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
            hintStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
            floatingLabelStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
            value={this.state.email}
            errorText={this.state.errorTextMail}
            onChange={this.handleChangeMail} />
          <TextField
            hintText={`password`}
            floatingLabelText='Enter password'
            fullWidth
            inputStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
            hintStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
            floatingLabelStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
            value={this.state.pass1}
            type='password'
            onChange={this.handleChangePass1} />
          <TextField
            hintText={`password`}
            floatingLabelText='Repeat password'
            fullWidth
            inputStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
            hintStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
            floatingLabelStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
            value={this.state.pass2}
            errorText={this.state.errorTextPass}
            type='password'
            onChange={this.handleChangePass2} />
        </Dialog>
      </div>
    )
  }
})