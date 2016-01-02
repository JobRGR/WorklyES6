import Events from './events'
import pluralize from 'pluralize'
import DictionaryApi from '../../client_api/api/dictianory'

const {CityApi, SkillApi, CompanyNameApi, PositionApi, SpecialityApi, UniversityApi} = DictionaryApi

class DictionaryService extends Events {
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
    this.api.updateItem(id, {name})
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
  CityService: new DictionaryService(CityApi, 'city'),
  SkillService: new DictionaryService(SkillApi, 'skill'),
  CompanyNameService: new DictionaryService(CompanyNameApi, 'companyName'),
  PositionService: new DictionaryService(PositionApi, 'position'),
  SpecialityService: new DictionaryService(SpecialityApi, 'speciality'),
  UniversityService: new DictionaryService(UniversityApi, 'university')
}


