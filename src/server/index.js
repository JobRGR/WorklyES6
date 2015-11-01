import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import routes from './routes'

const port = process.env.PORT || 3333
let app = express()

app
  .set('views', `${__dirname}/../../dist`)
  .use(express.static(`${__dirname}/../../dist`))
  .use(bodyParser.urlencoded({limit: '50mb', extended: false}))
  .use(bodyParser.json({limit: '50mb'}))
  .use(morgan('dev'))
  .use(routes())
  .use((error, req, res, next) =>
    res
      .status(error.status || 500)
      .send({message: error.message, error}))
  .listen(port)


console.log(`[server]:${port}`)
