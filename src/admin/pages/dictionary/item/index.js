import React from 'react'
import TextField from 'material-ui/lib/TextField/TextField'
import Table from '../table'
import FlatButton from 'material-ui/lib/flat-button'
import Snackbar from 'material-ui/lib/snackbar'
import Edit from '../edit'
import Loader from '../../../components/loader'
import capitalize from '../../../tools/capitalize'


export default React.createClass({
  getInitialState() {
    return {
      items: this.props.Api.cachedItems, loading: false, error: null,
      count: 20,
      search: '',
      open: false, duration: 5000,
      edit: null
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

  handleEdit(edit = null) {
    this.setState({edit})
  },

  handleEditItem(event) {
    event.preventDefault()
    event.stopPropagation()
    this.setState(({edit}) => ({edit: {_id: edit._id, name: event.target.value}}))
  },

  saveEdit() {
    this.props.Api.editItem(this.state.edit._id, this.state.edit.name)
    this.handleEdit()
  },

  handleRemove(id) {
    this.undo = this.props.Api.removeItem(id, this.state.duration)
    this.setState({open: true})
    setTimeout(this.handleRequestClose, this.state.duration)
  },

  handleRequestClose() {
    delete this.undo
    this.setState({open: false})
  },

  handleActionTouchTap() {
    this.undo()
    this.handleRequestClose()
  },

  render() {
    const name = capitalize(this.props.name.toLowerCase())
    return (
      <div>
        <div style={{height: 100}}>
          <span style={{fontSize: 24, paddingTop: 16, marginBottom: 12,  marginLeft: 16,  fontWeight: 400}}>
            {this.props.name}
          </span>
          <TextField
            hintText={`Add ${name.toLowerCase()}`}
            floatingLabelText={`Search ${name.toLowerCase()}`}
            inputStyle={{marginLeft: 5}}
            hintStyle={{marginLeft: 5}}
            style={{width: 400, marginLeft: 50}}
            floatingLabelStyle={{marginLeft: 5}}
            onChange={this.handleSearch}
          />
        </div>
        {this.state.loading && <Loader />}
        {
          !this.state.loading && this.state.items.length > 0 &&
          <Table
            name={this.props.name}
            search={this.state.search}
            items={this.state.items}
            count={this.state.count}
            handleEdit={this.handleEdit}
            handleRemove={this.handleRemove}
            handleMore={() => this.setState(({count}) => ({count: count + 20}))}
          />
        }
        <Snackbar
          open={this.state.open}
          message={`${name} was removed`}
          action='undo'
          autoHideDuration={this.state.duration}
          onActionTouchTap={this.handleActionTouchTap}
          onRequestClose={this.handleRequestClose}
        />
        <Edit
          edit={this.state.edit}
          name={this.props.name}
          handleEdit={this.handleEdit}
          handleEditItem={this.handleEditItem}
          handleEdit={this.handleEdit}
          saveEdit={this.saveEdit}
        />
      </div>
    )
  }
})
