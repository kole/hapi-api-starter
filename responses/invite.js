// valid example API responses
import Joi from 'joi';

export default {
    newInvite: Joi.object({
        status: 'pending'
    }).label('Result')
};
