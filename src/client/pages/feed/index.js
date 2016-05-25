import React, {Component} from 'react'
import {Tabs, Tab} from 'material-ui/Tabs'
import {Card, CardHeader, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import {browserHistory} from 'react-router'
import {VacancyService, CompanyService, StudentService} from '../../service/feed'

const count = 15

const defaultState = {
  data: [],
  error: false,
  loading: false,
  count
}

const students = 'students'
const vacancies = 'vacancies'
const companies = 'companies'

export default class extends Component {

  constructor() {
    super()
    this.state = {
      students: {...defaultState, data: StudentService.cachedItems || []},
      vacancies: {...defaultState, data: VacancyService.cachedItems || []},
      companies: {...defaultState, data: CompanyService.cachedItems || []}
    }
  }

  subscribe(Service, onLoaded, onError, onLoading) {
    Service.onLoaded(onLoaded.bind(this))
    Service.onError(onError.bind(this))
    Service.onLoading(onLoading.bind(this))
  }

  unSubscribe(Service, onLoaded, onError, onLoading) {
    Service.removeLoadedListener(onLoaded.bind(this))
    Service.removeErrorListener(onError.bind(this))
    Service.removeLoadingListener(onLoading.bind(this))
  }

  componentWillMount() {
    this.subscribe(VacancyService, this.onLoadedVacancy, this.onErrorVacancy, this.onLoadingVacancy)
    this.subscribe(StudentService, this.onLoadedStudent, this.onErrorStudent, this.onLoadingStudent)
    this.subscribe(CompanyService, this.onLoadedCompany, this.onErrorCompany, this.onLoadingVacancy)
    !this.state.vacancies.data.length && VacancyService.load()
  }

  componentWillUnmount() {
    this.unSubscribe(VacancyService, this.onLoadedVacancy, this.onErrorVacancy, this.onLoadingVacancy)
    this.unSubscribe(StudentService, this.onLoadedStudent, this.onErrorStudent, this.onLoadingStudent)
    this.unSubscribe(CompanyService, this.onLoadedCompany, this.onErrorCompany, this.onLoadingCompany)
  }

  onLoadedVacancy = (data = []) => this.setState({vacancies: {...defaultState, data, count}})
  onErrorVacancy = _ => this.setState(({vacancies}) => ({vacancies: {...vacancies, loading: false, error: true}}))
  onLoadingVacancy = _ => this.setState(({vacancies}) => ({vacancies: {...vacancies, loading: true, error: false}}))

  onLoadedStudent = (data = []) => this.setState({students: {...defaultState, data, count}})
  onErrorStudent = _ => this.setState(({students}) => ({students: {...students, loading: false, error: true}}))
  onLoadingStudent = _ => this.setState(({students}) => ({students: {...students, loading: true, error: false}}))

  onLoadedCompany = (data = []) => this.setState({companies: {...defaultState, data, count}})
  onErrorCompany = _ => this.setState(({companies}) => ({companies: {...companies, loading: false, error: true}}))
  onLoadingCompany = _ => this.setState(({companies}) => ({companies: {...companies, loading: true, error: false}}))

  handleChange(name) {
    switch (name) {
      case vacancies: return !this.state.vacancies.data.length && VacancyService.load()
      case companies: return !this.state.companies.data.length && CompanyService.load()
      case students: return !this.state.students.data.length && StudentService.load()
    }
  }

  handleMore(type) {
    this.setState(state => ({[type]: {...state[type], count: state[type].count + count}}))
  }

  short(text = '', length) {
    if (text.length < length) {
      return text
    }
    let str = text.split('').splice(0, length).join('')
    const lastIndex = str.lastIndexOf(' ')
    const res = str.substring(0, lastIndex)
    return `${res}${res[res.length - 1] != '.' ? '...' : ''}`
  }

  vacancies() {
    return (
      <div>
        {
          this.state.vacancies.data
            .filter((_, index) => index < this.state.vacancies.count)
            .map(({_id, name, company, about}) =>
              <Card onClick={() => browserHistory.push(`/feed/${_id}`)} style={{cursor: 'pointer'}} key={_id}>
                <CardHeader title={name} subtitle={`${company.name.name} ${company.city ? `| ${company.city.name}` : ''}`} avatar={company.avatar || this.toAvatar(company.name.name)} />
                <CardText style={{marginTop: -20}}>{this.short(about, 300)}</CardText>
              </Card>
            )
        }
        {
          this.state.vacancies.data.length > this.state.vacancies.count &&
          <FlatButton
            label='More'
            secondary
            style={{width: '100%'}}
            onClick={() => this.handleMore(vacancies)}/>
        }
      </div>
    )
  }

  toAvatar(name) {
    return name.trim()
      .split(' ')
      .splice(0, 2)
      .map(x => x.charAt(0))
      .join('')
      .toUpperCase()
  }

  students() {
    return (
      <div>
        {
          this.state.students.data
            .filter((_, index) => index < this.state.students.count)
            .map(({_id, name, city = {}, avatar, about}) =>
              <Card onClick={() => browserHistory.push(`/student/${_id}`)} style={{cursor: 'pointer'}}  key={_id}>
                <CardHeader title={name} subtitle={city.name} avatar={avatar || this.toAvatar(name)} />
                <CardText style={{marginTop: -20}}>{this.short(about, 300)}</CardText>
              </Card>
            )
        }
        {
          this.state.students.data.length > this.state.students.count &&
          <FlatButton
            label='More'
            secondary
            style={{width: '100%'}}
            onClick={() => this.handleMore(students)}/>
        }
      </div>
    )
  }

  companies() {
    return (
      <div>
        {
          this.state.companies.data
            .filter((_, index) => index < this.state.companies.count)
            .map(({_id, name, city = {}, avatar, about}) =>
              <Card key={_id} onClick={() => browserHistory.push(`/company/${_id}`)} style={{cursor: 'pointer'}}>
                <CardHeader title={name.name} subtitle={city.name} avatar={avatar || this.toAvatar(name.name)} />
                <CardText style={{marginTop: -20}}>{this.short(about, 300)}</CardText>
              </Card>
            )
        }
        {
          this.state.companies.data.length > this.state.companies.count &&
          <FlatButton
            label='More'
            secondary
            style={{width: '100%'}}
            onClick={() => this.handleMore(companies)}/>
        }
      </div>
    )
  }

  render() {
    return (
      <div className='feed'>
        <Tabs>
          <Tab label='Вакансії' onActive={() => this.handleChange(vacancies)}>
            <div>
              {this.state.vacancies.data.length > 0 && this.vacancies()}
            </div>
          </Tab>
          <Tab label='Компанії' onActive={() => this.handleChange(companies)}>
            <div>
              {this.state.companies.data.length > 0 && this.companies()}
            </div>
          </Tab>
          <Tab label='Студенти' onActive={() => this.handleChange(students)}>
            <div>
              {this.state.students.data.length > 0 && this.students()}
            </div>
          </Tab>
        </Tabs>
      </div>
    )
  }
}
