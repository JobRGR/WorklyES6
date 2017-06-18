import natural from 'natural'

natural.PorterStemmer.attach()

export class TfIdf {
  constructor(corpus, k1 = 2, b = 0.75) {
    const {F, L} = corpus.reduce(({F, L}, text) => {
      const terms = text.tokenizeAndStem()
      const freq = terms
        .reduce((f, term) => Object.assign(f, {[term]: f[term] ? f[term] + 1 : 1}))
      return {
        F: Object.keys(freq).reduce((res, term) => Object.assign(res, {[term]: res[term] ? res[term] + 1 : 1}), F),
        L: L + terms.length
      }
    }, {F: {}, L: 0})
    /*
     * the total number of documents in the collection
     */
    this.N = corpus.length
    /*
     * the average document length in the text collection
     */
    this.avgLength = L / this.N
    /*
     * the number of documents containing term q is F[q]
     */
    this.documentFrequency = F
    /*
     * free parameters
     */
    this.k1 = k1
    this.b = b
  }

  idf(term) {
    return Math.log(this.N / this.documentFrequency[term])
  }

  tf(term, terms) {
    return terms.reduce((cnt, t) => term == t ? cnt + 1 : cnt, 0)
  }

  score(term, terms) {
    const f = this.tf(term, terms)
    const l = terms.length
    /*
     * BM25 bag-of-words retrieval function modification
     */
    return this.idf(term) * f * (this.k1 + 1) / (f + this.k1 * (1 - this.b + this.b * l / this.avgLength))
  }

  extractTerms(text) {
    const terms = text.tokenizeAndStem()
    const termScores = terms.reduce((res, term) => Object.assign(res, {[term]: this.score(term, terms)}), {})
    return terms
      .sort((t1, t2) => termScores[t2] - termScores[t1])
      .slice(0, Math.ceil(terms.length / 10))
  }
}
