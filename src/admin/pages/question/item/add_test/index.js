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
            hintText={`${name} privacy`}
            floatingLabelText='Enter privacy'
            fullWidth
            inputStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
            hintStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
            floatingLabelStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
            value={this.state.free}
            errorText={this.state.errorTextFree}
            onChange={this.handleChangeFree} />
          <TextField
            hintText={`${name} correct`}
            floatingLabelText='Enter correct'
            fullWidth
            inputStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
            hintStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
            floatingLabelStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
            value={this.state.correct}
            errorText={this.state.errorTextCorrect}
            onChange={this.handleChangeCorrect} />
          <FlatButton
            label="Add answer"
            primary={true}
            keyboardFocused={true}
            onTouchTap={() => this.handleAddAnswer()}/>
          {this.state.answer.map((el, index) => {
            return <TextField
              hintText={`${name} answer`}
              floatingLabelText='Enter answer'
              fullWidth
              inputStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
              hintStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
              floatingLabelStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
              value={el}
              key={index}
              errorText={this.state.errorTextAnswer}
              onChange={(event) => this.handleChangeAnswer(event, index)} />;
          })}


        </Dialog>
      </div>
    )
  }
})