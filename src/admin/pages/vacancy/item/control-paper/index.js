import React from 'react'
import TextField from 'material-ui/lib/text-field'
import FlatButton from 'material-ui/lib/flat-button'
import IconButton from 'material-ui/lib/icon-button'
import ArrowBack from 'material-ui/lib/svg-icons/navigation/arrow-back'
import Colors from 'material-ui/lib/styles/colors';
import capitalize from '../../../../tools/capitalize'
import marked from 'marked'
import dateFormat from 'dateformat'

export default React.createClass({

  getInitialState() {
    return {item: JSON.parse(JSON.stringify(this.props.item))}
  },

  componentWillReceiveProps(nextProps) {
    this.setState({item: JSON.parse(JSON.stringify(nextProps.item))})
  },

  handleTextFieldChange(event) {
    event.preventDefault()
    event.stopPropagation()
    let item = this.state.item
    item[event.target.name] = event.target.value
    this.setState({item})
  },

  handleEdit() {
    this.props.Api.editItem(this.state.item._id, this.state.item)
    this.props.handleCancel()
  },

  rawMarkup() {
    return { __html: marked(this.state.item.about, {sanitize: true}) };
  },

  render() {
    const name = capitalize(this.props.name.toLowerCase())
    const alias = name.toLowerCase()
    const textFieldStyle = {width: '98%', marginLeft: '1%', marginRight: '1%'}
    return (
      <div>
        <IconButton onTouchTap={() => this.props.handleCancel()}>
          <ArrowBack hoverColor={Colors.green500} />
        </IconButton>
        <span style={{display: 'inline-block', minWidth: '50%', padding: 12, verticalAlign: 'top', fontSize: 21}}>
          {`${name} edit`}
        </span>
        <TextField
          disabled
          floatingLabelText='Company name'
          style={{minWidth: '50%'}}
          inputStyle={textFieldStyle}
          hintStyle={textFieldStyle}
          floatingLabelStyle={textFieldStyle}
          value={this.state.item.company.name}
          name='companyName'
        />
        <TextField
          disabled
          floatingLabelText='Created at'
          style={{minWidth: '50%'}}
          inputStyle={textFieldStyle}
          hintStyle={textFieldStyle}
          floatingLabelStyle={textFieldStyle}
          value={dateFormat(new Date(this.state.item.createdAt), "dddd, mmmm dS, yyyy, hh:MM:ss")}
          name='createdAt' />
        <TextField
          hintText={`enter ${alias} name`}
          floatingLabelText={`${name} name`}
          style={{minWidth: '50%'}}
          inputStyle={textFieldStyle}
          hintStyle={textFieldStyle}
          floatingLabelStyle={textFieldStyle}
          value={this.state.item.name || ''}
          name='name'
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
          style={{minWidth: '50%'}}
          hintText={`enter information about ${alias}`}
          floatingLabelText='About'
          inputStyle={textFieldStyle}
          hintStyle={textFieldStyle}
          floatingLabelStyle={textFieldStyle}
          name='about'
          value={this.state.item.about || ''}
          onChange={this.handleTextFieldChange} />
        <div
          className='preview-block'
          dangerouslySetInnerHTML={this.rawMarkup()}/>
        <FlatButton
          label='Update'
          primary={true}
          style={{width: '100%'}}
          onTouchTap={() => this.handleEdit()}/>
      </div>
    )
  }
})
