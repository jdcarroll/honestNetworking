// recommended options for Good to log requests

if(process.env.DEBUG){
    // if DEBUG is on options are as such
    module.exports = {
        ops: {
            interval: 1000
        },
        reporters: {
            console: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{ log: '*', response: '*' }]
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
}else {
    // if DEBUG is off options are this
    module.exports = {
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
                args: ['./test/fixtures/awesome_log']
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
}


