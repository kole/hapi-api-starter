const Joi = require('joi');

module.exports = {
    signup: {
        payload: {
            email: Joi.string().email({ minDomainAtoms: 2 }).required(),
            password: Joi.string().min(8).required(),
            username: Joi.string()
        }
    }
};
