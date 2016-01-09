import React from 'react'
import TextField from 'material-ui/lib/TextField/TextField'
import FlatButton from 'material-ui/lib/flat-button'
import Loader from '../../../components/loader'
import Paper from 'material-ui/lib/paper'
import Table from './table'
import ControlPaper from './control-paper'

export default React.createClass({
  getInitialState() {
    return {
      items: this.props.Api.cachedItems,
      loading: false,
      error: null,
      count: 20,
      search: ''
    }
  },

  componentWillMount() {
    this.props.Api.onLoaded(this.onLoaded)
    this.props.Api.onLoading(this.onLoading)
    this.props.Api.onError(this.onError)
    !this.state.items.length && this.props.Api.loadAll()
  },

  componentWillUnmount() {
    this.props.Api.removeErrorListener(this.onError)
    this.props.Api.removeLoadingListener(this.onLoading)
    this.props.Api.removeLoadedListener(this.onLoaded)
  },

  onError(error) {
    this.setState({error, loading: false})
  },

  onLoaded(items) {
    this.setState({items, loading: false})
  },

  onLoading() {
    this.setState({loading: true})
  },

  handleSearch(event) {
    event.preventDefault()
    event.stopPropagation()
    this.setState({search: event.target.value, count: 20})
  },

  render() {
    return (
      <div style={{position: 'relative'}}>
        <Paper style={{display: 'inline-block', boxSizing: 'border-box', width: '30%'}}>
          <div style={{height: 100}}>
            <TextField
              hintText={`${this.props.name.toLowerCase()} by name`}
              floatingLabelText={`Search ${this.props.name.toLowerCase()}`}
              inputStyle={{marginLeft: 5}}
              hintStyle={{marginLeft: 5}}
              style={{width: '96%', margin: '0 2%'}}
              floatingLabelStyle={{marginLeft: 5}}
              onChange={this.handleSearch} />
          </div>
          {this.state.loading && <Loader />}
          {
            !this.state.loading && this.state.items.length > 0 &&
                <Table
                  name={this.props.name}
                  search={this.state.search}
                  items={this.state.items}
                  count={this.state.count}
                  handleMore={() => this.setState(({count}) => ({count: count + 20}))} />
          }
        </Paper>
        <ControlPaper initTop={this.props.initTop}/>
      </div>
    )
  }
})
