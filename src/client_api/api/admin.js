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

  logout() {
    return request({url: '/api/logout'})
  }
}

export default new AdminApi()