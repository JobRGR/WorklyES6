import React, {Component} from 'react'
import {render} from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'
import {browserHistory, Router, Route, IndexRoute, IndexRedirect} from 'react-router'
import App from './pages/app'
import Index from './pages/index'
import NotFound from './pages/not_found'
import Feed from './pages/feed'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import EditWrapper from './pages/edit-wrapper'
import Vacancy from './components/vacancy'
import CreateVacancy from './pages/create-vacancy'
import EditVacancy from './pages/edit-vacancy'
import VacancyList from './pages/vacancy-list'
import PageView from './pages/page-view'
import ViewVacancy from './pages/view-vacancy'
import ViewStudent from './pages/view-student'
import ViewCompany from './pages/view-company'
import {VacancyApi} from '../client_api'
import {StudentApi} from '../client_api'
import {CompanyApi} from '../client_api'


injectTapEventPlugin()
const muiTheme = getMuiTheme()

const router = (
  <MuiThemeProvider muiTheme = {muiTheme}>
    <Router history={browserHistory}>
      <Route path='/' component={App}>
        <IndexRoute component={Index}/>
        <Route path='feed' component={Feed}/>
        <Route path='feed/:id' type='vacancy' api={VacancyApi} page={<ViewVacancy/>} component={PageView}/>
        <Route path='student/:id' type='student' api={StudentApi} page={<ViewStudent/>} component={PageView}/>
        <Route path='company/:id' type='company' api={CompanyApi} page={<ViewCompany/>} component={PageView}/>
        <Route path='edit' component={EditWrapper}/>
        <Route path='vacancy' component={Vacancy}>
          <IndexRoute component={VacancyList}/>
          <Route path='create' component={CreateVacancy}/>
          <Route path='edit/:id' component={EditVacancy}/>
        </Route>
        <Route path='*' component={NotFound}/>
      </Route>
    </Router>
  </MuiThemeProvider>
)

render(router, document.getElementById('app'))
