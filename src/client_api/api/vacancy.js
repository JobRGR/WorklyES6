import request from '../utils/request'

class VacancyApi {
  constructor(name) {
    this.path = `/api/${name}`
  }

  getAll() {
    return request({url: this.path})
  }

  getUser() {
    return request({url: '/api/status'})
  }

  getItem(id) {
    return request({url: `${this.path}/${id}`})
  }

  addItem(body) {
    return request({
      url: `${this.path}-add`,
      method: 'post',
      body
    })
  }

  updateItem(id, body) {
    return request({
      url: `${this.path}/${id}`,
      method: 'put',
      body
    })
  }

  searchItems(body) {
    return request({
      url: `${this.path}-search`,
      method: 'post',
      body
    })
  }

  subscribe(id, body) {
    return request({
      url: `${this.path}-subscribe/${id}`,
      method: 'post',
      body
    })
  }

  removeAll() {
    return request({
      url: this.path,
      method: 'delete'
    })
  }

  removeItem(id) {
    return request({
      url: `${this.path}/${id}`,
      method: 'delete'
    })
  }
}

export default new VacancyApi('vacancy')