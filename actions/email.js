import fs from 'fs';
import path from 'path';
import Boom from 'boom';
import config from 'config';
import handlebars from 'handlebars';
import mailer from 'sendgrid-mailer';

mailer.config(process.env.SENDGRID_API_KEY);

// this will be called after the file is read
function renderToString(source, data) {
    const template = handlebars.compile(source);
    const outputString = template(data);
    return outputString;
}

const emailTemplate = (templateName) => {
    return new Promise((resolve, reject) => {
        const template = path.join(__dirname, `../email/${templateName}.hbs`);
        fs.readFile(template, (err, data) => {
            if (err) { reject(Boom.badRequest('Error sending email')); }

            const source = data.toString();
            const renderedTemp = renderToString(source, {});
            return resolve(renderedTemp);
        });
    });
};

const fromAddr = `${config.get('company_name')} <${config.get('company_email')}>`;
const toAddr = (usr) => {
    if (usr.fname && usr.lname) {
        return `${usr.fname} ${usr.lname} <${usr.email}>`;
    }

    if (usr.fname) {
        return `${usr.fname} <${usr.email}>`;
    }

    return usr.email;
};

export default {
    sendWelcome: (user) => {
        emailTemplate('welcome').then((result) => {
            const email = {
                to: toAddr(user),
                from: fromAddr,
                subject: `Welcome to ${config.get('company_name')}!`,
                html: result
            };

            mailer.send(email);
        });
    }
};
