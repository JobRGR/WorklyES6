import React, {Component} from 'react'
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
      } else {
        this.setState({isStudent: false, item: company, loaded: true, isAuth: true})
      }
      if (this.props.location.pathname == '/')
        this.props.history.push('/feed')
    })
    StatusService.onError(err => {
      this.setState({isAuth: false, loaded: true})
      if (this.props.location.pathname != '/')
        this.props.history.push('/')
    })
  }

  render() {
    return (
      <div style={{width: '100%', height: '100%'}}>
        {!this.state.loaded && <PageLoader />}
        {this.state.loaded && this.props.location.pathname != '/' && <Header />}
        {this.state.loaded && this.props.children}
      </div>
    )
  }
}
