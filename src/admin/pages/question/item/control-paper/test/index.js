import React from 'react'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import Snackbar from 'material-ui/Snackbar'
import capitalize from '../../../../../tools/capitalize'
import dateFormat from 'dateformat'
import IconButton from 'material-ui/IconButton'
import Delete from 'material-ui/svg-icons/action/delete'

export default React.createClass({

  getInitialState() {
    return {
      item: this.props.item,
      open: false,
      autoHideDuration: 5000
    }
  },

  componentWillReceiveProps(nextProps) {
    this.setState({item: nextProps.item})
  },

  handleTextFieldChange(event) {
    event.preventDefault()
    event.stopPropagation()
    let item = this.state.item
    item[event.target.name] = event.target.value
    this.setState({item})
  },

  handleQuestion(event) {
    event.preventDefault()
    event.stopPropagation()
    let item = this.state.item
    item.answer[event.target.name] = event.target.value
    this.setState({item})
  },

  handleRemoveAnswer(index) {
    let item = this.state.item
    item.answer.splice(index, 1)
    this.setState({item})
  },

  handleDateChange(event, date) {
    let item = this.state.item
    item.dob = date
    this.setState({item})
  },

  handleClose() {
    this.setState({open: false})
  },

  handleUndo() {
    clearTimeout(this.undo)
    delete this.undo
    this.handleClose()
  },

  handleEdit() {
    this.setState({open: true})
    this.undo = setTimeout(() => {
      this.props.Api.editItem(this.props.item._id, this.state.item)
    }, this.state.autoHideDuration)
  },

  render() {
    const name = capitalize(this.props.name.toLowerCase())
    const alias = name.toLowerCase()
    const textFieldStyle = {width: '98%', marginLeft: '1%', marginRight: '1%'}
    const item = this.state.item
    return (
      <div>
        <TextField
          disabled={true}
          fullWidth
          floatingLabelText='Created at'
          inputStyle={textFieldStyle}
          hintStyle={textFieldStyle}
          floatingLabelStyle={textFieldStyle}
          value={dateFormat(new Date(this.state.item.createdAt), "dddd, mmmm dS, yyyy, hh:MM:ss")}
          name='createdAt' />
        <TextField
          fullWidth
          hintText={`enter ${alias} privacy`}
          floatingLabelText='Privacy'
          inputStyle={textFieldStyle}
          hintStyle={textFieldStyle}
          floatingLabelStyle={textFieldStyle}
          value={this.state.item.free || 'false'}
          name='privacy'
          onChange={this.handleTextFieldChange} />
        <TextField
          disabled={true}
          fullWidth
          hintText={`enter ${alias} owner`}
          floatingLabelText='Owner'
          inputStyle={textFieldStyle}
          hintStyle={textFieldStyle}
          floatingLabelStyle={textFieldStyle}
          value={this.state.item.owner ? this.state.item.owner._id : ''}
          name='owner'
          onChange={this.handleTextFieldChange} />
        <TextField
          multiLine
          fullWidth
          hintText={`enter ${alias}`}
          floatingLabelText='Question'
          inputStyle={textFieldStyle}
          hintStyle={textFieldStyle}
          floatingLabelStyle={textFieldStyle}
          name='question'
          value={this.state.item.question || ''}
          onChange={this.handleTextFieldChange} />
        {this.state.item.answer.map((value, index) => {
          return (
            <div key={index}>
              <IconButton
                onTouchTap={() => this.handleRemoveAnswer(index) }
                style={{
                  position: 'absolute',
                  left: '45px',
                  zIndex :'999'}
                }>
                <Delete />
              </IconButton>
              <TextField
                multiLine
                fullWidth
                hintText={`enter correct answer of ${alias}`}
                floatingLabelText='Answer'
                inputStyle={textFieldStyle}
                hintStyle={textFieldStyle}
                floatingLabelStyle={textFieldStyle}
                name={index}
                value={value}
                onChange={this.handleQuestion}/>
            </div>
          );
        })}
        <TextField
          multiLine
          fullWidth
          hintText={`enter ${alias}`}
          floatingLabelText='Correct'
          inputStyle={textFieldStyle}
          hintStyle={textFieldStyle}
          floatingLabelStyle={textFieldStyle}
          name='correct'
          value={this.state.item.correct}
          onChange={this.handleTextFieldChange} />
        <FlatButton
          label='Update'
          primary={true}
          style={{width: '100%'}}
          onTouchTap={() => this.handleEdit()}/>
        <Snackbar
          open={this.state.open}
          message={`${name} will be updated in 5s`}
          action='undo'
          autoHideDuration={this.state.autoHideDuration}
          onActionTouchTap={this.handleUndo}
          onRequestClose={this.handleClose}
        />
      </div>
    )
  }
})