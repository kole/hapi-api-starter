const Joi = require('joi');

module.exports = {
    createUser: {
        email: Joi.string().email({ minDomainAtoms: 2 }).required(),
        password: Joi.string().min(8).required()
    }
};
