import React from 'react'
import IconButton from 'material-ui/IconButton'
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit'
import Delete from 'material-ui/svg-icons/action/delete'
import Mail from 'material-ui/svg-icons/content/mail'
import Lock from 'material-ui/svg-icons/action/lock'
import Home from 'material-ui/svg-icons/action/home'
import {Table, TableBody, TableHeader, TableFooter, TableHeaderColumn, TableRow, TableRowColumn}
  from 'material-ui/Table'
import FlatButton from 'material-ui/FlatButton'


export default React.createClass({
  getInitialState() {
    let type = 'name'
    let order = 1
    let items = this.props.items
      .sort((a, b) => a[type] > b[type] ? order : order * -1)
    return {type, order, items}
  },

  componentDidMount() {
    this.props.handleRowSelection(this.state.items[0]._id)
  },

  componentWillReceiveProps(nextProps) {
    let items = nextProps.items
      .filter(({name}) => name.indexOf(nextProps.search) > -1)
      .sort((a, b) => a[this.state.type] > b[this.state.type] ? this.state.order : this.state.order * -1)
    this.setState({items})
  },

  handleSort(type) {
    let order = type == this.state.type ? this.state.order * -1 : 1
    let items = this.state.items
      .sort((a, b) => a[type] > b[type] ? order : order * -1)
    this.setState({type, order, items})
  },

  handleRowSelection([index]) {
    this.props.handleRowSelection(this.state.items[index]._id)
  },

  render () {
    let items = this.state.items
    return (
      <div>
        <Table
          ref='table'
          selectable={true}
          onRowSelection={this.handleRowSelection}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn tooltip='Number' style={{width: '10px'}}>№</TableHeaderColumn>
              <TableHeaderColumn tooltip={this.props.name} style={{width: '23%', padding: '0px'}}>
                <span style={{cursor: 'pointer'}} onClick={() => this.handleSort('name')}>
                  {this.props.name} {this.state.type == 'name' && (this.state.order == -1 ? <span>&#x25B4;</span> : <span>&#x25BE;</span>)}
                </span>
              </TableHeaderColumn>
              <TableHeaderColumn tooltip='Delete' style={{width: '30px', padding: '0 10px 0 0'}}>Delete</TableHeaderColumn>
              <TableHeaderColumn tooltip='Edit email' style={{width: '30px', padding: '0 10px'}}>Edit mail</TableHeaderColumn>
              <TableHeaderColumn tooltip='Edit password' style={{width: '30px', padding: '0 10px'}}>Edit pass</TableHeaderColumn>
              <TableHeaderColumn tooltip={this.props.name} style={{width: '30px', padding: '0 30px 0 10px'}}>Log in as</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody showRowHover={true} stripedRows={false} displayRowCheckbox={false}>
            {
              items.slice(0, this.props.count).map((item, index) => (
                <TableRow key={item._id}>
                  <TableRowColumn style={{width: '10px'}}>{index + 1}</TableRowColumn>
                  <TableRowColumn style={{width: '23%', padding: '0px'}}>{item.name}</TableRowColumn>
                  <TableRowColumn style={{width: '30px', padding: '0 10px 0 0'}}>
                    <IconButton onTouchTap={() => this.props.handleRemove(item._id)}><Delete /></IconButton>
                  </TableRowColumn>
                  <TableRowColumn style={{width: '30px', padding: '0 10px'}}>
                    <IconButton onTouchTap={() => this.props.handleEditMail(item)}><Mail /></IconButton>
                  </TableRowColumn>
                  <TableRowColumn style={{width: '30px', padding: '0 10px'}}>
                    <IconButton onTouchTap={() => this.props.handleEditPass(item)}><Lock /></IconButton>
                  </TableRowColumn>
                  <TableRowColumn style={{width: '30px', padding: '0 30px 0 10px'}}>
                    <IconButton disabled onTouchTap={() => this.props.handleLoginAs(item)}><Home /></IconButton>
                  </TableRowColumn>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
        {
          this.props.count < items.length &&
          <FlatButton
            label='More'
            secondary
            style={{width: '100%'}}
            onClick={this.props.handleMore} />
        }
      </div>
    )
  }
})