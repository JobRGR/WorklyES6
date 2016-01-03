import React from 'react'
import {browserHistory} from 'react-router'
import AppBar from 'material-ui/lib/app-bar'
import IconButton from 'material-ui/lib/icon-button'
import FlatButton from 'material-ui/lib/flat-button'
import Menu from 'material-ui/lib/svg-icons/navigation/menu'
import LeftNav from 'material-ui/lib/left-nav'
import MenuItem from 'material-ui/lib/menus/menu-item'
import RaisedButton from 'material-ui/lib/raised-button'
import AdminService from '../../service/admin'


export default React.createClass({
  getInitialState() {
   return {open: false}
  },

  handleToggle() {
    this.setState({open: !this.state.open})
  },

  handleClose() {
    this.setState({open: false})
  },

  logout() {
    AdminService.logout()
  },

  navigate(path) {
    browserHistory.push(path)
    this.handleClose()
  },

  nav() {
    return (
      <div>
        <IconButton iconStyle={{fill: '#fff', color: '#fff'}} onTouchTap={this.handleToggle}>
          <Menu />
        </IconButton>
        <LeftNav
          docked={false} width={300}
          open={this.state.open}
          onRequestChange={open => this.setState({open})}
        >
          <MenuItem onTouchTap={() => this.navigate('/admin/')}>Server Info</MenuItem>
          <MenuItem onTouchTap={() => this.navigate('/admin/dictionary')}>Dictionary Dashboard</MenuItem>
        </LeftNav>
      </div>
    )
  },

  render() {
    return (
      <AppBar
        title='Admin'
        iconElementLeft={this.props.admin && this.nav()}
        iconElementRight={this.props.admin && <FlatButton label='Log Out' onClick={this.logout} />}
      />
    )
  }
})
