import express from 'express'
import ExtractKeywords from '../../handler/keyword_extraction'

export default express.Router()
  .post('/', ExtractKeywords.extract)
