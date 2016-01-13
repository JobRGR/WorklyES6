import React from 'react'
import {render} from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'
import {browserHistory, Router, Route, IndexRoute} from 'react-router'
import Index from './pages/index'
import NotFound from './pages/not_found'
import App from './pages/app'

injectTapEventPlugin()

const router = (
  <Router history={browserHistory}>
    <Route path='/' component={App}>
      <IndexRoute component={Index} />
      <Route path="*" component={NotFound}/>
    </Route>
  </Router>
)

render(router, document.getElementById('app'))
