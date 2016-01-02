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

  editItem(id) {
    console.log(this.items.filter(({_id}) => _id == id))
  }

  removeItem(id) {
    this.api
      .removeItem(id)
      .then(({data = {}}) => data.ok && this.setItems(this.items.filter(({_id}) => _id != id)))
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


