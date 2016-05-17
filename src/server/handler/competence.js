import wikipedia from 'node-wikipedia'
import htmlToText from 'html-to-text'
import searchImage from '../utils/search_image'

export default {
  wikipedia(req, res, next) {
    wikipedia.page.data(req.query.value, {content: true}, data => {
      try {
        res.html = data.text['*']
        res.text = htmlToText.fromString(res.html, {
          wordwrap: 130
        })
      }
      catch (err) {
        res.html = null
        res.text = null
      }
      finally {
        next()
      }
    })
  },

  duckduckgo(req, res, next) {
    searchImage(req.query.value + '%20logo', image => {
      res.image = image
      next()
    })
  },

  send(req, res) {
    let {image, html, text} = res
    let {value: title} = req.query
    let competence = {image, title, text, html}
    res.send({competence})
  }
}
