import React from 'react'
import Snackbar from 'material-ui/lib/snackbar'
import TextField from 'material-ui/lib/text-field'
import FlatButton from 'material-ui/lib/flat-button'
import Loader from '../../../../components/loader'
import capitalize from '../../../../tools/capitalize'
import Paper from 'material-ui/lib/paper'
import dateFormat from 'dateformat'

export default React.createClass({

  getInitialState() {
    let item = {
      name: this.props.item.name,
      site: this.props.item.site,
      about: this.props.item.about,
      city: this.props.item.city ? this.props.item.city.name : ''
    }
    return {
      top: 0,
      item,
      maxHeight: document.documentElement.clientHeight - this.props.initTop,
      open: false,
      autoHideDuration: 5000
    }
  },

  componentWillReceiveProps(nextProps) {
    let item = {
      name: nextProps.item.name,
      site: nextProps.item.site,
      about: nextProps.item.about,
      city: nextProps.item.city ? nextProps.item.city.name : ''
    }
    this.setState({item})
  },

  componentWillMount() {
    window.addEventListener('scroll', this.handleScroll)
  },

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },

  handleScroll() {
    let top = document.body.scrollTop - this.props.initTop
    let maxHeight = document.documentElement.clientHeight
    if (top > 0) {
      this.state.maxHeight == maxHeight ?
        this.setState({top}) :
        this.setState({top, maxHeight})
    }
    else {
      maxHeight += top
      this.setState({top: 0, maxHeight})
    }
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
    return (
      <Paper className='control-paper' style={{top: this.state.top, maxHeight: this.state.maxHeight}}>
        <TextField
          disabled={true}
          hintText='enter company name'
          value={this.state.item.name}
          name='name'
          floatingLabelText='Company name'
          onChange={this.handleTextFieldChange}
          style={{minWidth: '50%'}}
          inputStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
          hintStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
          floatingLabelStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}} />
        <TextField
          disabled={true}
          value={dateFormat(new Date(this.props.item.createdAt), "dddd, mmmm dS, yyyy, hh:MM:ss")}
          name='createdAt'
          floatingLabelText='Created at'
          style={{minWidth: '50%'}}
          inputStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
          hintStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
          floatingLabelStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}} />
        <TextField
          hintText='enter company website'
          value={this.state.item.site || ''}
          name='site'
          floatingLabelText='Website'
          onChange={this.handleTextFieldChange}
          style={{minWidth: '50%'}}
          inputStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
          hintStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
          floatingLabelStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}} />
        <TextField
          hintText='company location'
          value={this.state.item.city || ''}
          name='city'
          floatingLabelText='City'
          onChange={this.handleTextFieldChange}
          style={{minWidth: '50%'}}
          inputStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
          hintStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
          floatingLabelStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}} />
        <TextField
          multiLine={true}
          fullWidth={true}
          rowsMax={100}
          hintText='enter information about company'
          floatingLabelText='About'
          inputStyle={{width: '98%', marginLeft: '1%', marginRight: '1%', resize: 'vertical'}}
          hintStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
          floatingLabelStyle={{width: '98%', marginLeft: '1%', marginRight: '1%'}}
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
      </Paper>
    )
  }
})
