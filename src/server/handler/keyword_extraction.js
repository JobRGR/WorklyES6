import {rapidExtraction, collectionBaseExtraction} from '../keyword_extraction'
import {Vacancy} from '../models/models'


export default {
  extract(req, res, next) {
    const {text} = req.body
    Vacancy.getAll((data) => {
      const corpus = data.reduce((res, item) => {
        return [...res, item.about]
      }, [text])
      res.send({list: [...rapidExtraction(text), ...collectionBaseExtraction(text, corpus)]})
    })
  }
}
