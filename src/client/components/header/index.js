import React, {Component} from 'react'
import {browserHistory} from 'react-router'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import Popover from 'material-ui/Popover'
import Divider from 'material-ui/Divider'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import Home from 'material-ui/svg-icons/action/home'
import ExitToApp from 'material-ui/svg-icons/action/exit-to-app'
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit'
import Explore from 'material-ui/svg-icons/action/explore'
import NewFile from 'material-ui/svg-icons/editor/insert-drive-file'
import AvatarHeader from '../avatar-header'
import request from '../../../client_api/utils/request'


export default class extends Component{
  constructor(props) {
    super(props)
    this.state = {open: false}
    this.handleAvatarClick = this.handleAvatarClick.bind(this)
  }

  signOut = () => {
    request({url: `${location.origin}/api/logout`})
      .then((data) => {
        if (data.err) {
          throw data.err
        }
        document.location.pathname = '/'
      })
      .catch(err => console.log(err))
  }

  handleAvatarClick(e) {
    e.preventDefault()
    this.setState({open: true, anchorEl: e.currentTarget})
  }

  handleRequestClose = () => {
    this.setState({open: false})
  }

  navigate = (path) => browserHistory.push(path)

  render() {
    let name = this.props.type ? (this.props.type == 'student'
      ? this.props.item.name
      : this.props.item.name.name) : ''
    return (
      <AppBar
        title={<span className='header-logo'>Workly</span>}
        iconElementLeft={<IconButton onClick={() => this.navigate('/feed')}><Home/></IconButton>}
        iconStyleRight={{margin: 0}}
        iconElementRight={
          <div>
            {this.props.item && <AvatarHeader name={name} src={this.props.item.avatar} handleClick={this.handleAvatarClick}/>}
            <Popover
              open={this.state.open}
              anchorEl={this.state.anchorEl}
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
              style={{marginTop: 5}}
              onRequestClose={this.handleRequestClose}>
              <Menu desktop={true}>
                {
                  this.props.type == 'company' && [
                    <MenuItem
                      key='Мої вакансії'
                      primaryText='Мої вакансії'
                      leftIcon={<Explore />}
                      onClick={() => this.navigate('/vacancy')} />,
                    <MenuItem
                      key='Створити вакансію'
                      primaryText='Створити вакансію'
                      leftIcon={<NewFile />}
                      onClick={() => this.navigate('/vacancy/create')} />
                  ]
                }
                <MenuItem
                  primaryText='Редагувати профіль'
                  leftIcon={<ModeEdit/>}
                  onClick={() => this.navigate('/edit')} />
                <Divider />
                <MenuItem
                primaryText='Вийти'
                  leftIcon={<ExitToApp/>}
                  onClick={this.signOut} />
              </Menu>
            </Popover>
          </div>
        } />
    )
  }
}
