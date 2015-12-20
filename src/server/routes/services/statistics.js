import express from 'express'
import Statistic from '../../handler/statistic'

export default express.Router()
  .post('/statistic', Statistic.getItem)
  .post('/statistic-count', Statistic.getCount)
  .post('/statistic-count-type', Statistic.getCountType)
