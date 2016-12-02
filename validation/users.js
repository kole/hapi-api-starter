const Joi = require('joi');

module.exports = {
    getUser: {
        params: {
            id: Joi.string().token().required()
        }
    }
};
