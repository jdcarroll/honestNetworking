// recommended options for Good to log requests

    // if DEBUG is on options are as such
var options = {
        ops: {
            interval: 1000
        },
        reporters: {
            console: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: []
            }, {
                module: 'good-console'
            }, 'stdout'],
            file: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{ ops: '*' }]
            }, {
                module: 'good-squeeze',
                name: 'SafeJson'
            }, {
                module: 'good-file',
                args: ['./log/errors.log']
            }],
            http: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{ error: '*' }]
            }, {
                module: 'good-http',
                args: ['http://prod.logs:3000', {
                    wreck: {
                        headers: { 'x-api-key': 12345 }
                    }
                }]
            }]
        }
    }

if(process.env.DEBUG){
    options.reporters.console[0].args = [{ log: '*', response: '*' }];
}

module.exports = options;
