import wikipedia from 'node-wikipedia'
import request from '../../client_api/utils/request'

export default {
  wikipedia(req, res, next) {
    wikipedia.page.data(req.query.value, {content: true}, data => {
      try {
        res.text = data.text['*']
      }
      catch (err) {
        res.text = null
      }
      finally {
        next()
      }
    })
  },

  duckduckgo(req, res, next) {
    const url = `https://duckduckgo.com/i.js?q=${req.query.value}%20wilkipedia&format=json&pretty=1`
    request({url}).then(result => {
      try {
        let {data} = result
        if (Array.isArray(data.results)) {
          res.image = data.results[0].image
        }
      }
      catch (err) {
        res.image = null
      }
      next()
    })
  },

  send(req, res) {
    let {image, text} = res
    let {value: title} = req.query
    let competence = {image, title, text}
    res.send({competence})
  }
}
