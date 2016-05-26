import React, {Component} from 'react'
import {Tabs, Tab} from 'material-ui/Tabs'
import TextField from 'material-ui/TextField'
import {Card, CardHeader, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import {browserHistory} from 'react-router'
import {toAvatar, short, searchCompany, searchStudent, searchVacancy, getType, count, defaultState, students, companies, vacancies} from './utils'
import {VacancyService, CompanyService, StudentService} from '../../service/feed'


export default class extends Component {

  constructor() {
    super()
    this.state = {
      active: vacancies,
      search: '',
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
    this.setState({active: name, search: ''})
    switch (name) {
      case vacancies: return !this.state.vacancies.data.length && VacancyService.load()
      case companies: return !this.state.companies.data.length && CompanyService.load()
      case students: return !this.state.students.data.length && StudentService.load()
    }
  }

  handleMore(type) {
    this.setState(state => ({[type]: {...state[type], count: state[type].count + count}}))
  }

  vacancies() {
    return (
      <div>
        {
          this.state.vacancies.data
            .filter(vacancy => searchVacancy(this.state.search, vacancy))
            .filter((_, index) => index < this.state.vacancies.count)
            .map(({_id, name, company, about, city}) =>
              <Card onClick={() => browserHistory.push(`/feed/${_id}`)} style={{cursor: 'pointer'}} key={_id}>
                <CardHeader title={name} subtitle={`${company.name.name} ${city ? `| ${city.name}` : ''}`} avatar={company.avatar || toAvatar(company.name.name)} />
                <CardText style={{marginTop: -20}}>{short(about, 300)}</CardText>
              </Card>
            )
        }
        {this.state.vacancies.data.length > this.state.vacancies.count && this.button(vacancies)}
      </div>
    )
  }
  
  button(name) {
    return <FlatButton
      label='More'
      secondary
      style={{width: '100%'}}
      onClick={() => this.handleMore(name)}/>
  }

  students() {
    return (
      <div>
        {
          this.state.students.data
            .filter(student => searchStudent(this.state.search, student))
            .filter((_, index) => index < this.state.students.count)
            .map(({_id, name, city = {}, avatar, about}) =>
              <Card onClick={() => browserHistory.push(`/student/${_id}`)} style={{cursor: 'pointer'}}  key={_id}>
                <CardHeader title={name} subtitle={city.name} avatar={avatar || toAvatar(name)} />
                <CardText style={{marginTop: -20}}>{short(about, 300)}</CardText>
              </Card>
            )
        }
        {this.state.students.data.length > this.state.students.count && this.button(students)}
      </div>
    )
  }

  companies() {
    return (
      <div>
        {
          this.state.companies.data
            .filter(company => searchCompany(this.state.search, company))
            .filter((_, index) => index < this.state.companies.count)
            .map(({_id, name, city = {}, avatar, about}) =>
              <Card key={_id} onClick={() => browserHistory.push(`/company/${_id}`)} style={{cursor: 'pointer'}}>
                <CardHeader title={name.name} subtitle={city.name} avatar={avatar || toAvatar(name.name)} />
                <CardText style={{marginTop: -20}}>{short(about, 300)}</CardText>
              </Card>
            )
        }
        {this.state.companies.data.length > this.state.companies.count && this.button(companies)}
      </div>
    )
  }

  render() {
    return (
      <div className='feed'>
        <TextField
          hintText={`Пошук ${getType(this.state.active)}`}
          floatingLabelText='Пошук'
          type='text'
          fullWidth
          value={this.state.search}
          onChange={event => this.setState({search: event.target.value})}
        />
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
