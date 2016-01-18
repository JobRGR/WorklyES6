import request from '../request'

class RestQuestion {
  constructor(name) {
    this.path = `/api/${name}`
  }

  getAll() {
    return request({url: this.path})
  }

  getItem(id) {
    return request({url: `${this.path}/${id}`})
  }

  getCount() {
    return request({url: `${this.path}-count`})
  }

  getRandom() {
    return request({url: `${this.path}-random`})
  }

  addItem(body) {
    return request({
      url: this.path,
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

export default RestQuestion