import request from '../utils/request'

class Statistics {
  constructor() {
    this.path = '/api/statistic'
  }

  search(body) {
    return request({url: this.path, method: 'post', body})
  }

  count(body) {
    return request({
      url: `${this.path}/count`,
      method: 'post',
      body
    })
  }

  countByType(body) {
    return request({
      url: `${this.path}/count/type`,
      method: 'post',
      body
    })
  }

  getPie(body) {
    return request({
      url: `${this.path}/pie`,
      method: 'post',
      body
    })
  }

  getGraph(body) {
    return request({
      url: `${this.path}/graph`,
      method: 'post',
      body
    })
  }

  getMultiGraph(body) {
    return request({
      url: `${this.path}/multi-graph`,
      method: 'post',
      body
    })
  }
}

export default new Statistics()