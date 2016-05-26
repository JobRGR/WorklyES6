import pluralize from 'pluralize'
import Events from '../../admin/service/events'
import VacancyApi from '../../client_api/api/vacancy'
import {CompanyApi, StudentApi} from '../../client_api/api/user'

class FeedService extends Events {
  constructor(api, name) {
    super()
    this.itemName = name
    this.itemsName = pluralize(name)
    this.api = api
    this.items = []
    this.loading = null
    this.timer = null
  }

  load() {
    if (this.loading) return
    this.loading = {}
    this.emit('loading')
    const names = this.itemsName
    this.api
      .getAll()
      .then(({data = {}}) => this.setItems(data[names]))
      .catch(err => this.setError(err))
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

export const VacancyService = new FeedService(VacancyApi, 'vacancy')
export const CompanyService = new FeedService(CompanyApi, 'company')
export const StudentService = new FeedService(StudentApi, 'student')