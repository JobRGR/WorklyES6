import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import RefreshIndicator from 'material-ui/lib/refresh-indicator'
import CardHeader from 'material-ui/lib/card/card-header'
import CardText from 'material-ui/lib/card/card-text'
import CardTitle from 'material-ui/lib/card/card-title'
import TextField from 'material-ui/lib/TextField/TextField'
import FlatButton from 'material-ui/lib/flat-button'
import DatePicker from 'material-ui/lib/date-picker/date-picker'
import TableBody from 'material-ui/lib/table/table-body'
import TableHeader from 'material-ui/lib/table/table-header'
import TableFooter from 'material-ui/lib/table/table-footer'
import TableHeaderColumn from 'material-ui/lib/table/table-header-column'
import TableRow from 'material-ui/lib/table/table-row'
import TableRowColumn from 'material-ui/lib/table/table-row-column'
import StatisticService from '../../../service/statistic'
import Loader from '../../../components/loader'
import Table from './table'
import capitalize from '../../../tools/capitalize'

const types = ['name', 'url', 'status', 'type', 'ip']

export default React.createClass({
  mixins: [PureRenderMixin],

  getInitialState() {
    return {
      loading: false,
      count: 20,
      percent: null,
      statistic: null,
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
    let body = {}
    types.forEach(type => {
      if (this.state[type] && this.state[type].length) {
        body[type] = this.state[type]
      }
    })
    if (this.state.minTime || this.state.maxTime) {
      body.time = {
        min: this.state.minTime || 0,
        max: this.state.maxTime || Infinity
      }
    }
    if (this.state.minDate || this.state.maxDate) {
      body.date = {
        min: this.state.minDate || new Date(0, 0, 0),
        max: this.state.maxDate || new Date()
      }
    }
    this.setState({loading: true})
    StatisticService.search(body, (percent, statistic) => {
      this.setState({percent, statistic, loading: false})
    })
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

  handleCount() {
    this.setState(({count}) => ({count: count + 20}))
  },

  date(hintText, type) {
    return (
      <DatePicker
        style={{width: 300, marginLeft: 30, display: 'inline-block'}}
        hintText={hintText}
        value={this.state[type]}
        onChange={(event, date) => this.setState({[type]: date})}
      />
    )
  },

  render() {
    return (
      <div style={{padding: 20}}>
        {
          this.state.loading &&
          <RefreshIndicator
            size={40}
            style={{
              float: 'right',
              position: 'relative',
              boxShadow: 'none'
            }}
            top={0}
            left={0}
            status='loading'
          />
        }
        <CardTitle title='Search Logs Data' titleStyle={{fontSize: 30}} />
        <div style={{float: 'right'}}>
          <CardTitle title='Time of request' />
          {this.textField('Add min time (ms)', 'Min time', 'minTime')}
          {this.textField('Add max time (ms)', 'Max time', 'maxTime')}
        </div>
        <div style={{float: 'right'}}>
          <CardTitle title='Date' />
          {this.date('Add min date', 'minDate')}
          {this.date('Add max date', 'maxDate')}
        </div>
        {types.map(type => this.textField(`Add ${capitalize(type)}`, `${capitalize(type)}`, type))}
        <FlatButton
          style={{display: 'block', marginLeft: 30, marginTop: 20, width: 300}}
          label='Search'
          primary={true}
          onTouchTap={this.handleSearch} />
        {
          this.state.statistic &&
          <Table
            items={this.state.statistic}
            count={this.state.count}
            handleCount={this.handleCount} />
        }
      </div>
    )
  }
})
