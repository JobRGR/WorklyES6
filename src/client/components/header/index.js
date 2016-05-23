import React, {Component} from 'react'
import {browserHistory} from 'react-router'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import request from '../../../client_api/utils/request'


export default class extends Component{
  signOut = () => {
    request({url: `${location.origin}/api/logout`})
      .then((data) => {
        if (data.err) throw err
        location.reload()
      })
      .catch(err => console.log(err))
  }

  navigate = (path) => browserHistory.push(path)

  render() {
    return (
      <AppBar title={<span className='header-logo'>Workly</span>}
              iconElementRight={
                <IconMenu
                  iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                  targetOrigin={{horizontal: 'right', vertical: 'top'}}
                  anchorOrigin={{horizontal: 'right', vertical: 'top'}} >
                  <MenuItem primaryText='Редагувати профіль' onClick={() => this.navigate('/edit')} />
                  <MenuItem primaryText='Вийти' onClick={this.signOut} />
                </IconMenu>
              } />
    )
  }
}
