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
import Loader from '../../../components/loader'


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
    if (this.state.items.length) return null
    this.props.Api.onLoaded(this.onLoaded)
    this.props.Api.onLoading(this.onLoading)
    this.props.Api.onError(this.onError)
    this.props.Api.loadAll()
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

  editItem(id) {
    this.props.Api.editItem(id)
  },

  removeItem(id) {
    this.props.Api.removeItem(id)
  },

  list() {
    const items = this.state.items.filter(({name}) => name.indexOf(this.state.search) > -1)
    return (
      <div>
        <Table>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn tooltip='Number'>№</TableHeaderColumn>
              <TableHeaderColumn tooltip='Id'>Id</TableHeaderColumn>
              <TableHeaderColumn tooltip={this.props.name}>{this.props.name}</TableHeaderColumn>
              <TableHeaderColumn tooltip='Edit'>Edit</TableHeaderColumn>
              <TableHeaderColumn tooltip='Delete'>Delete</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody showRowHover={true} stripedRows={false} displayRowCheckbox={false}>
            {
              items
                .slice(0, this.state.count)
                .map(({_id, name}, index) => (
                  <TableRow key={index}>
                    <TableRowColumn>{index + 1}</TableRowColumn>
                    <TableRowColumn>{_id}</TableRowColumn>
                    <TableRowColumn>{name}</TableRowColumn>
                    <TableRowColumn>
                      <IconButton onTouchTap={() => this.editItem(_id)}><ModeEdit /></IconButton>
                    </TableRowColumn>
                    <TableRowColumn>
                      <IconButton onTouchTap={() => this.removeItem(_id)}><Delete /></IconButton>
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
    return (
      <div>
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
          hintText={`Search ${this.props.name.toLowerCase()}`}
          floatingLabelText='Search'
          inputStyle={{marginLeft: 5}}
          hintStyle={{marginLeft: 5}}
          style={{width: 400, marginLeft: 50}}
          floatingLabelStyle={{marginLeft: 5}}
          onChange={this.handleSearch}
        />
        {this.state.loading && <Loader />}
        {!this.state.loading && this.state.items.length > 0 && this.list()}
      </div>
    )
  }
})
