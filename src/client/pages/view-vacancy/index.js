import React, {Component} from 'react'
import {browserHistory} from 'react-router'
import {Card, CardHeader, CardText, CardActions} from 'material-ui/Card'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import CircularProgress from 'material-ui/CircularProgress'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import Divider from 'material-ui/Divider'
import CheckCircle from 'material-ui/svg-icons/action/check-circle'
import AvatarName from '../../components/avatar-name'
import {VacancyApi} from '../../../client_api'

export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [],
      openAnswers: this.props.item.openQuestions.map(el => null),
      testAnswers: this.props.item.testQuestions.map(el => null),
      loaded: false
    }
  }

  componentWillMount() {
    VacancyApi
      .searchItems({companyName: this.props.item.company.name.name})
      .then(({data}) => {
        if (data.err) throw data.err
        this.setState({loaded: true, items: data.vacancies.slice(0, 10)})
      })
      .catch(err => {
        console.log(err)
        this.setState({loaded: true, items: []})
      })
  }

  handleTextFieldChange = (e, i) => {
    let openAnswers = this.state.openAnswers
    openAnswers[i] = e.target.value
    this.setState({openAnswers})
  }

  handleRadioChange = (e, v, i) => {
    let testAnswers = this.state.testAnswers
    testAnswers[i] = Number(v)
    this.setState({testAnswers})
  }

  subscribe = () => {
    let correct = 0
    correct += this.props.item.openQuestions.reduce((sum, q, i) => {
      return (q.answer == this.state.openAnswers[i] ? 1 : 0)
    }, 0)
    correct += this.props.item.testQuestions.reduce((sum, q, i) => {
      return (q.correct == this.state.testAnswers[i] ? 1 : 0)
    })
    let testsResults = {
      correct,
      testAnswers: this.state.testAnswers,
      openAnswers: this.state.openAnswers
    }
    VacancyApi
      .subscribe(this.props.item._id, {testsResults})
      .then(({data}) => {
        if (data.err) throw data.err
        console.log(data)
        location.reload()
      })
      .catch(err => {
        console.log(err)
      })
  }

  navigate = (path) => browserHistory.push(path)

  haveSubscriptionState = () => {
    const spanStyle = {
      verticalAlign: 'middle',
      fontFamily: 'sans-serif',
      fontWeight: 400,
      fontSize: 20,
      marginLeft: 10
    }
    return (
      <div style={{width: '100%'}}>
        <Card>
          <CardHeader style={{textAlign: 'left'}}>
            <CheckCircle color={'#8BC34A'} style={{verticalAlign: 'middle', height: 35, width: 35}}/>
            <span style={spanStyle}>Ви вже відгукнулись</span>
          </CardHeader>
        </Card>
        <Card style={{marginTop: 20}}>
          <CardHeader title={'Інші вакансії компанії'}
                      titleStyle={{fontFamily: 'sans-serif', fontWeight: 700, fontSize: 18}} />
          <Divider/>
          {
            !this.state.loaded &&
            <div style={{width: '100%', textAlign: 'center', margin: '10px 0'}}>
              <CircularProgress size={1.5}/>
            </div>
          }
          {
            this.state.loaded &&
            this.state.items
              .map(item => (
                <div className='vacancy-item'
                     onClick={() => this.navigate(`/feed/${item._id}`)}>
                  {item.name}
                </div>
              ))
          }
        </Card>
      </div>
    )
  }

  notHaveSubscriptionState = () => {
    let openQuestions = this.props.item.openQuestions,
      testQuestions = this.props.item.testQuestions
    return (
      <Card>
        <div style={{padding: 10, boxSizing: 'border-box', width: '100%'}}>
          {
            openQuestions.length && [
              <h4>Питання з розгорнутою відповіддю</h4>,
              ...openQuestions.map((q, ind) => (
                <div key={q._id} className='question-item'>
                  <div className='question-problem'>{q.question}</div>
                  <TextField label='Відповідь'
                             fullWidth={true}
                             id={q._id}
                             onClick={(e) => this.handleTextFieldChange(e, ind)} />
                </div>
              ))
            ]
          }
          {
            testQuestions.length && [
              <h4>Питання з варіантами вибору</h4>,
              ...testQuestions.map((q, ind) => (
                <div key={q._id} className='question-item'>
                  <div className='question-problem'>{q.question}</div>
                  <RadioButtonGroup name={q._id}
                                    onChange={(e, val) => this.handleRadioChange(e, val, ind)}>
                    {
                      q.answer.map((ans, index) => (
                        <RadioButton value={index.toString()}
                                     label={ans} />
                      ))
                    }
                  </RadioButtonGroup>
                </div>
              ))
            ]
          }
        </div>
        <RaisedButton label='Завершити все та відгукнутись'
                      labelStyle={{textTransform: 'none'}}
                      style={{width: '100%'}}
                      secondary={true}
                      onClick={this.subscribe}/>
      </Card>
    )
  }

  render() {
    return (
      <div className='view-vacancy'>
        <div className='view-vacancy_left-side'>
          <AvatarName src={this.props.item.company.avatar}
                      name={this.props.item.name}
                      companyName={this.props.item.company.name.name}
                      companyId={this.props.item.company._id}
                      city={this.props.item.city && this.props.item.city.name}
                      dob={this.props.item.createdAt} />
          {
            this.props.item.about &&
            <div className='vacancy-about'>{this.props.item.about}</div>
          }
          {
            this.props.item.skills.map((skill) => (
              <div key={skill._id} className='skill-item'>{skill.name}</div>
            ))
          }
        </div>
        <div className='view-vacancy_right-side'>
          {this.props.item.haveSubscription && this.haveSubscriptionState()}
          {!this.props.item.haveSubscription && this.notHaveSubscriptionState()}
        </div>
      </div>
    )
  }
}