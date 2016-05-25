import React from 'react'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import Add from 'material-ui/svg-icons/content/add'
import Dialog from 'material-ui/Dialog'
import capitalize from '../../../../tools/capitalize'
import validateEmail from '../../../../tools/validateEmail'
import Checkbox from 'material-ui/Checkbox'
import IconButton from 'material-ui/IconButton'
import Delete from 'material-ui/svg-icons/action/delete'

const style = {
  FloatingActionButton:{
    position: 'fixed',
    left: 'calc(100% - 100px)',
    top: 'calc(100% - 100px)'
  },
  TextField: {
    width: '85%'
  },
  RaisedButton: {
    position: 'absolute',
    top: '24px',
    right: '20px'
  },
  checkbox: {
    display: 'inline-block',
    width: '30px',
    height: '15px'
  }
}

export default React.createClass({
  getInitialState() {
    return {
      open: false,
      question: '',
      errorTextQuestion: '',
      answer: [],
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

  handleAddAnswer() {
    let answer = this.state.answer
    answer.push('')
    this.setState({answer})
  },

  handleRemoveAnswer(index) {
    let answer = this.state.answer
    answer.splice(index, 1)
    this.setState({answer})
  },

  handleClearAll() {
    this.setState({answer: [], question: "", free: ""})
  },

  handleCheckbox(index) {
    let correct = this.state.correct
    correct = correct ^ (1 << index)
    this.setState({correct})
  },

  handleChangeQuestion(event) {
    event.preventDefault()
    event.stopPropagation()
    this.setState({question: event.target.value, errorTextQuestion: ''})
  },

  handleChangeAnswer(event, index) {
    event.preventDefault()
    event.stopPropagation()
    let {answer} = this.state
    answer[index] = event.target.value
    this.setState({answer})
  },

  handleChangeFree(event) {
    event.preventDefault()
    event.stopPropagation()
    this.setState({free: event.target.value, errorTextFree: ''})
  },

  handleChangeCorrect(event) {
    event.preventDefault()
    event.stopPropagation()
    this.setState({correct: event.target.value, errorTextCorrect: ''})
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
      free: this.state.free,
      correct: this.state.correct
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
        <FloatingActionButton style={style.FloatingActionButton} onTouchTap={() => this.handleOpen()}>
          <Add />
        </FloatingActionButton>
        <Dialog
          autoScrollBodyContent={true}
          title={`Add ${name}`}
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={() => this.handleClose()} >
          <RaisedButton
            style={style.RaisedButton}
            onTouchTap={() => this.handleClearAll()}
            label="Clear all"/>
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
            hintText={`${name} privacy`}
            floatingLabelText='Enter privacy'
            fullWidth
            inputStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
            hintStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
            floatingLabelStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
            value={this.state.free}
            errorText={this.state.errorTextFree}
            onChange={this.handleChangeFree} />
          <FlatButton
            label="Add answer"
            primary={true}
            keyboardFocused={true}
            onTouchTap={() => this.handleAddAnswer()}/>
          {this.state.answer.map((el, index) => {
            return (
              <div key={index}>
                <Checkbox
                  style={style.checkbox}
                  defaultChecked={false}
                  onCheck={() => this.handleCheckbox(index)}/>
                <TextField
                  hintText={`${name} answer`}
                  floatingLabelText='Enter answer'
                  //inputStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
                  hintStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
                  floatingLabelStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
                  value={el}
                  style={style.TextField}
                  errorText={this.state.errorTextAnswer}
                  onChange={(event) => this.handleChangeAnswer(event, index)} />
                <IconButton
                  onTouchTap={() => this.handleRemoveAnswer(index) }
                  fullWidth={false}>
                  <Delete />
                </IconButton>

              </div>
            );
          })}


        </Dialog>
      </div>
    )
  }
})