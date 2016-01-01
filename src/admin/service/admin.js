import {EventEmitter} from 'events'
import AdminApi from '../../client_api/api/admin'

class AdminService extends EventEmitter {
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
      .then(res => this.setAdmin(res))
      .catch(err => this.setError(err))
  }

  login(name, password) {
    return AdminApi.login({name, password})
  }

  setError({data, status}) {
    this.setAdmin(null, status)
    this.emit('error', data, status)
  }

  setAdmin(data = {}, status) {
    this.loading = null
    this.admin = data.admin || null
    this.emit('loaded', this.admin, status)
  }

  get cachedAdmin() {
    return this.admin
  }

  onLoaded(cb) {
    this.on('loaded', cb)
  }

  onError(cb) {
    this.on('error', cb)
  }

  onLoading(cb) {
    this.on('loading', cb)
  }

  removeLoadedListener(cb) {
    this.removeListener('loaded', cb)
  }

  removeErrorListener(cb) {
    this.removeListener('error', cb)
  }

  removeLoadingListener(cb) {
    this.removeListener('loading', cb)
  }
}

export default new AdminService()
