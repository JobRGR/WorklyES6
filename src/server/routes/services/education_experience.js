import express from 'express'
import Education from '../../handler/education'
import Experience from '../../handler/experience'
import Dictionary from '../../handler/dictionary'
import CompanyName from '../../handler/company_name'
import rest from '../../utils/router/helpers/rest'

let router = (name, handler, [handlerFirst, handlerSecond]) => {
  var api = express()
    .get(`/${name}-count`, handler.getCount)
    .get(`/${name}-random`, handler.getRandom, handler.sendItem)
    .post(`/${name}-search`,
      handlerFirst.searchItems,
      handlerSecond.searchItems,
      handler.searchItems,
      handler.sendItems
    )
    .post(`/${name}-add`,
      handlerFirst.addItem,
      handlerSecond.addItem,
      handler.addOne,
      handler.sendItem
    )
    .put(`/${name}-update/:id`,
      handlerFirst.addItem,
      handlerSecond.addItem,
      handler.updateOne,
      handler.sendItem
    )
    .use(`/${name}`, rest(handler))
  name == 'education' && api.get('/education-aggregation', handler.aggregation)
  return api
}

export default {
  Experience: router('experience', Experience, [CompanyName, Dictionary['Position']]),
  Education: router('education', Education, [Dictionary['University'], Dictionary['Speciality']])
}