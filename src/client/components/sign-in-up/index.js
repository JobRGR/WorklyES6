import React, {Component} from 'react'
import Drawer from 'material-ui/Drawer'
import {Tabs, Tab} from 'material-ui/Tabs'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import Snackbar from 'material-ui/Snackbar'
import {green700, red700} from 'material-ui/styles/colors'
import request from '../../../client_api/utils/request'

export default class extends Component {
  constructor(props){
    super(props)
    this.state = {
      open: false,
      signInState: null,
      isStudent: true,
      error: {
        nameText: null,
        passText: null,
        mailText: null,
        authText: null
      },
      inMail: null,
      inPass: null,
      upMail: null,
      upPass: null,
      upName: null
    }
  }

  signIn = () => {
    let email = this.state.inMail,
      password = this.state.inPass
    if (/\S+@\S+\.\S+/.test(email) == false) {
      return this.setState({error: {mailText: 'Некоректна електрона адреса'}})
    }
    if (!password || password.length < 4) {
      return this.setState({error: {passText: 'Мінімальна довжина паролю - 4 символи'}})
    }
    request({url: `${location.origin}/api/login`, method: 'post', body: {email, password}})
      .then(({data}) => {
        if (!data.err) return location.reload()
        this.setState({error: {authText: 'Неправильно вказана пошта чи пароль'}, open: true})
      })
  }

  signUp = () => {
    let email = this.state.upMail,
      password = this.state.upPass,
      name = this.state.upName
    if (!name || name.length < 4) {
      return this.setState({error: {nameText: 'Мінімальна довжина імені - 4 символи'}})
    }
    if (/\S+@\S+\.\S+/.test(email) == false) {
      return this.setState({error: {mailText: 'Некоректна електрона адреса'}})
    }
    if (!password || password.length < 4) {
      return this.setState({error: {passText: 'Мінімальна довжина паролю - 4 символи'}})
    }
    let url = `${location.origin}/api/${this.state.isStudent ? 'student': 'company'}`
    request({url, method: 'post', body: {email, password, name}})
      .then(({data}) => {
        if (!data.err) return location.reload()
        this.setState({error: {authText: 'Щось пійшло не так... Спробуйте пізніше'}, open: true})
      })
  }

  _handleTextFieldChange = (e, textFieldKey) => {
    const maxTextFieldLength = 50
    if (e.target.value.length > maxTextFieldLength)
      return false
    this.setState({[textFieldKey]: e.target.value})
  }

  getChoiceState = () => {
    return (
      <div>
        <div className='sign_text'>
          Lorem Ipsum is simply dummy text of the
          printing and typesetting industry. Lorem
          Ipsum has been the industry's standard dummy
          text ever since the 1500s
        </div>
        <RaisedButton label='Зареєструватись'
                      onClick={() => this.setState({signInState: false})}
                      primary={true}
                      labelStyle={{textTransform: 'none', fontSize: 18}}
                      style={{width: 250, margin: '5px'}} />
        <RaisedButton label='Увійти'
                      onClick={() => this.setState({signInState: true})}
                      primary={true}
                      labelStyle={{textTransform: 'none', fontSize: 18}}
                      style={{width: 250, margin: '5px'}} />
      </div>
    )
  }

  getSignInState = () => {
    return (
      <div>
        <TextField hintText='Введіть пошту'
                   floatingLabelText='Пошта'
                   errorText={this.state.error.mailText}
                   errorStyle={{textAlign: 'left'}}
                   onChange={(e) => this._handleTextFieldChange(e, 'inMail')}
                   name='inMail'
                   type='email'
                   value={this.state.inMail} />
        <TextField hintText='Введіть пароль'
                   floatingLabelText='Пароль'
                   errorText={this.state.error.passText}
                   errorStyle={{textAlign: 'left'}}
                   onChange={(e) => this._handleTextFieldChange(e, 'inPass')}
                   name='inPass'
                   type='password'
                   value={this.state.inPass} />
        <RaisedButton label='Увійти'
                      onClick={this.signIn}
                      primary={true}
                      labelStyle={{textTransform: 'none', fontSize: 18}}
                      style={{width: 250, margin: '5px'}} />
        <FlatButton label='Зареєструватись'
                    onClick={() => this.switchState({signInState: false})}
                    primary={true}
                    labelStyle={{textTransform: 'none', textDecoration: 'underline', fontSize: 14}}
                    style={{width: 250, margin: '5px'}} />
      </div>
    )
  }

  getSignUpState = () => {
    const name = this.state.isStudent ? 'Ім\'я та прізвище' : 'Назва компанії'
    return (
      <div>
        <Tabs value={this.state.isStudent}
              onChange={(value) => this.switchState({isStudent: value})}
              style={{width: 250, margin: 'auto'}}
              inkBarStyle={{backgroundColor: green700}}
              tabItemContainerStyle={{backgroundColor: 'none'}} >
          <Tab label='Студент' value={true} style={{color: green700, textTransform: 'none'}} />
          <Tab label='Компанія' value={false} style={{color: green700, textTransform: 'none'}} />
        </Tabs>
        <TextField floatingLabelText={name}
                   errorText={this.state.error.nameText}
                   errorStyle={{textAlign: 'left'}}
                   onChange={(e) => this._handleTextFieldChange(e, 'upName')}
                   name='upName'
                   value={this.state.upName} />
        <TextField hintText='Введіть пошту'
                   floatingLabelText='Пошта'
                   errorText={this.state.error.mailText}
                   errorStyle={{textAlign: 'left'}}
                   onChange={(e) => this._handleTextFieldChange(e, 'upMail')}
                   name='upMail'
                   type='email'
                   value={this.state.upMail} />
        <TextField hintText='Введіть пароль'
                   floatingLabelText='Пароль'
                   errorText={this.state.error.passText}
                   errorStyle={{textAlign: 'left'}}
                   onChange={(e) => this._handleTextFieldChange(e, 'upPass')}
                   name='upPass'
                   type='password'
                   value={this.state.upPass} />
        <RaisedButton label='Зареєструватись'
                      onClick={this.signUp}
                      primary={true}
                      labelStyle={{textTransform: 'none', fontSize: 18}}
                      style={{width: 250, margin: '5px'}} />
        <FlatButton label='Увійти'
                    onClick={() => this.switchState({signInState: true})}
                    primary={true}
                    labelStyle={{textTransform: 'none', textDecoration: 'underline', fontSize: 14}}
                    style={{width: 250, margin: '5px'}} />
      </div>
    )
  }

  switchState = (state) => {
    state.error = {}
    this.setState(state)
  }

  handleRequestClose = () => {
    this.setState({open: false})
  }


  render() {
    const drawerStyle = {textAlign: 'center', fontFamily: 'sans-serif'}
    return (
      <Drawer width={400} openSecondary={true} open={true} style={drawerStyle}>
        <div className='sign_center-block'>
          {this.state.signInState === true && this.getSignInState()}
          {this.state.signInState === false && this.getSignUpState()}
          {this.state.signInState === null && this.getChoiceState()}
        </div>
        <Snackbar
          open={this.state.open}
          message={this.state.error.authText || ''}
          autoHideDuration={3000}
          onRequestClose={this.handleRequestClose} />
      </Drawer>
    )
  }
}