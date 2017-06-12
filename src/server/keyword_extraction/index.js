import {Rake} from './rake'
import {TfIdf} from './tf_idf'
import {stopList} from './stop_words'


export function rapidExtraction(text) {
  const rake = new Rake(text, stopList)
  return rake.extract()
}

export function collectionBaseExtraction(text, corpus) {
  const extractor = new TfIdf(corpus)
  return extractor.extractTerms(text)
}
