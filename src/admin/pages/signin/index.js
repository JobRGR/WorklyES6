import React from 'react'
import Card from 'material-ui/lib/card/card'
import CardHeader from 'material-ui/lib/card/card-header'
import TextField from 'material-ui/lib/TextField/TextField'
import FlatButton from 'material-ui/lib/flat-button'

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
    console.log(this.state)
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
          style={{padding: 0, height: 30}}
          subtitle={this.state.error ? 'Incorrect name or password' : ''}
        />
        <TextField
          hintText='Add name'
          floatingLabelText='Name'
          inputStyle={{marginLeft:'5px'}}
          hintStyle={{marginLeft:'5px'}}
          floatingLabelStyle={{marginLeft:'5px'}}
          fullWidth
          onChange={event => this.handleChange(event, 'name')}
        />
        <TextField
          hintText='Add password'
          floatingLabelText='Password'
          inputStyle={{marginLeft:'5px'}}
          hintStyle={{marginLeft:'5px'}}
          fullWidth
          floatingLabelStyle={{marginLeft:'5px'}}
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
