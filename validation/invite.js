import Joi from 'joi';

export default {
    invite: {
        payload: {
            email: Joi.string().email({ minDomainAtoms: 2 }).max(100).trim().required()
        }
    }
};
