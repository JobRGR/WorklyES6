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
                    list = res.body.openQuestions || []
                    assert.equal(res.status, 200)
                    assert.property(res.body, 'openQuestions')
                    assert.isAbove(res.body.openQuestions.length, 0)
                    done()
                })
        })

        it('.get random item', done => {
            const index = Math.floor(list.length * Math.random())
            request(url)
                .get(`${path}/${list[index]._id}`)
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.property(res.body, 'openQuestion')
                    assert.property(res.body.openQuestion, 'question')
                    assert.property(res.body.openQuestion, 'answer')
                    assert.property(res.body.openQuestion, 'free')
                    assert.property(res.body.openQuestion, 'owner')
                    assert.equal(res.body.openQuestion.question, list[index].question)
                    assert.equal(res.body.openQuestion.answer, list[index].answer)
                    assert.equal(res.body.openQuestion.free, list[index].free)
                    assert.equal(res.body.openQuestion._id, list[index]._id)
                    assert.deepEqual(res.body.openQuestion.owner, list[index].owner)
                    assert.isObject(res.body.openQuestion.owner)
                    assert.isString(res.body.openQuestion.question)
                    assert.isString(res.body.openQuestion.answer)
                    assert.isBoolean(res.body.openQuestion.free)
                    done()
                })
        })

        it('.get count', done => count(url, path, list.length, done))

        it('.set item', done => {
            const index = Math.floor(list.length * Math.random())
            tmpData.owner = list[index].owner._id
            request(url)
                .post(path)
                .send(tmpData)
                .end(((err, res) => {
                    tmpModel = res.body.openQuestion || {}
                    assert.equal(res.status, 200)
                    assert.property(res.body, 'openQuestion')
                    assert.property(res.body.openQuestion, 'question')
                    assert.property(res.body.openQuestion, 'answer')
                    assert.property(res.body.openQuestion, 'free')
                    assert.property(res.body.openQuestion, 'owner')
                    assert.equal(res.body.openQuestion.owner, tmpData.owner)
                    assert.equal(res.body.openQuestion.question, tmpData.question)
                    assert.equal(res.body.openQuestion.answer, tmpData.answer)
                    assert.equal(res.body.openQuestion.free, tmpData.free)
                    done()
                }))
        })

        it('.check set', done => count(url, path, list.length + 1, done))

        it('.put item', done => {
            const index = Math.floor(list.length * Math.random())
            newTmpData.owner = list[index].owner._id
            request(url)
                .put(`${path}/${tmpModel._id}`)
                .send(newTmpData)
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.property(res.body, 'openQuestion')
                    assert.property(res.body.openQuestion, 'question')
                    assert.property(res.body.openQuestion, 'answer')
                    assert.property(res.body.openQuestion, 'free')
                    assert.property(res.body.openQuestion, 'owner')
                    assert.equal(res.body.openQuestion.question, newTmpData.question)
                    assert.equal(res.body.openQuestion.answer, newTmpData.answer)
                    assert.equal(res.body.openQuestion.free, newTmpData.free)
                    assert.equal(res.body.openQuestion.owner, newTmpData.owner)
                    done()
                })
        })

        it('.check put item', done => {
            request(url)
                .get(`${path}/${tmpModel._id}`)
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.property(res.body, 'openQuestion')
                    assert.property(res.body.openQuestion, 'question')
                    assert.property(res.body.openQuestion, 'answer')
                    assert.property(res.body.openQuestion, 'free')
                    assert.property(res.body.openQuestion, 'owner')
                    assert.equal(res.body.openQuestion.question, newTmpData.question)
                    assert.equal(res.body.openQuestion.answer, newTmpData.answer)
                    assert.equal(res.body.openQuestion.free, newTmpData.free)
                    assert.equal(res.body.openQuestion.owner._id, newTmpData.owner)
                    assert.isObject(res.body.openQuestion.owner)

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
                    assert.property(res.body, 'openQuestion')
                    assert.property(res.body.openQuestion, 'question')
                    assert.property(res.body.openQuestion, 'answer')
                    assert.property(res.body.openQuestion, 'free')
                    assert.property(res.body.openQuestion, 'owner')
                    assert.isString(res.body.openQuestion.question)
                    assert.isString(res.body.openQuestion.answer)
                    assert.isBoolean(res.body.openQuestion.free)
                    assert.isObject(res.body.openQuestion.owner)
                    done()
                })
        })

    })
}