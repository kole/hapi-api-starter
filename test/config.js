// since we are importing the index file (not the entry file)
// we have to have babel do the transform here as part of the test run
// more info here: https://github.com/hapijs/lab

const Babel = require('babel-core');

module.exports = [
    {
        ext: '.js',
        transform: (content, filename) => {
            // Make sure to only transform your code or the dependencies you want
            if (filename.indexOf('node_modules') === -1) {
                const result = Babel.transform(content, { sourceMap: 'inline', filename, sourceFileName: filename });
                return result.code;
            }

            return content;
        }
    }
];
