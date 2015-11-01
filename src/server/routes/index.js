import express from 'express'
import render from '../handler/render'

export default () => {
  let app = express()
  app.get('/', render)
  return app
}