import React from 'react'
import Table from 'material-ui/lib/table/table'
import IconButton from 'material-ui/lib/icon-button'
import ModeEdit from 'material-ui/lib/svg-icons/editor/mode-edit'
import Delete from 'material-ui/lib/svg-icons/action/delete'
import Mail from 'material-ui/lib/svg-icons/content/mail'
import Lock from 'material-ui/lib/svg-icons/action/lock'
import Home from 'material-ui/lib/svg-icons/action/home'
import TableBody from 'material-ui/lib/table/table-body'
import TableHeader from 'material-ui/lib/table/table-header'
import TableFooter from 'material-ui/lib/table/table-footer'
import TableHeaderColumn from 'material-ui/lib/table/table-header-column'
import TableRow from 'material-ui/lib/table/table-row'
import TableRowColumn from 'material-ui/lib/table/table-row-column'
import FlatButton from 'material-ui/lib/flat-button'


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
      .filter(({question}) => question.toLowerCase().indexOf(nextProps.search.toLowerCase()) > -1)
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
      <div >
        <Table
          ref='table'
          selectable={true}
          onRowSelection={this.handleRowSelection}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn tooltip='Number' style={{width: '10px'}}>№</TableHeaderColumn>
              <TableHeaderColumn tooltip='ID' style={{width: '23%', padding: '0px'}}>ID</TableHeaderColumn>
              <TableHeaderColumn tooltip='Delete' style={{width: '30px', padding: '0 10px 0 0'}}>Delete</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody showRowHover={true} stripedRows={false} displayRowCheckbox={false}>
            {
              items.slice(0, this.props.count).map((item, index) => (
                <TableRow key={item._id}>
                  <TableRowColumn style={{width: '10px'}}>{index + 1}</TableRowColumn>
                  <TableRowColumn style={{width: '23%', padding: '0px'}}>{item._id}</TableRowColumn>
                  <TableRowColumn style={{width: '30px', padding: '0 10px 0 0'}}>
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