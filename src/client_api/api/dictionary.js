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

export default {
  CityApi: new DictionaryApi('city'),
  SkillApi: new DictionaryApi('skill'),
  CompanyNameApi: new DictionaryApi('company-name'),
  PositionApi: new DictionaryApi('position'),
  SpecialityApi: new DictionaryApi('speciality'),
  UniversityApi: new DictionaryApi('university')
}


