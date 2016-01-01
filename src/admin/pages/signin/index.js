import React from 'react'
import Card from 'material-ui/lib/card/card'
import CardHeader from 'material-ui/lib/card/card-header'
import TextField from 'material-ui/lib/TextField/TextField'
import FlatButton from 'material-ui/lib/flat-button'
import AdminService from '../../service/admin'

export default React.createClass({
  getInitialState() {
    return {
      name: '',
      password: '',
      error: null
    }
  },

  handleChange(event, type) {
    this.setState({[type]: event.target.value})
  },

  handleClick() {
    AdminService
      .login(this.state)
      .then(({data}) => {
        if (data.admin) AdminService.setAdmin(data.admin)
        else this.setState({error: true})
      })
      .then(() => this.setState({error: true}))
  },

  render() {
    return (
      <Card initiallyExpanded style={{
        padding: '30px 40px 30px 40px',
        width: 600,
        margin: '80px auto 0'
      }}>
        <CardHeader
          title='Sign In'
          titleStyle={{fontSize: '30px'}}
          style={{padding: 0, height: 50}}
          subtitle={this.state.error ? 'Incorrect name or password' : ''}
          subtitleColor='#f44336'
          subtitleStyle={{marginTop: 7}}
        />
        <TextField
          hintText='Add name'
          floatingLabelText='Name'
          inputStyle={{marginLeft: 5}}
          hintStyle={{marginLeft: 5}}
          floatingLabelStyle={{marginLeft: 5}}
          fullWidth
          onChange={event => this.handleChange(event, 'name')}
        />
        <TextField
          hintText='Add password'
          floatingLabelText='Password'
          inputStyle={{marginLeft: 5}}
          hintStyle={{marginLeft: 5}}
          fullWidth
          floatingLabelStyle={{marginLeft: 5}}
          type='password'
          onChange={event => this.handleChange(event, 'password')}
        />
        <FlatButton
          label='Sign In'
          secondary
          onClick={this.handleClick}
          style={{width: '100%', marginTop: '15px'}}
        />
      </Card>
    )
  }
})
