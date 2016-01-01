import request from '../request'

class Rest {
  constructor(name) {
    this.path = `/api/${name}/`
  }

  getAll() {
    return request({url: this.path})
  }

  getItem(id) {
    return request({url: `${this.path}${id}`})
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
      url: `${this.path}${id}`,
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
      url: `${this.path}${id}`,
      method: 'delete'
    })
  }
}

export default Rest