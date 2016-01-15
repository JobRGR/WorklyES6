import Events from './events'
import pluralize from 'pluralize'
import UserApi from '../../client_api/api/user'

const {CompanyApi, StudentApi} = UserApi

class UserService extends Events {
  constructor(api, name) {
    super()
    this.itemName = name
    this.itemsName = pluralize(name)
    this.api = api
    this.items = []
    this.loading = null
    this.timer = null
  }

  loadAll() {
    if (this.loading) return
    this.loading = {}
    this.emit('loading')
    const names = this.itemsName
    this.api
      .getAll()
      .then(({data = {}}) => this.setItems(data[names]))
      .catch(err => this.setError(err))
  }

  editItem(id, item) {
    const {itemName, items} = this
    this.api
      .updateItem(id, item)
      .then(({data}) => {
        data[itemName] && (data[itemName].city = {name: item.city}) &&
        this.setItems(items.map(item => item._id == data[itemName]._id ? data[itemName] : item))
      })
  }

  editMail(id, email){
    const {itemName, items} = this
    this.api
      .changeEmailItem(id, {email})
      .then(({data}) => {
        items.forEach(item => {
          if (item._id == id) item.email = email
        })
        this.setItems(items)
      })
  }

  editPass(id, password){
    this.api
      .changePasswordItem(id, {password})
      .then(({data}) => data.ok)
  }

  addItem(item) {
    const {itemName, items} = this
    this.api
      .addItem(item)
      .then(({data}) => {
        if(!data[itemName]) return null
        data[itemName].name = item.name
        items.push(data[itemName])
        this.setItems(items)
      })
  }

  removeItem(id, duration) {
    this.timer = setTimeout(() => this.api.removeItem(id), duration)
    let {items} = this
    let {item, index} = items.reduce((memo, item, index) => item._id == id ? {item, index} : memo, {})
    items = items.filter(({_id}) => _id != id)
    this.setItems(items)
    return () => {
      items.splice(index, 0, item)
      this.setItems(items)
      clearInterval(this.timer)
    }
  }

  setError(err = {}) {
    console.log(err)
    this.items.length == 0 && this.setItems()
    this.emit('error', err.data)
  }

  setItems(items = []) {
    this.loading = null
    if (items.length)
      items.forEach(item => {
        if (typeof item.name == 'object')
          item.name = item.name.name
      })
    this.items = items
    this.emit('loaded', items)
  }

  get cachedItems() {
    return this.items
  }
}

export default {
  CompanyService: new UserService(CompanyApi, 'company'),
  StudentService: new UserService(StudentApi, 'student')
}


