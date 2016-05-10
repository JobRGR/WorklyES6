import wikipedia from 'node-wikipedia'
import searchImage from '../utils/search_image'

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
    searchImage(req.query.value, image => {
      res.image = image
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
