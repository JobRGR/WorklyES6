import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import CardHeader from 'material-ui/lib/card/card-header'
import CardText from 'material-ui/lib/card/card-text'
import CardTitle from 'material-ui/lib/card/card-title'
import TextField from 'material-ui/lib/TextField/TextField'
import FlatButton from 'material-ui/lib/flat-button'
import DatePicker from 'material-ui/lib/date-picker/date-picker'
import StatisticsService from '../../../service/statistics'
import Loader from '../../../components/loader'
import capitalize from '../../../tools/capitalize'


export default React.createClass({
  mixins: [PureRenderMixin],

  getInitialState() {
    return {
      loading: false,
      count: 20,
      data: null,
      name: '',
      url: '',
      status: '',
      type: '',
      ip: '',
      minDate: null,
      maxDate: null,
      minTime: '',
      maxTime: ''
    }
  },

  handleChange(event, type) {
    event.preventDefault()
    event.stopPropagation()
    this.setState({[type]: event.target.value})
  },

  handleSearch() {
    console.log(this.state)
  },

  textField(hintText, floatingLabelText, type) {
    return (
      <TextField
        key={type}
        hintText={hintText}
        floatingLabelText={floatingLabelText}
        inputStyle={{marginLeft: 5}}
        hintStyle={{marginLeft: 5}}
        style={{width: 300, marginLeft: 30}}
        floatingLabelStyle={{marginLeft: 5}}
        value={this.state[type]}
        onChange={event => this.handleChange(event, type)} />
    )
  },

  date(hintText, type) {
    return (
      <DatePicker
        style={{width: 300, marginLeft: 30}}
        hintText={hintText}
        value={this.state[type]}
        onChange={(event, date) => this.setState({[type]: date})}
      />
    )
  },

  render() {
    const types = ['name', 'url', 'status', 'type', 'ip']
    return (
      <div style={{padding: 20}}>
        <CardTitle title='Search Logs Data' titleStyle={{fontSize: 30}} />
        {types.map(type => this.textField(`Add ${capitalize(type)}`, `${capitalize(type)}`, type))}
        <CardTitle title='Time of request' />
        {this.textField('Add min time (ms)', 'Min time', 'minTime')}
        {this.textField('Add max time (ms)', 'Max time', 'maxTime')}
        <CardTitle title='Date' />
        {this.date('Add min date', 'minDate')}
        {this.date('Add max date', 'maxDate')}
        <FlatButton
          style={{display: 'block', marginLeft: 30, marginTop: 20}}
          label='Search'
          primary={true}
          onTouchTap={this.handleSearch} />
      </div>
    )
  }
})
