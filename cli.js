#!/usr/bin/env node

var fs = require('fs');
var genericCli = require('generic-cli');
var decamelize = require('decamelize');
var camelcase = require('camelcase');
var uppercamelcase = function (str) {
    str = camelcase(str);
    var first = str.charAt(0).toUpperCase();
    if (str.length === 1)
        return first;
    str = first + str.substring(1, str.length);
};
var ejs = require('ejs');
var templates = require('./templates');
var pluralize = require('pluralize');
var mkdirp = require('mkdirp');
require('colors');

genericCli({
    help: {
        make: {
            _: 'Generator commands',
            controller: 'Create a controller',
            component: 'Create a component',
            directive: 'Create a directive',
            service: 'Create a service',
        }
    },

    commands: {
        make: {
            controller(controllerName) {
                this.requireArgs();
                this.onlyLetterArgs();

                controllerName = uppercamelcase(controllerName);

                this.makeClass('controller', controllerName)
                    .then(() => {
                        this.success('Made controller: ' + controllerName)
                    }, (err) => {
                        if (err)
                            throw err;
                        this.info('Did not make controller: ' + controllerName);
                    }).catch(err => {
                        console.error(err);
                    });
            },
            service(serviceName) {
                this.requireArgs();
                this.onlyLetterArgs();

                serviceName = uppercamelcase(serviceName);

                this.makeClass('service', serviceName)
                    .then(() => {
                        this.success('Made service: ' + serviceName)
                    }, (err) => {
                        if (err)
                            throw err;
                        this.info('Did not make service: ' + serviceName);
                    }).catch(err => {
                        console.error(err);
                    });
            },
            component(componentName) {
                this.requireArgs();
                this.onlyLetterArgs();

                componentName = camelcase(componentName);

                this.makeFunction('component', componentName)
                    .then(() => {
                        this.success('Made component: ' + serviceName)
                    }, (err) => {
                        if (err)
                            throw err;
                        this.info('Did not make component: ' + serviceName);
                    }).catch(err => {
                        console.error(err);
                    });
            },
            directive(directiveName) {
                this.requireArgs();
                this.onlyLetterArgs();

                directiveName = camelcase(directiveName);

                this.makeFunction('directive', directiveName)
                    .then(() => {
                        this.success('Made component: ' + directiveName)
                    }, (err) => {
                        if (err)
                            throw err;
                        this.info('Did not make directive: ' + directiveName);
                    }).catch(err => {
                        console.error(err);
                    });
            }
        }
    },

    extend: {
        makeClass,
        makeFunction,
        onlyLetters(arg) {
            return this.assertMatches(this.args[arg], /^[a-zA-Z]+$/);
        },
        onlyLetterArgs() {
            Object.keys(this.args).forEach(arg => {
                this.onlyLetters(arg);
            });
        }
    }
});

function makeClass(type, name) {
    return writeTemplate.call(this, 'class', type, name);
}

function makeFunction(type, name) {
    return writeTemplate.call(this, 'function', type, name);
}

function writeTemplate(templateName, type, name) {
    let template = ejs.render(templates[templateName], {
        name
    });
    let fileName = process.cwd() + '/src/js/' + pluralize(type) + '/' + decamelize(name, '-') + '.js';

    return Promise.resolve({
        template,
        fileName
    }).then(data => {
        return new Promise((res, rej) => {
            fs.stat(data.fileName, (err, stats) => {
                if (err) {
                    data.isFile = false;
                    res(data);
                } else {
                    data.isFile = stats.isFile()
                    res(data);
                }
            });
        });
    }).then(data => {
        return new Promise((res, rej) => {
            if (data.isFile) {
                this.ask('Do you want to overwrite the existing file?', (err, answer) => {
                    if (answer) {
                        res(data);
                    } else {
                        rej();
                    }
                });
            } else {
                res(data);
            }
        });
    }).then(data => {
        return new Promise((res, rej) => {
            mkdirp(data.fileName.split('/').slice(0, -1).join('/'), (err) => {
                if (err)
                    rej(err);
                else res(err);
            })
        })
    }).then(data => {
        return new Promise((res, rej) => {
            fs.writeFile(fileName, template, (err) => {
                if (err) {
                    this.error('Could not write file');
                    rej(err);
                }
                else res();
            });
        });
    });
}
