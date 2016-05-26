import React, {Component} from 'react'
import {browserHistory} from 'react-router'
import Header from '../components/header'
import PageLoader from '../components/page-loader'
import request from '../../client_api/utils/request'
import StatusService from '../service/status'


export default class extends Component{
  constructor(props) {
    super(props)
    this.state = {
      isAuth: false,
      isStudent: null,
      item: null,
      loaded: false
    }
    StatusService.load()
    StatusService.onLoaded(({company, student}) => {
      if (student) {
        this.setState({isStudent: true, item: student, loaded: true, isAuth: true})
      } else if (company) {
        this.setState({isStudent: false, item: company, loaded: true, isAuth: true})
      } else {
        this.setState({isAuth: false, loaded: true})
      }
    })
    StatusService.onError(err => {
      this.setState({isAuth: false, loaded: true})
    })
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.loaded) {
      if (nextProps.location.pathname == '/' && nextState.isAuth)
        browserHistory.push('/feed')
      if (nextProps.location.pathname != '/' && !nextState.isAuth)
        browserHistory.push('/')
    }
  }

  render() {
    let childProps = {
      type: this.state.isAuth ? this.state.isStudent ? 'student' : 'company' : null,
      item: this.state.item
    }
    return (
      <div style={{width: '100%', height: '100%'}}>
        {!this.state.loaded && <PageLoader />}
        {this.state.loaded && this.props.location.pathname != '/' && <Header {...childProps}/>}
        {
          this.state.loaded && React.Children.map(this.props.children,
            child => React.cloneElement(child, childProps))
        }
      </div>
    )
  }
}
