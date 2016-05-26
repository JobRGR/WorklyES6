import React from 'react'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import Snackbar from 'material-ui/Snackbar'
import Avatar from '../avatar'
import capitalize from '../../../../../tools/capitalize'
import dateFormat from 'dateformat'

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
    return (
      <div>
        {this.props.item.avatar && <Avatar src={this.props.item.avatar} email={this.props.item.email} />}
        <TextField
          disabled
          hintText={`enter ${alias} name`}
          floatingLabelText={`${name} name`}
          style={{minWidth: '50%'}}
          inputStyle={textFieldStyle}
          hintStyle={textFieldStyle}
          floatingLabelStyle={textFieldStyle}
          value={this.state.item.name}
          name='name'
          onChange={this.handleTextFieldChange}
        />
        <TextField
          disabled={true}
          floatingLabelText='Created at'
          style={{minWidth: '50%'}}
          inputStyle={textFieldStyle}
          hintStyle={textFieldStyle}
          floatingLabelStyle={textFieldStyle}
          value={dateFormat(new Date(this.state.item.createdAt), "dddd, mmmm dS, yyyy, hh:MM:ss")}
          name='createdAt' />
        <TextField
          hintText={`enter ${alias} website`}
          floatingLabelText='Website'
          style={{minWidth: '50%'}}
          inputStyle={textFieldStyle}
          hintStyle={textFieldStyle}
          floatingLabelStyle={textFieldStyle}
          value={this.state.item.site || ''}
          name='site'
          onChange={this.handleTextFieldChange} />
        <TextField
          hintText={`${alias} location`}
          floatingLabelText='City'
          style={{minWidth: '50%'}}
          inputStyle={textFieldStyle}
          hintStyle={textFieldStyle}
          floatingLabelStyle={textFieldStyle}
          value={this.state.item.city || ''}
          name='city'
          onChange={this.handleTextFieldChange} />
        <TextField
          multiLine
          fullWidth
          hintText={`enter information about ${alias}`}
          floatingLabelText='About'
          inputStyle={textFieldStyle}
          hintStyle={textFieldStyle}
          floatingLabelStyle={textFieldStyle}
          name='about'
          value={this.state.item.about || ''}
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
