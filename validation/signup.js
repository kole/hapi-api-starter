import Joi from 'joi';

export default {
    signup: {
        payload: Joi.object().keys({
            email: Joi.string().email({ minDomainAtoms: 2 }).max(100).trim().required(),
            password: Joi.string().min(8).max(100).trim().required(),
            username: Joi.string().max(30).trim(),
            fname: Joi.string().max(50).trim(),
            lname: Joi.string().max(50).trim(),
            address1: Joi.string().max(100).trim(),
            address2: Joi.string().max(100).trim(),
            city: Joi.string().max(50).trim(),
            state: Joi.string().max(2).trim(),
            zip: Joi.string().max(20).trim(),
            mobile: Joi.string().max(20).trim()
        }).label('Payload')
    }
};
