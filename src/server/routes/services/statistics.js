import express from 'express'
import Statistic from '../../handler/statistic'

export default express.Router()
  .post('/statistic', Statistic.getItem)
  .post('/statistic/count', Statistic.getCount)
  .post('/statistic/count/type', Statistic.getCountType)
  .post('/statistic/pie', Statistic.getPie)
  .post('/statistic/graph', Statistic.getGraph)
  .post('/statistic/multi-graph', Statistic.getMultiGraph)
