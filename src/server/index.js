import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import routes from './routes'
import initProcess from './init/process'
import session from './utils/session_store'
import studentLoader from './middleware/student'
import companyLoader from './middleware/company'

const port = process.env.PORT || 3333
let app = express()

!process.env.test && initProcess() && require('newrelic')

app
  .set('views', `${__dirname}/../../dist`)
  .use(express.static(`${__dirname}/../../dist`))
  .use(bodyParser.urlencoded({limit: '50mb', extended: false}))
  .use(bodyParser.json({limit: '50mb'}))
  .use(cookieParser())
  .use(morgan('dev'))
  .use(session)
  .use(studentLoader)
  .use(companyLoader)
  .use(routes())
  .use((err, req, res, next) =>
    res
      .status(err.status || 500)
      .send({message: err.message, err}))
  .listen(port)

console.log(`[server]:${port}`)
