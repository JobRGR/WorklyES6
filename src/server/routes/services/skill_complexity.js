import express from 'express'
import SkillComplexity from '../../handler/skill_complexity'
import Dictionary from '../../handler/dictionary'
import rest from '../../utils/router/helpers/rest'

let router = (name, handler) => {
  return express()
    .get(`/${name}-count`, handler.getCount)
    .get(`/${name}-random`, handler.getRandom, handler.sendItem)
    .post(`/${name}-search`,
      Dictionary['Skill'].searchItems,
      handler.searchItems,
      handler.sendItems
    )
    .post(`/${name}-add`,
      Dictionary['Skill'].addItem,
      handler.addOne,
      handler.sendItem
    )
    .put(`/${name}-update/:id`,
      handler.updateOne,
      handler.sendItem
    )
    .use(`/${name}`, rest(handler))
}

export default router('skill-complexity', SkillComplexity)
