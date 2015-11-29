import {assert} from 'chai'
import request from 'supertest'
import count from '../helpers/count'
import deleteItem from '../helpers/delete'


export default (url) => {
    const path = '/api/open-question'

    let tmpData = {
        question: "Which came first, the chicken or the egg?",
        answer: "the chicken egg came first because the genetic recombination that produced the first 'chicken'occurred in germ-line cells in a non-chicken ancestor",
        free: true
    }

    let newTmpData = {
        question: "Can God create a stone so heavy that it cannot lift it?",
        answer: "No",
        free: false
    }

    let newData = tmpData

    let editNewData = newTmpData

    let newDataReturn = {}
    let newUniversity = null
    let newSpeciality = null

    let tmpModel = null
    let list = null

    describe('open question"s tests', () => {
        it('.get list', done => {
            request(url)
                .get(path)
                .end((err, res) =>  {
                    list = res.body.open_questions || []
                    assert.equal(res.status, 200)
                    assert.property(res.body, 'open_questions')
                    assert.isAbove(res.body.open_questions.length, 0)
                    done()
                })
        })

        it('.get random item', done => {
            const index = Math.floor(list.length * Math.random())
            request(url)
                .get(`${path}/${list[index]._id}`)
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.property(res.body, 'open_question')
                    assert.property(res.body.open_question, 'question')
                    assert.property(res.body.open_question, 'answer')
                    assert.property(res.body.open_question, 'free')
                    assert.equal(res.body.open_question.question, list[index].question)
                    assert.equal(res.body.open_question.answer, list[index].answer)
                    assert.equal(res.body.open_question.free, list[index].free)
                    assert.equal(res.body.open_question._id, list[index]._id)
                    assert.isString(res.body.open_question.question)
                    assert.isString(res.body.open_question.answer)
                    assert.isBoolean(res.body.open_question.free)
                    done()
                })
        })

        it('.get count', done => count(url, path, list.length, done))

        it('.set item', done => {
            request(url)
                .post(path)
                .send(tmpData)
                .end(((err, res) => {
                    tmpModel = res.body.open_question || {}
                    assert.equal(res.status, 200)
                    assert.property(res.body, 'open_question')
                    assert.property(res.body.open_question, 'question')
                    assert.property(res.body.open_question, 'answer')
                    assert.property(res.body.open_question, 'free')
                    assert.equal(res.body.open_question.question, tmpData.question)
                    assert.equal(res.body.open_question.answer, tmpData.answer)
                    assert.equal(res.body.open_question.free, tmpData.free)
                    done()
                }))
        })

        it('.check set', done => count(url, path, list.length + 1, done))

        it('.put item', done => {
            request(url)
                .put(`${path}/${tmpModel._id}`)
                .send(newTmpData)
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.property(res.body, 'open_question')
                    assert.property(res.body.open_question, 'question')
                    assert.property(res.body.open_question, 'answer')
                    assert.property(res.body.open_question, 'free')
                    assert.equal(res.body.open_question.question, newTmpData.question)
                    assert.equal(res.body.open_question.answer, newTmpData.answer)
                    assert.equal(res.body.open_question.free, newTmpData.free)
                    done()
                })
        })

        it('.check put item', done => {
            request(url)
                .get(`${path}/${tmpModel._id}`)
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.property(res.body, 'open_question')
                    assert.property(res.body.open_question, 'question')
                    assert.property(res.body.open_question, 'answer')
                    assert.property(res.body.open_question, 'free')
                    assert.equal(res.body.open_question.question, newTmpData.question)
                    assert.equal(res.body.open_question.answer, newTmpData.answer)
                    assert.equal(res.body.open_question.free, newTmpData.free)
                    done()
                })
        })

        it('.delete item', done => deleteItem(url, `${path}/${tmpModel._id}`, done))

        it('.check get delete', done => count(url, path, list.length, done))

        it('.random', done => {
            request(url)
                .get(`${path}-random`)
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.property(res.body, 'open_question')
                    assert.property(res.body.open_question, 'question')
                    assert.property(res.body.open_question, 'answer')
                    assert.property(res.body.open_question, 'free')
                    assert.isString(res.body.open_question.question)
                    assert.isString(res.body.open_question.answer)
                    assert.isBoolean(res.body.open_question.free)
                    done()
                })
        })

    })
}