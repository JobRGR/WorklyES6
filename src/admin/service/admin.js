import Events from './events'
import AdminApi from '../../client_api/api/admin'

class AdminService extends Events {
  constructor() {
    super()
    this.admin = null
    this.loading = null
  }

  load() {
    if (this.loading) return
    this.loading = {}
    this.emit('loading')
    AdminApi
      .status()
      .then(({data = {}}) => this.setAdmin(data.admin))
      .catch(err => this.setError(err))
  }

  login({name, password}) {
    return AdminApi.login({name, password})
  }

  logout() {
    return AdminApi
      .logout()
      .then(({data}) => data.logout && this.setAdmin())
  }

  setError({data}) {
    this.setAdmin()
    this.emit('error', data)
  }

  setAdmin(admin = null) {
    this.loading = null
    this.admin = admin
    this.emit('loaded', admin)
  }

  get cachedAdmin() {
    return this.admin
  }
}

export default new AdminService()
