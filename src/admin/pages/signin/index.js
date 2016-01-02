import React from 'react'
import Card from 'material-ui/lib/card/card'
import CardHeader from 'material-ui/lib/card/card-header'
import TextField from 'material-ui/lib/TextField/TextField'
import RefreshIndicator from 'material-ui/lib/refresh-indicator'
import FlatButton from 'material-ui/lib/flat-button'
import AdminService from '../../service/admin'


export default React.createClass({
  getInitialState() {
    return {
      name: '',
      password: '',
      error: null,
      loading: false
    }
  },

  handleChange(event, type) {
    this.setState({[type]: event.target.value})
  },

  handleClick() {
    this.setState({loading: true})
    AdminService
      .login(this.state)
      .then(({data}) => data.admin ? AdminService.setAdmin(data.admin) : this.setError())
      .then(() => this.setError())
  },

  setError() {
    this.setState({error: true, loading: false})
  },

  render() {
    return (
      <Card initiallyExpanded style={{
        padding: '30px 40px 30px 40px',
        width: 600,
        margin: '80px auto 0'
      }}>
        {
          this.state.loading &&
          <RefreshIndicator
            size={40}
            style={{
              float: 'right',
              position: 'relative',
              boxShadow: 'none'
            }}
            top={0}
            left={0}
            status='loading'
          />
        }
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
