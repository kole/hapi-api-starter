import Joi from 'joi';

export default {
    initiate: {
        payload: Joi.object().keys({
            email: Joi.string().email({ minDomainAtoms: 2 }).max(100).trim().required()
        })
    }
};
