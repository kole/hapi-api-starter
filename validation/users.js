import Joi from 'joi';

export default {
    getUser: {
        params: Joi.object({
            id: Joi.string().token().required()
        })
    },
    login: {
        payload: Joi.object({
            email: Joi.string().email({ minDomainAtoms: 2 }).max(100).trim().required(),
            password: Joi.string().min(8).max(100).trim().required()
        })
    }
};
