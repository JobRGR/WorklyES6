import wikipedia from 'node-wikipedia'
import toMarkdown from 'to-markdown'
import searchImage from '../utils/search_image'

export default {
  wikipedia(req, res, next) {
    wikipedia.page.data(req.query.value, {content: true}, data => {
      try {
        res.text = data.text['*']
        res.markdownText = toMarkdown(res.text)
      }
      catch (err) {
        res.text = null
        res.markdownText = null
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
    let {image, text, markdownText} = res
    let {value: title} = req.query
    let competence = {image, title, text, markdownText}
    res.send({competence})
  }
}
