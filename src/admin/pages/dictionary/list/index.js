import React from 'react'
import TextField from 'material-ui/lib/TextField/TextField'
import Table from 'material-ui/lib/table/table'
import TableBody from 'material-ui/lib/table/table-body'
import TableHeader from 'material-ui/lib/table/table-header'
import TableFooter from 'material-ui/lib/table/table-footer'
import TableHeaderColumn from 'material-ui/lib/table/table-header-column'
import TableRow from 'material-ui/lib/table/table-row'
import TableRowColumn from 'material-ui/lib/table/table-row-column'
import IconButton from 'material-ui/lib/icon-button'
import FlatButton from 'material-ui/lib/flat-button'
import ModeEdit from 'material-ui/lib/svg-icons/editor/mode-edit'
import Delete from 'material-ui/lib/svg-icons/action/delete'
import Snackbar from 'material-ui/lib/snackbar'
import Dialog from 'material-ui/lib/dialog'
import Loader from '../../../components/loader'
import capitalize from '../../../tools/capitalize'


export default React.createClass({
  getInitialState() {
    return {
      items: this.props.Api.cachedItems,
      loading: false,
      error: null,
      count: 20,
      search: '',
      open: false,
      duration: 5000,
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

  removeItem(id) {
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

  list() {
    const items = this.state.items.filter(({name}) => name.indexOf(this.state.search) > -1)
    return (
      <div>
        <Table>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn tooltip='Number' style={{width: '10%'}}>№</TableHeaderColumn>
              <TableHeaderColumn tooltip='Id'>Id</TableHeaderColumn>
              <TableHeaderColumn tooltip={this.props.name}>{this.props.name}</TableHeaderColumn>
              <TableHeaderColumn tooltip='Edit' style={{width: '15%'}}>Edit</TableHeaderColumn>
              <TableHeaderColumn tooltip='Delete' style={{width: '15%'}}>Delete</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody showRowHover={true} stripedRows={false} displayRowCheckbox={false}>
            {
              items.slice(0, this.state.count).map((item, index) => (
                <TableRow key={index}>
                  <TableRowColumn style={{width: '10%'}}>{index + 1}</TableRowColumn>
                  <TableRowColumn>{item._id}</TableRowColumn>
                  <TableRowColumn>{item.name}</TableRowColumn>
                  <TableRowColumn style={{width: '15%'}}>
                    <IconButton onTouchTap={() => this.handleEdit(item)}><ModeEdit /></IconButton>
                  </TableRowColumn>
                  <TableRowColumn style={{width: '15%'}}>
                    <IconButton onTouchTap={() => this.removeItem(item._id)}><Delete /></IconButton>
                  </TableRowColumn>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
        {
          this.state.count < items.length &&
          <FlatButton
            label='More'
            secondary
            style={{width: '100%'}}
            onClick={() => this.setState(({count}) => ({count: count + 20}))}
          />
        }
      </div>
    )
  },

  render() {
    const name = capitalize(this.props.name.toLowerCase())
    return (
      <div>
        <div style={{height: 100}}>
          <span style={{
            fontSize: 24,
            paddingTop: 16,
            marginBottom: 12,
            marginLeft: 16,
            fontWeight: 400
          }}>
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
        {!this.state.loading && this.state.items.length > 0 && this.list()}
        <Snackbar
          open={this.state.open}
          message={`${name} was removed`}
          action='undo'
          autoHideDuration={this.state.duration}
          onActionTouchTap={this.handleActionTouchTap}
          onRequestClose={this.handleRequestClose}
        />
        <Dialog
          title={`Edit ${name}`}
          actions={[
            <FlatButton
              label='Cancel'
              secondary={true}
              onTouchTap={() => this.handleEdit()} />,
            <FlatButton
              label='Update'
              primary={true}
              keyboardFocused={true}
              onTouchTap={this.saveEdit} />
          ]}
          modal={false}
          open={this.state.edit ? true : false}
          onRequestClose={this.handleEdit}>
          <TextField
            hintText={`Edit ${name}`}
            floatingLabelText='Edit'
            inputStyle={{marginLeft: 5}}
            hintStyle={{marginLeft: 5}}
            floatingLabelStyle={{marginLeft: 5}}
            fullWidth
            value={this.state.edit ? this.state.edit.name : ''}
            onChange={this.handleEditItem}
          />
        </Dialog>
      </div>
    )
  }
})
