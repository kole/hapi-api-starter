import fs from 'fs';
import path from 'path';
import Boom from 'boom';
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

export default {
    sendWelcome: (user) => {
        emailTemplate('welcome').then((result) => {
            const email = {
                to: 'me@nickolas.io',
                from: 'hello@weelabs.io',
                subject: 'Hello world',
                html: result
            };

            mailer.send(email);
        });
    }
};
