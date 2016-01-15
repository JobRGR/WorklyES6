import React from 'react'
import TextField from 'material-ui/lib/TextField/TextField'
import FlatButton from 'material-ui/lib/flat-button'
import Loader from '../../../components/loader'
import Paper from 'material-ui/lib/paper'
import Table from './table'
import ControlPaper from './control-paper'
import Remove from '../../dictionary/item/remove'
import EditMail from './edit-mail'
import EditPass from './edit-pass'
import Add from './add'

export default React.createClass({
  getInitialState() {
    return {
      items: this.props.Api.cachedItems,
      currentItemId: null,
      currentItem: null,
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
    let currentItem = null
    if (this.state.currentItemId) {
      currentItem = items.filter(item => item._id == this.state.currentItemId)
      if (currentItem.length)
        this.setState({items, loading: false, currentItem: currentItem[0]})
      else
        this.setState({items, loading: false, currentItemId: null})
    }
    else
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

  handleRemove(id) {
    this.refs.remove.handleRemove(id)
  },

  handleEditMail(item) {
    this.refs.editMail.handleEdit(item)
  },

  handleEditPass(item) {
    this.refs.editPass.handleEdit(item)
  },

  handleLoginAs(item) {

  },

  handleRowSelection(currentItemId) {
    let currentItem = this.state.items.filter(item => item._id == currentItemId)[0]
    this.setState({currentItemId, currentItem})
  },

  render() {
    return (
      <div style={{position: 'relative'}}>
        <Paper style={{display: 'inline-block', boxSizing: 'border-box', width: '50%'}}>
          <div style={{height: 100}}>
            <TextField
              hintText={`${this.props.name.toLowerCase()} by name`}
              floatingLabelText={`Search ${this.props.name.toLowerCase()}`}
              inputStyle={{marginLeft: 5}}
              hintStyle={{marginLeft: 5}}
              floatingLabelStyle={{marginLeft: 5}}
              style={{width: '96%', margin: '0 2%'}}
              onChange={this.handleSearch} />
          </div>
          {
            this.state.loading &&
            <div style={{boxSizing: 'border-box', height: '130px', width: '100%'}}>
              <Loader />
            </div>
          }
          {
            !this.state.loading && this.state.items.length > 0 &&
                <Table
                  ref='table'
                  name={this.props.name}
                  search={this.state.search}
                  items={this.state.items}
                  count={this.state.count}
                  handleRowSelection={this.handleRowSelection}
                  handleRemove={this.handleRemove}
                  handleEditMail={this.handleEditMail}
                  handleEditPass={this.handleEditPass}
                  handleMore={() => this.setState(({count}) => ({count: count + 20}))} />
          }
          <Remove name={this.props.name} Api={this.props.Api} ref='remove' />
          <EditMail name={this.props.name} Api={this.props.Api} ref='editMail' />
          <EditPass name={this.props.name} Api={this.props.Api} ref='editPass' />
        </Paper>
        {
          this.state.currentItemId ?
            <ControlPaper name={this.props.name}
                          Api={this.props.Api}
                          item={this.state.currentItem}
                          initTop={this.props.initTop} /> :
            <div style={{display: 'inline-block', boxSizing: 'border-box', height: '200px', width: '55%'}}>
              <Loader />
            </div>
        }
        <Add name={this.props.name} Api={this.props.Api} ref='add' />
      </div>
    )
  }
})
