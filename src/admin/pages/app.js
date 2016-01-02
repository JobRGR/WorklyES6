import React from 'react'
import Loader from '../components/loader'
import Header from '../components/header'
import AdminService from '../service/admin'
import SignIn from './signin'

export default React.createClass({
  getInitialState() {
    return {
      admin: AdminService.cachedAdmin,
      loading: null,
      error: null
    }
  },

  componentWillUnmount() {
    AdminService.removeErrorListener(this.onError)
    AdminService.removeLoadingListener(this.onLoading)
    AdminService.removeLoadedListener(this.onLoaded)
  },

  componentWillMount() {
    if (this.state.admin) return null
    AdminService.onError(this.onError)
    AdminService.onLoading(this.onLoading)
    AdminService.onLoaded(this.onLoaded)
    AdminService.load()
  },

  onError(error) {
    this.setState({error, loading: false})
  },

  onLoaded(admin) {
    this.setState({admin, loading: false})
  },

  onLoading() {
    this.setState({loading: true})
  },

  render() {
    return (
      <div>
        <Header admin={this.state.admin} />
        {this.state.admin && !this.state.loading && this.props.children}
        {!this.state.admin && !this.state.loading && <SignIn />}
        {this.state.loading && <Loader absolute />}
      </div>
    )
  }
})
