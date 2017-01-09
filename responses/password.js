// valid example API responses
import Joi from 'joi';

export default {
    initiate: Joi.object({
        status: 'pending'
    }).label('Result')
};
