import events from './events'
import request from '../../client_api/utils/request'


class StatusService extends events {
  constructor() {
    super()
    this.loading = null
    this.data = null
  }

  load() {
    if (this.loading) return
    this.loading = true
    this.emit('loading')
    request({url: `${location.origin}/api/status`})
      .then(({data = {}}) => {
        if (data.err) throw data.err
        this.setItem(data)
      })
      .catch(err => this.setError(err))
  }

  setError(err) {
    this.loading = null
    this.emit('error', err)
  }

  setItem({company = null, student = null}) {
    this.loading = null
    this.data = {company, student}
    this.emit('loaded', {company, student})
  }

  get cachedItem() {
    return this.data
  }
}

export default new StatusService()