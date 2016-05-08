import express from 'express'
import Education from './experience/handler'
import Experience from './experience/handler'
import Dictionary from 'dictionary'
import rest from 'rest'

let router = (name, handler, [handlerFirst, handlerSecond]) => {
  return express()
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
}

export default {
  Experience: router('experience', Experience, [CompanyName, Dictionary['Position']]),
  Education: router('education', Education, [Dictionary['University'], Dictionary['Speciality']])
}