import React, {Component} from 'react'
import {browserHistory} from 'react-router'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import Snackbar from 'material-ui/Snackbar'
import Divider from 'material-ui/Divider'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import ActionDelete from 'material-ui/svg-icons/action/delete'
import {green500} from 'material-ui/styles/colors'
import {VacancyApi} from '../../../client_api'
import marked from 'marked'

export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      item: {
        name: null, 
        city: null,
        skills: [],
        about: ''
      },
      addSkill: null,
      open: false,
      message: null
    }
  }
  
  handleRequestClose = () => this.setState({open: false})

  rawMarkup = () => ({ __html: marked(this.state.item.about, {sanitize: true})})

  _handleTextFieldChange = (e) => {
    e.preventDefault()
    e.stopPropagation()
    let item = this.state.item
    item[e.target.name] = e.target.value
    this.setState({item})
  }

  _handleAddSkillChange = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({addSkill: e.target.value})
  }

  removeItem = (arr, ind) => {
    let item = this.state.item
    arr.splice(ind, 1)
    this.setState({item})
  }
  
  addSkillItem = () => {
    let item = this.state.item
    let addSkill = this.state.addSkill
    if (!addSkill || !addSkill.trim()) return
    item.skills.push(addSkill)
    this.setState({item})
  }

  createVacancy = () => {
    let body = this.state.item
    VacancyApi
      .addItem(body)
      .then(({data}) => {
        if (data.err) throw data.err
        browserHistory.push('/vacancy')
      })
      .catch(err => {
        console.log(err)
        this.setState({open: true, message: 'Упс... Щось пійшло не так'})
      })
  }

  render() {
    return (
      <div className='vacancy-create'>
        <div className='vacancy-create_left-side'>
          <TextField floatingLabelText={'Заголовок вакансії'}
                     value={this.state.item.name}
                     name='name'
                     fullWidth={true}
                     onChange={this._handleTextFieldChange} />
          <TextField floatingLabelText='Місто'
                     value={this.state.item.city}
                     name='city'
                     fullWidth={true}
                     onChange={this._handleTextFieldChange} />
          <TextField floatingLabelText={'Вимоги, Обов\'язки, Пропонуємо'}
                     value={this.state.item.about}
                     name='about'
                     fullWidth={true}
                     multiLine={true}
                     onChange={this._handleTextFieldChange} />
          <div className='preview-block'
               dangerouslySetInnerHTML={this.rawMarkup()}/>
          <Divider style={{}}/>
          {
            this.state.item.skills.map((skill, ind, arr) => (
              <div className='skill-item'>
                {skill}
                <NavigationClose onClick={() => this.removeItem(arr, ind)}
                                 style={{cursor: 'pointer', verticalAlign: 'middle'}}
                                 color='#ffffff' />
              </div>
            ))
          }
          <div className='add-skill'>
            <TextField hintText='Вміння'
                       value={this.state.addSkill}
                       style={{maxWidth: 150}}
                       name='addSkill'
                       onChange={this._handleAddSkillChange} />
            <RaisedButton label="Додати"
                          labelStyle={{textTransform: 'none', font: 'normal 16px sans-serif'}}
                          primary={true}
                          onClick={this.addSkillItem} />
          </div>
          <RaisedButton label="Створити вакансію"
                        labelStyle={{textTransform: 'none', font: 'normal 18px sans-serif'}}
                        style={{marginTop: 20, width: '100%'}}
                        secondary={true}
                        onClick={this.createVacancy} />
          <Snackbar
            open={this.state.open}
            message={this.state.message || ''}
            autoHideDuration={3000}
            onRequestClose={this.handleRequestClose} />
        </div>
        <div className='vacancy-create_right-side'></div>
      </div>
    )
  }
}