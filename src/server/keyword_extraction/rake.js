export class Rake {
  constructor(text, stopList){
    const stopStr = stopList.reduce((res, word) => res += `${word}|`, '')
    this.text = text;
    this.stopRegex = `\\b(?:${stopStr.slice(0, -1)})\\b`
  }

  removeStopWords(sentence) {
    const regex = new RegExp(this.stopRegex, 'ig')
    return sentence.split(regex)
  }

  getSentences(text){
    return text
      .match( /[^\.!\?\:\\\n\r]+/g )
      .reduce((res, sentence) => sentence ? [...res, sentence] : res, [])
  }

  getPhrases(sentences) {
    return sentences.reduce((res, sentence) => {
      return this.removeStopWords(sentence).reduce((list, phrase) => {
        const refinedPhrase = phrase.replace(/['!"“”’#$%&()\*+,\-\.\/:;<=>?@\[\\\]\^_`{|}~']/g, '')
        return refinedPhrase.search(/^\s*$/g) != -1 ? list : [...list, refinedPhrase.trim()]
      }, res)
    }, [])
  }

  getWords(phrase) {
    const words = phrase.match(/[,.!?;:/‘’“”]|\b[0-9a-z']+\b/gi)
    return words.filter(word => Number.isNaN(Number(word)))
  }

  getWordScores(phrases) {
    const F = {}      // frequency
    const D = {}      // degree

    for(const phrase of phrases) {
      const words = this.getWords(phrase)
      const phraseDegree = words.length - 1
      for(const word of words){
        F[word] = F[word] ? F[word] + 1 : 1;
        D[word] = D[word] ? D[word] + phraseDegree : phraseDegree;
      }
    }

    return Object.keys(F)
      .reduce((scores, word) => Object.assign(scores, {[word]: (F[word] + D[word]) / F[word]}), {})
  }

  getPhraseScores(phrases, wordScores) {
    return phrases.reduce((res, phrase) =>
      Object.assign(res, {[phrase]: this.getWords(phrase).reduce((sum, word) => sum + wordScores[word], 0)}),
      {}
    )
  }

  extract() {
    const sentences = this.getSentences(this.text)
    const phrases = this.getPhrases(sentences)
    const wordScores = this.getWordScores(phrases)
    const phraseScores = this.getPhraseScores(phrases, wordScores)
    return phrases
      .sort((p1, p2) => phraseScores[p2] - phraseScores[p1])
      .slice(0, Math.ceil(phrases.length / 3))
  }
}
