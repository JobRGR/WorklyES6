import request from '../utils/request'

class AdminApi {
  constructor() {
    this.path = '/api/admin'
  }

  status() {
    return request({url: `${this.path}-status`})
  }

  login(body) {
    return request({
      url: `${this.path}-login`,
      method: 'post',
      body
    })
  }
}

export default new AdminApi()