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
    const {items} = this.props
    const width = {width: '18%'}
    return (
      <div style={{marginTop: 20}}>
        <Table>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn tooltip='Number'>№</TableHeaderColumn>
              <TableHeaderColumn tooltip='Type'>Type</TableHeaderColumn>
              <TableHeaderColumn tooltip='Status'>Status</TableHeaderColumn>
              <TableHeaderColumn tooltip='Path' style={{width: '25%'}}>Path</TableHeaderColumn>
              <TableHeaderColumn tooltip='Date' style={width}>Date</TableHeaderColumn>
              <TableHeaderColumn tooltip='IP' style={width}>IP</TableHeaderColumn>
              <TableHeaderColumn tooltip='Time (ms)'>Time</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody showRowHover={true} stripedRows={false} displayRowCheckbox={false}>
            {
              items.slice(0, this.props.count).map((item, index) => (
                <TableRow key={index}>
                  <TableRowColumn>{index + 1}</TableRowColumn>
                  <TableRowColumn>{item.req.type}</TableRowColumn>
                  <TableRowColumn>{item.req.status}</TableRowColumn>
                  <TableRowColumn style={{width: '25%'}}>{item.req.url}</TableRowColumn>
                  <TableRowColumn style={width}>{(new Date(item.date)).toLocaleString()}</TableRowColumn>
                  <TableRowColumn  style={width}>{item.ip}</TableRowColumn>
                  <TableRowColumn>{parseInt(item.req.time) / 1000}</TableRowColumn>
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
            onClick={this.props.handleCount} />
        }
      </div>
    )
  }
})