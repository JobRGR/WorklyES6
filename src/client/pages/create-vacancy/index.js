import React, {Component} from 'react'
import {browserHistory} from 'react-router'
import AvatarName from '../../components/avatar-name'
import {Card, CardTitle} from 'material-ui/Card'
import {RadioButtonGroup, RadioButton} from 'material-ui/RadioButton'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import Snackbar from 'material-ui/Snackbar'
import Divider from 'material-ui/Divider'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import ContentAdd from 'material-ui/svg-icons/content/add'
import ActionDelete from 'material-ui/svg-icons/action/delete'
import {blue500} from 'material-ui/styles/colors'
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
      testQuestions: [],
      openQuestions: [],
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
    let {item, testQuestions, openQuestions} = this.state
    arr.splice(ind, 1)
    this.setState({item, testQuestions, openQuestions})
  }
  
  addSkillItem = () => {
    let item = this.state.item
    let addSkill = this.state.addSkill
    if (!addSkill || !addSkill.trim()) return
    item.skills.push(addSkill)
    this.setState({item, addSkill: ''})
  }

  createVacancy = () => {
    let body = this.state.item
    if (this.state.openQuestions.length)
      body.openQuestions = this.state.openQuestions
    if (this.state.testQuestions.length)
      body.testQuestions = this.state.testQuestions
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

  handleOpenChange = (e, q) => {
    let openQuestions = this.state.openQuestions
    q[e.target.name] = e.target.value
    this.setState({openQuestions})
  }

  handleTestChange = (e, q) => {
    let testQuestions = this.state.testQuestions
    q[e.target.name] = e.target.value
    this.setState({testQuestions})
  }

  handleArrayChange = (e, arr, ind) => {
    let testQuestions = this.state.testQuestions
    arr[ind] = e.target.value
    this.setState({testQuestions})
  }

  handleSelectChange = (e, q, i, v) => {
    let testQuestions = this.state.testQuestions
    q.correct = v
    this.setState({testQuestions})
  }

  addOpen = () => {
    let openQuestions = this.state.openQuestions
    openQuestions.push({question: '', answer: ''})
    this.setState({openQuestions})
  }

  addTest = () => {
    let testQuestions = this.state.testQuestions
    testQuestions.push({question: '', answer: [], correct: null})
    this.setState({testQuestions})
  }

  addTestAnswer = (ans) => {
    let testQuestions = this.state.testQuestions
    ans.push('')
    this.setState({testQuestions})
  }

  delTestAnswer = (ans, ind) => {
    let testQuestions = this.state.testQuestions
    ans.splice(ind, 1)
    this.setState({testQuestions})
  }

  openQuestions = () => {
    return this.state.openQuestions.map((q, ind) => (
      <div key={`open-question-${ind}`} style={{width: '100%'}}>
        <TextField floatingLabelText='Відкрите питання'
                   style={{width: '100%'}}
                   multiLine={true}
                   value={q.question}
                   name='question'
                   onChange={(e) => this.handleOpenChange(e, q)} />
        <TextField floatingLabelText='Відповідь'
                   style={{width: '100%'}}
                   multiLine={true}
                   value={q.answer}
                   name='answer'
                   onChange={(e) => this.handleOpenChange(e, q)} />
        <div style={{width: '100%', margin: '5px 0'}}>
          <RaisedButton primary={true}
                        label='Видалити питання'
                        onClick={() => this.removeItem(this.state.openQuestions, ind)} />
        </div>
      </div>
    ))
  }

  testQuestions = () => {
    return this.state.testQuestions.map((q, ind) => (
      <div key={`test-question-${ind}`} style={{width: '100%'}}>
        <TextField floatingLabelText='Питання'
                   multiLine={true}
                   style={{width: 'calc(100% - 40px)'}}
                   value={q.question}
                   name='question'
                   onChange={(e) => this.handleTestChange(e, q)} />
        <FloatingActionButton mini={true} onClick={() => this.addTestAnswer(q.answer)}>
          <ContentAdd />
        </FloatingActionButton>
        {
          q.answer.map((ans, index, arr) => ([
            <TextField floatingLabelText='Варіант відповіді'
                       style={{width: 'calc(100% - 40px)'}}
                       multiLine={true}
                       value={ans}
                       name='question-answer'
                       onChange={(e) => this.handleArrayChange(e, arr, index)} />,
            <FloatingActionButton mini={true} onClick={() => this.delTestAnswer(q.answer, index)}>
              <NavigationClose />
            </FloatingActionButton>
          ]))
        }
        <SelectField value={q.correct}
                     fullWidth={true}
                     className='question-text'
                     floatingLabelText='Правильна відповідь'
                     onChange={(e, i, v) => this.handleSelectChange(e, q, i, v)} >
          {
            q.answer.map((ans, index) => (
              <MenuItem value={index} primaryText={ans} />
            ))
          }
        </SelectField>
        <div style={{width: '100%', margin: '5px 0'}}>
          <RaisedButton primary={true}
                        label='Видалити питання'
                        onClick={() => this.removeItem(this.state.testQuestions, ind)} />
        </div>
      </div>
    ))
  }

  render() {
    //const preview = <div className='preview-block' dangerouslySetInnerHTML={this.rawMarkup()} />
    return (
      <Card className='vacancy-create'>
        <div className='vacancy-create-avatar'>
          <AvatarName
            src={this.props.item.avatar}
            name={this.props.item.name.name} size={90}
            text={<CardTitle title='Створення вакансії' subtitle={this.props.item.name.name} />}
          />
        </div>
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
          <RaisedButton label="Створити вакансію"
                        labelStyle={{textTransform: 'none', font: 'normal 18px sans-serif'}}
                        style={{marginTop: 20, width: '100%'}}
                        primary={true}
                        onClick={this.createVacancy} />
          <Snackbar
            open={this.state.open}
            message={this.state.message || ''}
            autoHideDuration={3000}
            onRequestClose={this.handleRequestClose} />
        </div>
        <div className='vacancy-create_right-side'>
          <div>
            <RaisedButton
              primary={true}
              className='question-add'
              label='Додати відкрите питання'
              style={{marginRight: 12}}
              onClick={this.addOpen} />
            <RaisedButton
              primary={true}
              className='question-add'
              label='Додати тестове питання'
              onClick={this.addTest} />
          </div>
          {this.state.openQuestions.length > 0 && <span className='vacancy-create-test-title'>Відкриті запитання</span>}
          {this.openQuestions()}
          {this.state.testQuestions.length > 0 && <span className='vacancy-create-test-title'>Тестові запитання</span>}
          {this.testQuestions()}
        </div>
      </Card>
    )
  }
}