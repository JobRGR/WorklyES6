import React, {Component} from 'react'
import TextField from 'material-ui/TextField'
import DatePicker from 'material-ui/DatePicker'
import RaisedButton from 'material-ui/RaisedButton'
import Snackbar from 'material-ui/Snackbar'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import ActionDelete from 'material-ui/svg-icons/action/delete'
import AvatarName from '../../components/avatar-name'
import ChangeMailPass from '../../components/change-mail-pass'
import {green500} from 'material-ui/styles/colors'
import {CompanyApi} from '../../../client_api'

export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      item: this.clone(props.item),
      open: false,
      message: null,
      errorName: null
    }
  }

  clone = (item) => {
    return {
      name: item.name.name,
      email: item.email,
      about: item.about || '',
      site: item.site || '',
      avatar: item.avatar || '',
      city: item.city ? item.city.name : ''
    }
  }

  _handleTextFieldChange = (e) => {
    e.preventDefault()
    e.stopPropagation()
    let item = this.state.item
    item[e.target.name] = e.target.value
    this.setState({item})
  }

  handleRequestClose = () => {
    this.setState({open: false})
  }

  editUser = () => {
    let body = {}
    for (let key in this.state.item)
      if (!/email|name/.test(key)) body[key] = this.state.item[key]
    CompanyApi
      .updateSelf(body)
      .then(({data}) => {
        if (data.err) throw data.err
        this.setState({open: true, message: 'Дані успішно оновлені'})
      })
      .catch(err => {
        console.log(err)
        this.setState({open: true, message: 'Упс... Щось пійшло не так'})
      })
  }

  changeName = () => {
    let name = this.state.item.name
    if (!name || name.length < 3)
      return this.setState({errorName: 'Мінімальна довжина назви - 3 символи'})
    this.setState({errorName: null})
    CompanyApi.changeNameSelf({name})
      .then(({data}) => {
        if (data.err) throw data.err
        this.setState({open: true, message: 'Назва компанії успішно змінена'})
      })
      .catch(err => {
        console.log(err)
        this.setState({open: true, message: 'Упс... Щось пійшло не так'})
      })
  }

  render() {
    return (
      <div className='edit-user'>
        <div className='edit-user_left-side'>
          <AvatarName src={this.state.item.avatar} name={this.state.item.name}/>
          <TextField floatingLabelText='Сайт компанії'
                     value={this.state.item.site}
                     name='site'
                     fullWidth={true}
                     onChange={this._handleTextFieldChange} />
          <TextField floatingLabelText='Місто'
                     value={this.state.item.city}
                     name='city'
                     fullWidth={true}
                     onChange={this._handleTextFieldChange} />
          <TextField floatingLabelText='Про компанію'
                     value={this.state.item.about}
                     name='about'
                     multiLine={true}
                     fullWidth={true}
                     onChange={this._handleTextFieldChange} />
          <RaisedButton label="Завершити редагування"
                        labelStyle={{textTransform: 'none', font: 'normal 18px sans-serif'}}
                        style={{marginTop: 20, width: '100%'}}
                        secondary={true}
                        onClick={this.editUser} />
          <Snackbar
            open={this.state.open}
            message={this.state.message || ''}
            autoHideDuration={3000}
            onRequestClose={this.handleRequestClose} />
        </div>
        <div className='edit-user_right-side' style={{textAlign: 'center'}}>
          <TextField floatingLabelText={'Назва компанії'}
                     style={{marginTop: 40}}
                     value={this.state.item.name}
                     errorText={this.state.errorName}
                     errorStyle={{textAlign: 'left'}}
                     name='name'
                     fullWidth={true}
                     onChange={this._handleTextFieldChange} />
          <RaisedButton label="Змінити назву"
                        labelStyle={{textTransform: 'none', font: 'normal 16px sans-serif'}}
                        primary={true}
                        onClick={this.changeName} />
          <ChangeMailPass api={CompanyApi} email={this.props.item.email} />
        </div>
      </div>
    )
  }
}