import {assert} from 'chai'
import request from 'supertest'
import count from '../helpers/count'
import deleteItem from '../helpers/delete'


export default (url) => {
    const path = '/api/test-question'

    let tmpData = {
        question: "Which came first, the chicken or the egg?",
        answer: ["the chicken egg came first because the genetic recombination that produced the first 'chicken'occurred in germ-line cells in a non-chicken ancestor","43","json"],
        correct: 0,
        free: true
    }

    let newTmpData = {
        question: "Can God create a stone so heavy that it cannot lift it?",
        answer: ["No","Yes"],
        correct: 1,
        free: false
    }

    let newData = tmpData

    let editNewData = newTmpData

    let newDataReturn = {}
    let newUniversity = null
    let newSpeciality = null

    let tmpModel = null
    let list = null

    describe('test question"s tests', () => {
        it('.get list', done => {
            request(url)
                .get(path)
                .end((err, res) =>  {
                    list = res.body.testQuestions || []
                    assert.equal(res.status, 200)
                    assert.property(res.body, 'testQuestions')
                    assert.isAbove(res.body.testQuestions.length, 0)
                    done()
                })
        })

        it('.get random item', done => {
            const index = Math.floor(list.length * Math.random())
            request(url)
                .get(`${path}/${list[index]._id}`)
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.property(res.body, 'testQuestion')
                    assert.property(res.body.testQuestion, 'question')
                    assert.property(res.body.testQuestion, 'answer')
                    assert.property(res.body.testQuestion, 'correct')
                    assert.property(res.body.testQuestion, 'free')
                    assert.property(res.body.testQuestion, 'owner')
                    assert.equal(res.body.testQuestion.question, list[index].question)
                    assert.deepEqual(res.body.testQuestion.answer, list[index].answer)
                    assert.equal(res.body.testQuestion.free, list[index].free)
                    assert.equal(res.body.testQuestion.correct, list[index].correct)
                    assert.equal(res.body.testQuestion._id, list[index]._id)
                    assert.deepEqual(res.body.testQuestion.owner, list[index].owner)
                    assert.isString(res.body.testQuestion.question)
                    assert.isObject(res.body.testQuestion.owner)
                    assert.isArray(res.body.testQuestion.answer)
                    assert.isBoolean(res.body.testQuestion.free)
                    assert.isNumber(res.body.testQuestion.correct)
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
                    tmpModel = res.body.testQuestion || {}
                    assert.equal(res.status, 200)
                    assert.property(res.body, 'testQuestion')
                    assert.property(res.body.testQuestion, 'question')
                    assert.property(res.body.testQuestion, 'answer')
                    assert.property(res.body.testQuestion, 'free')
                    assert.property(res.body.testQuestion, 'correct')
                    assert.equal(res.body.testQuestion.question, tmpData.question)
                    assert.deepEqual(res.body.testQuestion.answer, tmpData.answer)
                    assert.equal(res.body.testQuestion.free, tmpData.free)
                    assert.equal(res.body.testQuestion.correct, tmpData.correct)
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
                    assert.property(res.body, 'testQuestion')
                    assert.property(res.body.testQuestion, 'question')
                    assert.property(res.body.testQuestion, 'answer')
                    assert.property(res.body.testQuestion, 'free')
                    assert.property(res.body.testQuestion, 'correct')
                    assert.property(res.body.testQuestion, 'owner')
                    assert.equal(res.body.testQuestion.question, newTmpData.question)
                    assert.deepEqual(res.body.testQuestion.answer, newTmpData.answer)
                    assert.equal(res.body.testQuestion.free, newTmpData.free)
                    assert.equal(res.body.testQuestion.correct, newTmpData.correct)
                    assert.equal(res.body.testQuestion.owner, newTmpData.owner)
                    done()
                })
        })

        it('.check put item', done => {
            request(url)
                .get(`${path}/${tmpModel._id}`)
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.property(res.body, 'testQuestion')
                    assert.property(res.body.testQuestion, 'question')
                    assert.property(res.body.testQuestion, 'answer')
                    assert.property(res.body.testQuestion, 'free')
                    assert.property(res.body.testQuestion, 'correct')
                    assert.property(res.body.testQuestion, 'owner')
                    assert.equal(res.body.testQuestion.question, newTmpData.question)
                    assert.deepEqual(res.body.testQuestion.answer, newTmpData.answer)
                    assert.equal(res.body.testQuestion.free, newTmpData.free)
                    assert.equal(res.body.testQuestion.correct, newTmpData.correct)
                    assert.equal(res.body.testQuestion.owner._id, newTmpData.owner)
                    assert.isObject(res.body.testQuestion.owner)
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
                    assert.property(res.body, 'testQuestion')
                    assert.property(res.body.testQuestion, 'question')
                    assert.property(res.body.testQuestion, 'answer')
                    assert.property(res.body.testQuestion, 'free')
                    assert.property(res.body.testQuestion, 'correct')
                    assert.property(res.body.testQuestion, 'owner')
                    assert.isString(res.body.testQuestion.question)
                    assert.isArray(res.body.testQuestion.answer)
                    assert.isBoolean(res.body.testQuestion.free)
                    assert.isNumber(res.body.testQuestion.correct)
                    assert.isObject(res.body.testQuestion.owner)
                    done()
                })
        })

    })
}