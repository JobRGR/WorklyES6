import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Card from 'material-ui/lib/card/card'
import CardTitle from 'material-ui/lib/card/card-title'
import FlatButton from 'material-ui/lib/flat-button'
import CardText from 'material-ui/lib/card/card-text'
import Done from  'material-ui/lib/svg-icons/action/done'
import TextField from 'material-ui/lib/TextField/TextField'

export default React.createClass({
  mixins: [PureRenderMixin],

  getInitialState() {
    return {worklyName: localStorage.worklyName || null, name: ''}
  },

  handleClick() {
    this.setState(({name}) => {
      localStorage.worklyName = name
      return {worklyName: name}
    })
  },

  send() {
    return (
      <CardText style={{marginTop: -25}}>
        <TextField
          floatingLabelText="Ім'я"
          hintText="Додати ім'я"
          ref='name'
          inputStyle={{marginLeft: 5}}
          hintStyle={{marginLeft: 5}}
          floatingLabelStyle={{marginLeft: 5}}
          fullWidth
          onChange={event =>  this.setState({name: event.target.value})}
        />
        <TextField
          hintText='Додати email'
          floatingLabelText='Email'
          inputStyle={{marginLeft: 5}}
          hintStyle={{marginLeft: 5}}
          fullWidth
          floatingLabelStyle={{marginLeft: 5}}
        />
        <FlatButton
          label='Відправити'
          secondary
          onClick={this.handleClick}
          style={{width: '100%', marginTop: '15px'}}
        />
      </CardText>
    )
  },

  render() {
    return (
      <div className='index'>
        <div className='index-head'>
          <span className='index-logo'>Workly</span>
          <div className='index-bg'></div>
          <div className='index-text'>
            <h1>Шукаєш Свій Шлях в IT?</h1>
            <h3>Кожен день безліч компаній відкривають вакасії<br />стажування та практик, шукаючи саме тебе</h3>
          </div>
        </div>
        <Card style={{
          margin: '40px auto',
          maxWidth: 750,
          width: '100%',
          position: 'relative',
          top: -185,
          padding: 20
        }}>
          <CardTitle
            subtitle={(
              this.state.worklyName
              ? <span><Done style={{top: 5, left: -10, position: 'relative'}}/>{this.state.worklyName}, дякуємо за реєстрацію</span>
              : 'Дізнайся про відкриття першим'
            )}
            title={this.state.worklyName ? '' : 'Залиш свої контактні дані'}
            titleStyle={{
              fontSize: 36,
              textAlign: 'center',
              paddingBottom: 5
            }}
            subtitleStyle={{
              fontSize: 20,
              textAlign: 'center'
            }}
          />
          {!this.state.worklyName && this.send()}
        </Card>
      </div>
    )
  }
})
