import React from 'react'
import {render} from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'
import {browserHistory, Router, Route, IndexRoute} from 'react-router'
import Index from './pages/index'
import Dictionary from './pages/dictionary'
import User from './pages/user'
import Vacancy from './pages/vacancy'
import App from './pages/app'
import NotFound from '../client/pages/not_found'

injectTapEventPlugin()

const router = (
  <Router history={browserHistory}>
    <Route path='/admin' component={App}>
      <IndexRoute component={Index} />
      <Route path='dictionary' component={Dictionary} />
      <Route path='user' component={User} />
      <Route path='vacancy' component={Vacancy} />
      <Route path="*" component={NotFound}/>
    </Route>
  </Router>
)

render(router, document.getElementById('app'))
