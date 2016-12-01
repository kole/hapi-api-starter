const Joi = require('joi');

module.exports = {
    createUser: {
        payload: {
            email: Joi.string().email({ minDomainAtoms: 2 }).required(),
            password: Joi.string().min(8).required()
        }
    }
};
