import React from 'react'
import {browserHistory} from 'react-router'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import Menu from 'material-ui/svg-icons/navigation/menu'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
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
        <Drawer
          docked={false} width={300}
          open={this.state.open}
          onRequestChange={open => this.setState({open})}
        >
          <MenuItem onTouchTap={() => this.navigate('/admin/')}>Server Info</MenuItem>
          <MenuItem onTouchTap={() => this.navigate('/admin/dictionary')}>Dictionary Dashboard</MenuItem>
          <MenuItem onTouchTap={() => this.navigate('/admin/user')}>User Dashboard</MenuItem>
          <MenuItem onTouchTap={() => this.navigate('/admin/question')}>Question Dashboard</MenuItem>
        </Drawer>
      </div>
    )
  },

  render() {
    return (
      <AppBar
        title='Control Panel'
        iconElementLeft={this.props.admin && this.nav()}
        iconElementRight={this.props.admin && <FlatButton label='Log Out' onClick={this.logout} />}
      />
    )
  }
})
