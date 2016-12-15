import Joi from 'joi';

export default {
    getUser: {
        params: {
            id: Joi.string().token().required()
        }
    },
    login: {
        payload: {
            email: Joi.string().email({ minDomainAtoms: 2 }).max(100).trim().required(),
            password: Joi.string().min(8).max(100).trim().required()
        }
    }
};
