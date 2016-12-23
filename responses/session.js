// valid example API responses
import Joi from 'joi';

export default {
    newSession: Joi.object(
        {
            _id: Joi.string().guid().required(),
            email: Joi.string().email({ minDomainAtoms: 2 }).max(100).trim().required(),
            username: Joi.string().max(30).trim(),
            fname: Joi.string().max(50).trim(),
            lname: Joi.string().max(50).trim(),
            address1: Joi.string().max(100).trim(),
            address2: Joi.string().max(100).trim(),
            city: Joi.string().max(50).trim(),
            state: Joi.string().max(2).trim(),
            zip: Joi.string().max(20).trim(),
            mobile: Joi.string().max(20).trim(),
            accounts: Joi.array().items(Joi.object().keys({
                aid: Joi.string().guid().required(),
                role: Joi.string().required(),
                default: Joi.boolean() // default account for login
            })).required(),
            createdAt: Joi.number().min(10).required(),
            last_seen_date: Joi.number().min(10),
            verified: Joi.boolean().required(),
            sid: Joi.string()
        }
    ).label('Result')
};
