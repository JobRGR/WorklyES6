import React from 'react'
import {render} from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'
import {browserHistory, Router, Route, IndexRoute} from 'react-router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import Index from './pages/index'
import Dictionary from './pages/dictionary'
import User from './pages/user'
import Question from './pages/question'
import App from './pages/app'
import NotFound from '../client/pages/not_found'

injectTapEventPlugin()
const muiTheme = getMuiTheme()

const router = (
  <MuiThemeProvider muiTheme = {muiTheme}>
    <Router history={browserHistory}>
      <Route path='/admin' component={App}>
        <IndexRoute component={Index} />
        <Route path='dictionary' component={Dictionary} />
        <Route path='user' component={User} />
        <Route path='question' component={Question} />
        <Route path="*" component={NotFound}/>
      </Route>
    </Router>
  </MuiThemeProvider>
)

render(router, document.getElementById('app'))
