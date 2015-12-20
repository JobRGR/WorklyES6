import express from 'express'
import OpenQuestion from '../../handler/open_question'
import CompanyNameHandler from '../../handler/company_name'
import CompanyHandler from '../../handler/company'
import checkCompany from '../../middleware/check/company'
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
        .get(`/open-question-company/:id`,
            handler.getQuestionsById,
            handler.sendItems
        )
        .get(`/open-question-my`,
            checkCompany,
            handler.getMyQuestions,
            handler.sendItems
        )
        .post(`/open-question-company`,
            CompanyNameHandler.searchItems,
            CompanyHandler.searchItems,
            handler.getQuestionsByCompany,
            handler.sendItems
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