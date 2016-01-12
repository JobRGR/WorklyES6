import React from 'react'
import TextField from 'material-ui/lib/TextField/TextField'
import FlatButton from 'material-ui/lib/flat-button'
import Table from './table'
import Add from './add'
import Remove from './remove'
import Edit from './edit'
import Loader from '../../../components/loader'


export default React.createClass({
  getInitialState() {
    return {
      items: this.props.Api.cachedItems, loading: false, error: null,
      count: 20, search: ''
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

  handleEdit(edit) {
   this.refs.edit.handleEdit(edit)
  },

  handleRemove(id) {
    this.refs.remove.handleRemove(id)
  },

  handleAdd() {
    this.refs.add.handleAdd(true)
  },

  render() {
    return (
      <div>
        <div style={{height: 100}}>
          <span style={{fontSize: 24, paddingTop: 16, marginBottom: 12,  marginLeft: 16,  fontWeight: 400}}>
            {this.props.name}
          </span>
          <TextField
            hintText={`Add ${this.props.name.toLowerCase()}`}
            floatingLabelText={`Search ${this.props.name.toLowerCase()}`}
            inputStyle={{marginLeft: 5}}
            hintStyle={{marginLeft: 5}}
            style={{width: 300, marginLeft: 30}}
            floatingLabelStyle={{marginLeft: 5}}
            onChange={this.handleSearch} />
          <FlatButton
            style={{marginLeft: 30}}
            label={`Add ${this.props.name.toLowerCase()}`}
            primary={true}
            onTouchTap={this.handleAdd} />
        </div>
        {this.state.loading && <div style={{height: 300}}><Loader /></div>}
        {
          !this.state.loading && this.state.items.length > 0 &&
          <Table
            name={this.props.name}
            search={this.state.search}
            items={this.state.items}
            count={this.state.count}
            handleEdit={this.handleEdit}
            handleRemove={this.handleRemove}
            handleMore={() => this.setState(({count}) => ({count: count + 20}))} />
        }
        <Add name={this.props.name} Api={this.props.Api} ref='add' />
        <Remove name={this.props.name} Api={this.props.Api} ref='remove' />
        <Edit name={this.props.name} Api={this.props.Api} ref='edit' />
      </div>
    )
  }
})
