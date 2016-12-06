const Joi = require('joi');

module.exports = {
    signup: {
        payload: {
            email: Joi.string().email({ minDomainAtoms: 2 }).trim().required(),
            password: Joi.string().min(8).trim().required(),
            username: Joi.string()
        }
    }
};
