import async from 'async'
import Events from './events'
import StatisticsApi from '../../client_api/api/statistic'


class StatisticsService extends Events {
  constructor() {
    super()
    this.dashboard = {
      day: null,
      month: null,
      year: null
    }
    this.loading = null
    this.type = 'month'
  }

  search(body, cb) {
    async.parallel({
      percent: cb => StatisticsApi.count(body).then(({data = {}}) => cb(null, data.value)),
      statistic: cb => StatisticsApi.search(body).then(({data = {}}) => cb(null, data.statistic))
    }, (err, {percent, statistic}) => cb(percent, statistic))
  }

  load(important = false) {
    let {type} = this
    let max = new Date()
    let min = new Date()
    if (this.loading && !important) return
    this.loading = {}
    type == 'day' && min.setDate(min.getDate() - 1)
    type == 'month' && min.setMonth(min.getMonth() - 1)
    type == 'year' && min.setFullYear(min.getFullYear() - 1)
    async.parallel({
      pie: cb => StatisticsApi.getPie({date: {min, max}}).then(({data = {}}) => cb(null, data.pie)),
      graph: cb => StatisticsApi.getGraph({type}).then(({data = {}}) => cb(null, data.graph)),
      multiGraph: cb => StatisticsApi.getMultiGraph({type}).then(({data = {}}) => cb(null, data.graph)),
      errorPie: cb => StatisticsApi.getPie({date: {min, max}, error: true}).then(({data = {}}) => cb(null, data.pie))
    }, (err, dashboard) => this.setDashboard(dashboard))
  }

  setError(err = {}) {
    console.log(err)
    this.setItems()
    this.emit('error', err)
  }

  setDashboard(dashboard = null) {
    this.loading = null
    this.dashboard[this.type] = dashboard
    this.emit('loaded', dashboard)
  }

  setType(type) {
    this.type = type
    return this.dashboard[type] ? this.setDashboard(this.dashboard[type]) : this.load()
  }

  get cachedDashboard() {
    return this.dashboard[this.type]
  }
}

export default new StatisticsService()
