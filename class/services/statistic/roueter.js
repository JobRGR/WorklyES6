import express from 'express'
import Statistic from './handler'

export default express.Router()
  .post('/', Statistic.getItem)
  .post('/count', Statistic.getCount)
  .post('/count/type', Statistic.getCountType)
  .post('/pie', Statistic.getPie)
  .post('/graph', Statistic.getGraph)
  .post('/multi-graph', Statistic.getMultiGraph)
