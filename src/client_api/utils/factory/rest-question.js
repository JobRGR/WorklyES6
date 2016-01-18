import request from '../request'

class RestQuestion {
  constructor(name) {
    this.path = `/api/${name}`
  }

  status() {
    return request({url: `${this.path}-status`})
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

  updateSelf(body) {
    return request({
      url: `${this.path}-update`,
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

  changeEmailItem(id, body) {
    return request({
      url: `${this.path}-email/${id}`,
      method: 'put',
      body
    })
  }

  changeEmailSelf(body) {
    return request({
      url: `${this.path}-email`,
      method: 'put',
      body
    })
  }

  changePasswordItem(id, body) {
    return request({
      url: `${this.path}-password/${id}`,
      method: 'put',
      body
    })
  }

  changePasswordSelf(body) {
    return request({
      url: `${this.path}-password`,
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