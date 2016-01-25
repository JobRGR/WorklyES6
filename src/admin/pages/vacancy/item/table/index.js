import React from 'react'
import Table from 'material-ui/lib/table/table'
import IconButton from 'material-ui/lib/icon-button'
import ModeEdit from 'material-ui/lib/svg-icons/editor/mode-edit'
import Delete from 'material-ui/lib/svg-icons/action/delete'
import TableBody from 'material-ui/lib/table/table-body'
import TableHeader from 'material-ui/lib/table/table-header'
import TableFooter from 'material-ui/lib/table/table-footer'
import TableHeaderColumn from 'material-ui/lib/table/table-header-column'
import TableRow from 'material-ui/lib/table/table-row'
import TableRowColumn from 'material-ui/lib/table/table-row-column'
import FlatButton from 'material-ui/lib/flat-button'

export default React.createClass({
  getInitialState() {
    return {type: 'name', order: 1}
  },

  handleSort(newType) {
    this.setState(({type, order}) => ({type: newType, order: newType == type ? order * -1 : 1}))
  },

  render () {
    const items = this.props.items
      .filter(({name}) => name.indexOf(this.props.search) > -1)
      .sort((a, b) => a[this.state.type] > b[this.state.type] ? this.state.order : this.state.order * -1)
    return (
      <div>
        <Table>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn tooltip='Number' style={{width: '10%'}}>№</TableHeaderColumn>
              <TableHeaderColumn tooltip='Vacancy'>
                <span style={{cursor: 'pointer'}} onClick={() => this.handleSort('name')} >
                  Title {this.state.type == 'name' && (this.state.order == -1 ? <span>&#x25B4;</span> : <span>&#x25BE;</span>)}
                </span>
              </TableHeaderColumn>
              <TableHeaderColumn tooltip='Posted by'>
                <span style={{cursor: 'pointer'}} onClick={() => this.handleSort('company')}>
                  Company {this.state.type == 'company' && (this.state.order == -1 ? <span>&#x25B4;</span> : <span>&#x25BE;</span>)}
                </span>
              </TableHeaderColumn>
              <TableHeaderColumn tooltip='Edit' style={{width: '15%'}}>Edit</TableHeaderColumn>
              <TableHeaderColumn tooltip='Delete' style={{width: '15%'}}>Delete</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody showRowHover={true} stripedRows={false} displayRowCheckbox={false}>
            {
              items.slice(0, this.props.count).map((item, index) => (
                <TableRow key={index}>
                  <TableRowColumn style={{width: '10%'}}>{index + 1}</TableRowColumn>
                  <TableRowColumn>{item.name}</TableRowColumn>
                  <TableRowColumn>{item.company.name}</TableRowColumn>
                  <TableRowColumn style={{width: '15%'}}>
                    <IconButton onTouchTap={() => this.props.handleEdit(item)}><ModeEdit /></IconButton>
                  </TableRowColumn>
                  <TableRowColumn style={{width: '15%'}}>
                    <IconButton onTouchTap={() => this.props.handleRemove(item._id)}><Delete /></IconButton>
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