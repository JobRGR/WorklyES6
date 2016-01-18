import Events from './events'
import pluralize from 'pluralize'
import QuestionApi from '../../client_api/api/question'

const {OpenQuestionApi, TestQuestionApi} = QuestionApi

class QuestionService extends Events {
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

  editItem(id, name) {
    const {itemName, items} = this
    this.api
      .updateItem(id, {name})
      .then(({data}) => data[itemName] &&
      this.setItems(items.map(item => item._id == data[itemName]._id ? data[itemName]: item)))
  }

  addItem(name) {
    const {itemName, items} = this
    this.api
      .addItem({name})
      .then(({data}) => {
        if(!data[itemName]) return null
        if(items.some(({_id}) => data[itemName]._id == _id)) return null
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
    this.items = items
    this.emit('loaded', items)
  }

  get cachedItems() {
    return this.items
  }
}

export default {
  OpenQuestionService: new QuestionService(OpenQuestionApi, 'openQuestion'),
  TestQuestionService: new QuestionService(TestQuestionApi, 'testQuestion')
}


