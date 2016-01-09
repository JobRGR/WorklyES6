import request from '../utils/request'

class Statistics {
  constructor() {
    this.path = '/api/statistics'
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

}

export default new Statistics()