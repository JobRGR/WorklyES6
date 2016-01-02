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
  render () {
    const items = this.props.items.filter(({name}) => name.indexOf(this.props.search) > -1)
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
              items.slice(0, this.props.count).map((item, index) => (
                <TableRow key={index}>
                  <TableRowColumn style={{width: '10%'}}>{index + 1}</TableRowColumn>
                  <TableRowColumn>{item._id}</TableRowColumn>
                  <TableRowColumn>{item.name}</TableRowColumn>
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
            onClick={this.props.handleMore}
          />
        }
      </div>
    )
  }
})