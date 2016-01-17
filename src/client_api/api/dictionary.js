import Rest from '../utils/factory/rest'
import request from '../utils/request'

class DictionaryApi extends Rest {
  constructor(name) {
    super(name)
    this.path = `/api/${name}`
  }

  getCount() {
    return request({url: `${this.path}-count`})
  }

  getRandom() {
    return request({url: `${this.path}-random`})
  }

  addItems(body) {
    return request({
      url: `${this.path}s-add`,
      method: 'post',
      body
    })
  }

  removeItemsById(body) {
    return request({
      url: `${this.path}s-remove`,
      method: 'delete',
      body
    })
  }
}

export let CityApi = new DictionaryApi('city')
export let SkillApi = new DictionaryApi('skill')
export let CompanyNameApi = new DictionaryApi('company-name')
export let PositionApi = new DictionaryApi('position')
export let SpecialityApi = new DictionaryApi('speciality')
export let UniversityApi = new DictionaryApi('university')
