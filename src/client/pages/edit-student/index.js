import React, {Component} from 'react'
import TextField from 'material-ui/TextField'
import DatePicker from 'material-ui/DatePicker'
import RaisedButton from 'material-ui/RaisedButton'
import {Card} from 'material-ui/Card'
import Snackbar from 'material-ui/Snackbar'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import ActionDelete from 'material-ui/svg-icons/action/delete'
import AvatarName from '../../components/avatar-name'
import ChangeMailPass from '../../components/change-mail-pass'
import {green500} from 'material-ui/styles/colors'
import {StudentApi} from '../../../client_api'

export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      item: this.clone(props.item),
      addSkill: null,
      open: false,
      message: null
    }
  }

  clone = (item) => {
    return {
      name: item.name,
      email: item.email,
      about: item.about || '',
      dob: item.dob || '',
      avatar: item.avatar || '',
      telephone: item.telephone || '',
      city: item.city ? item.city.name : '',
      skills: item.skills.map(el => el.name),
      educations: item.educations.map(({start, end, speciality, university}) =>
        ({start, end, speciality: speciality.name, university: university.name})),
      experiences: item.experiences.map(({start, end, about, companyName, position}) =>
        ({start, end, about, companyName: companyName.name, position: position.name}))
    }
  }

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

  _handleDateChange = (event, date) => {
    this.setState(({item}) => {
      item.dob = date
      return item
    })
  }

  _handleArrayChange = (e, el) => {
    let item = this.state.item
    el[e.target.name] = e.target.value
    this.setState({item})
  }

  _handleArrayDateChange = (el, key, val) => {
    let item = this.state.item
    el[key] = val
    this.setState({item})
  }

  handleRequestClose = () => {
    this.setState({open: false})
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

  addEducationItem = () => {
    let item = this.state.item
    item.educations.push({speciality: '', university: '', start: '', end: ''})
    this.setState({item})
  }

  addExperienceItem = () => {
    let item = this.state.item
    item.experiences.push({position: '', companyName: '', about: '', start: '', end: ''})
    this.setState({item})
  }

  editUser = () => {
    let body = {}
    for (let key in this.state.item)
      if (key != 'email') body[key] = this.state.item[key]
    StudentApi
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

  render() {
    return (
      <Card className='edit-user'>
        <div className='edit-user_left-side'>
          <AvatarName src={this.state.item.avatar} name={this.state.item.name} size={80} />
          <TextField floatingLabelText={'Ім\'я та Прізвище'}
                     value={this.state.item.name}
                     name='name'
                     fullWidth={true}
                     onChange={this._handleTextFieldChange} />
          <TextField floatingLabelText='Мобільний телефон'
                     value={this.state.item.telephone}
                     name='telephone'
                     fullWidth={true}
                     onChange={this._handleTextFieldChange} />
          <TextField floatingLabelText='Місто'
                     value={this.state.item.city}
                     name='city'
                     fullWidth={true}
                     onChange={this._handleTextFieldChange} />
          <DatePicker floatingLabelText='Дата народження'
                      mode="landscape"
                      style={{display: 'inline-block', width: '100%', boxSizing: 'border-box', verticalAlign: 'top'}}
                      textFieldStyle={{width: '100%', height: '72px'}}
                      value={this.state.item.dob ? new Date(this.state.item.dob) : ''}
                      onChange={this._handleDateChange} />
          <TextField floatingLabelText='Про себе'
                     value={this.state.item.about}
                     name='about'
                     multiLine={true}
                     fullWidth={true}
                     onChange={this._handleTextFieldChange} />
          <div className='add-skill'>
            <TextField hintText='Вміння'
                       value={this.state.addSkill}
                       style={{maxWidth: 150}}
                       name='addSkill'
                       onChange={this._handleAddSkillChange} />
            <RaisedButton label="Додати"
                          className='add-skill-btn'
                          labelStyle={{textTransform: 'none', font: 'normal 16px sans-serif'}}
                          primary={true} 
                          onClick={this.addSkillItem} />
          </div>
          <div className='skill-wrapper'>
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
          </div>
          <span className='user-edit-title'>Освіта</span>
          {
            this.state.item.educations.map((education, ind, arr) => (
              <div className='education-item'>
                <TextField floatingLabelText='Спеціальність'
                           value={education.speciality}
                           name='speciality'
                           fullWidth={true}
                           onChange={(e) => this._handleArrayChange(e, education)} />
                <ActionDelete onClick={() => this.removeItem(arr, ind)}
                              style={{cursor: 'pointer', verticalAlign: 'bottom', height: 25, width: 25, marginLeft: -25, marginTop: 22, position: 'absolute'}}
                              color='#00bcd4' />
                <TextField floatingLabelText='Місце навчання'
                           value={education.university}
                           name='university'
                           fullWidth={true}
                           onChange={(e) => this._handleArrayChange(e, education)} />
                <DatePicker floatingLabelText='Початок навчання'
                            mode="landscape"
                            style={{display: 'inline-block', width: '40%', boxSizing: 'border-box', verticalAlign: 'top'}}
                            textFieldStyle={{width: '100%', height: '72px'}}
                            value={education.start ? new Date(education.start) : ''}
                            onChange={(e, date) => this._handleArrayDateChange(education, 'start', date)} />
                <DatePicker floatingLabelText='Завершення навчання'
                            mode="landscape"
                            style={{display: 'inline-block', marginLeft: '5%', width: '40%', boxSizing: 'border-box', verticalAlign: 'top'}}
                            textFieldStyle={{width: '100%', height: '72px'}}
                            value={education.end ? new Date(education.end) : ''}
                            onChange={(e, date) => this._handleArrayDateChange(education, 'end', date)} />
              </div>
            ))
          }
          <div>
            <RaisedButton label="Додати місце навчання"
                          labelStyle={{textTransform: 'none', font: 'normal 16px sans-serif'}}
                          style={{marginBottom: 20, marginTop: 15}}
                          primary={true}
                          onClick={this.addEducationItem} />
          </div>
          <span className='user-edit-title'>Досвід</span>
          {
            this.state.item.experiences.map((experience, ind, arr) => (
              <div className='experience-item'>
                <TextField floatingLabelText='Посада'
                           value={experience.position}
                           name='position'
                           fullWidth={true}
                           onChange={(e) => this._handleArrayChange(e, experience)} />
                <ActionDelete onClick={() => this.removeItem(arr, ind)}
                              style={{cursor: 'pointer', verticalAlign: 'bottom', height: 25, width: 25, marginLeft: -25, marginTop: 22, position: 'absolute'}}
                              color='#00bcd4' />
                <TextField floatingLabelText='Місце роботи(компанія)'
                           value={experience.companyName}
                           name='companyName'
                           fullWidth={true}
                           onChange={(e) => this._handleArrayChange(e, experience)} />
                <TextField floatingLabelText={'Про обов\'язки'}
                           value={experience.about}
                           name='about'
                           multiLine={true}
                           fullWidth={true}
                           onChange={(e) => this._handleArrayChange(e, experience)} />
                <DatePicker floatingLabelText='Дата початку'
                            mode="landscape"
                            style={{display: 'inline-block', width: '40%', boxSizing: 'border-box', verticalAlign: 'top'}}
                            textFieldStyle={{width: '100%', height: '72px'}}
                            value={experience.start ? new Date(experience.start) : ''}
                            onChange={(e, date) => this._handleArrayDateChange(experience, 'start', date)} />
                <DatePicker floatingLabelText='Дата завершення'
                            mode="landscape"
                            style={{display: 'inline-block', marginLeft: '5%', width: '40%', boxSizing: 'border-box', verticalAlign: 'top'}}
                            textFieldStyle={{width: '100%', height: '72px'}}
                            value={experience.end ? new Date(experience.end) : ''}
                            onChange={(e, date) => this._handleArrayDateChange(experience, 'end', date)} />
              </div>
            ))
          }
          <div>
            <RaisedButton label="Додати місце роботи"
                          labelStyle={{textTransform: 'none', font: 'normal 16px sans-serif'}}
                          style={{marginBottom: 20}}
                          primary={true}
                          onClick={this.addExperienceItem} />
          </div>
          <RaisedButton label="Завершити редагування"
                        labelStyle={{textTransform: 'none', font: 'normal 18px sans-serif'}}
                        style={{marginTop: 20, width: '100%'}}
                        primary={true}
                        onClick={this.editUser} />
          <Snackbar
            open={this.state.open}
            message={this.state.message || ''}
            autoHideDuration={3000}
            onRequestClose={this.handleRequestClose} />
        </div>
        <div className='edit-user_right-side'>
          <ChangeMailPass api={StudentApi} email={this.props.item.email} />
        </div>
      </Card>
    )
  }
}