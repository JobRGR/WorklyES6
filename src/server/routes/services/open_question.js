import express from 'express'
import OpenQuestion from '../../handler/open_question'
import CompanyNameHandler from '../../handler/company_name'
import CompanyHandler from '../../handler/company'
import rest from '../../utils/router/helpers/rest'

let router = (handler) => {
    return express()
        .get(`/open-question-count`,
            handler.getCount
        )
        .get(`/open-question-random`,
            handler.getRandom,
            handler.sendItem
        )
        .get(`/open-question-byCompanyId/:id`,
            handler.getQuestionsById,
            handler.sendItem
        )
        .get(`/open-question-my`,
            handler.getMyQuestions,
            handler.sendItem
        )
        .get(`/question-my`,
            handler.getAllMyQuestions,
            handler.sendItem
        )
        .post(`/open-question-byCompanyName`,
            CompanyNameHandler.searchItems,
            CompanyHandler.searchItems,
            handler.getQuestionsByCompany,
            handler.sendItem
        )
        .post(`/open-question-add`,
            handler.addCompanyQuestion,
            handler.sendItem
        )
        .use(`/open-question`,
            rest(handler)
        )
}

export default router(OpenQuestion)