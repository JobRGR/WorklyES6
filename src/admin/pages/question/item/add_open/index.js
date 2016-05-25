import React from 'react'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import Add from 'material-ui/svg-icons/content/add'
import Dialog from 'material-ui/Dialog'
import capitalize from '../../../../tools/capitalize'
import validateEmail from '../../../../tools/validateEmail'

const style = {
  position: 'fixed',
  left: 'calc(100% - 100px)',
  top: 'calc(100% - 100px)',
}

export default React.createClass({
  getInitialState() {

    return {
      open: false,
      question: '',
      errorTextQuestion: '',
      answer: '',
      errorTextAnswer: '',
      free: '',
      errorTextFree: ''}
  },

  handleOpen() {
    this.setState({open: true})
  },

  handleClose() {
    this.setState({open: false});
  },

  handleChangeQuestion(event) {
    event.preventDefault()
    event.stopPropagation()
    this.setState({question: event.target.value, errorTextQuestion: ''})
  },

  handleChangeAnswer(event) {
    event.preventDefault()
    event.stopPropagation()
    this.setState({answer: event.target.value, errorTextAnswer: ''})
  },

  handleChangeFree(event) {
    event.preventDefault()
    event.stopPropagation()
    this.setState({free: event.target.value, errorTextFree: ''})
  },

  handleAdd() {
    //if (!this.state.name || this.state.name.length < 3){
    //  this.setState({errorTextName: 'the name is too short'})
    //  return
    //}
    //if (!this.state.email && !validateEmail(this.state.email)) {
    //  this.setState({errorTextMail: 'incorrect email address'})
    //  return
    //}
    //if (this.state.pass1 != this.state.pass2) {
    //  this.setState({errorTextPass: 'passwords are not equal'})
    //  return
    //}
    //if (!this.state.pass1 || this.state.pass1.length < 4) {
    //  this.setState({errorTextPass: 'password must contain at least 4 characters'})
    //  return
    //}
    this.props.Api.addItem({
      question: this.state.question,
      answer: this.state.answer,
      free: this.state.free
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
            hintText={`${name}`}
            floatingLabelText='Enter question'
            fullWidth
            inputStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
            hintStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
            floatingLabelStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
            value={this.state.question}
            errorText={this.state.errorTextQuestion}
            onChange={this.handleChangeQuestion}/>
          <TextField
            hintText={`${name} answer`}
            floatingLabelText='Enter answer'
            fullWidth
            inputStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
            hintStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
            floatingLabelStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
            value={this.state.answer}
            errorText={this.state.errorTextAnswer}
            onChange={this.handleChangeAnswer} />
          <TextField
            hintText={`${name} privacy`}
            floatingLabelText='Enter privacy'
            fullWidth
            inputStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
            hintStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
            floatingLabelStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
            value={this.state.free}
            errorText={this.state.errorTextFree}
            onChange={this.handleChangeFree} />
        </Dialog>
      </div>
    )
  }
})