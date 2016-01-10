import async from 'async'
import Events from './events'
import StatisticsApi from '../../client_api/api/statistic'


class StatisticsService extends Events {
  constructor() {
    super()
    this.dashboard = null
    this.loading = null
    this.type = 'month'
  }

  search(body, cb) {
    async.parallel({
      percent: cb => StatisticsApi.count(body).then(({data = {}}) => cb(null, data.value)),
      statistic: cb => StatisticsApi.search(body).then(({data = {}}) => cb(null, data.statistic))
    }, (err, {percent, statistic}) => cb(percent, statistic))
  }

  load() {
    let {type} = this
    if (this.loading) return
    this.loading = {}
    async.parallel({
      pie: cb => StatisticsApi.getPie().then(({data = {}}) => cb(null, data.pie)),
      graph: cb => StatisticsApi.getGraph({type}).then(({data = {}}) => cb(null, data.graph)),
      multiGraph: cb => StatisticsApi.getMultiGraph({type}).then(({data = {}}) => cb(null, data.graph))
    }, (err, dashboard) => this.setDashboard(dashboard))
  }

  setError(err = {}) {
    console.log(err)
    this.setItems()
    this.emit('error', err)
  }

  setDashboard(dashboard = null) {
    this.loading = null
    this.dashboard = dashboard
    this.emit('loaded', dashboard)
  }

  get cachedDashboard() {
    return this.dashboard
  }
}

export default new StatisticsService()
