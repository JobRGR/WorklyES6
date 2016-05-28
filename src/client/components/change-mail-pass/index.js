import React, {Component} from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import Snackbar from 'material-ui/Snackbar'


export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      message: null,
      email: props.email,
      errorMail: null,
      errorPass: null,
      password: null,
      rePassword: null
    }
  }

  _handleTextFieldChange = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({[e.target.name]: e.target.value})
  }

  handleRequestClose = () => {
    this.setState({open: false})
  }

  changeEmail = () => {
    let email = this.state.email
    if (/\S+@\S+\.\S+/.test(email) == false)
      return this.setState({errorMail: 'Некоректна електрона адреса'})
    this.setState({errorMail: null})
    this.props.api.changeEmailSelf({email})
      .then(({data}) => {
        if (data.err) throw data.err
        this.setState({open: true, message: 'Електрона пошта успішно змінена'})
      })
      .catch(err => {
        console.log(err)
        this.setState({open: true, message: 'Упс... Щось пійшло не так'})
      })
  }

  changePassword = () => {
    let {password, rePassword} = this.state
    if (!password || password.length < 4)
      return this.setState({errorPass: 'Мінімальна довжина паролю - 4 символи'})
    if (password != rePassword)
      return this.setState({errorPass: 'Паролі не співпадають'})
    this.setState({errorPass: null})
    this.props.api.changePasswordSelf({password})
      .then(({data}) => {
        if (data.err) throw data.err
        this.setState({open: true, message: 'Пароль успішно змінений'})
      })
      .catch(err => {
        console.log(err)
        this.setState({open: true, message: 'Електрона пошта успішно змінена'})
      })
  }

  render() {
    return (
      <div>
        <TextField floatingLabelText={'Електрона пошта'}
                   style={{marginTop: 40}}
                   value={this.state.email}
                   errorText={this.state.errorMail}
                   errorStyle={{textAlign: 'left'}}
                   name='email'
                   type='email'
                   fullWidth={true}
                   onChange={this._handleTextFieldChange} />
        <RaisedButton label="Змінити пошту"
                      labelStyle={{textTransform: 'none', font: 'normal 16px sans-serif'}}
                      primary={true}
                      onClick={this.changeEmail} />
        <TextField floatingLabelText={'Пароль'}
                   style={{marginTop: 40}}
                   value={this.state.password}
                   errorText={this.state.errorPass}
                   errorStyle={{textAlign: 'left'}}
                   name='password'
                   type='password'
                   fullWidth={true}
                   onChange={this._handleTextFieldChange} />
        <TextField floatingLabelText={'Повторити пароль'}
                   value={this.state.rePassword}
                   name='rePassword'
                   type='password'
                   fullWidth={true}
                   onChange={this._handleTextFieldChange} />
        <RaisedButton label="Змінити пароль"
                      labelStyle={{textTransform: 'none', font: 'normal 16px sans-serif'}}
                      primary={true}
                      onClick={this.changePassword} />
        <Snackbar
          open={this.state.open}
          message={this.state.message || ''}
          autoHideDuration={3000}
          onRequestClose={this.handleRequestClose} />
      </div>
    )
  }
}