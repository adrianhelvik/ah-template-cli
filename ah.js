#!/usr/bin/env node

var fs = require('fs');
var genericCli = require('generic-cli');
var decamelize = require('decamelize');
var camelcase = require('camelcase');
var uppercamelcase = function (str) {
    str = camelcase(str);
    var first = str.charAt(0).toUpperCase();
    if (str.length === 1) {
        return first;
    }
    return first + str.substring(1, str.length);
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
            view: 'Create a view'
        }
    },

    commands: {
        make: {
            controller(name) {
                this.requireArgs();
                this.onlyLetterArgs();

                name = uppercamelcase(name);

                this.makeClass('controller', name)
                    .then(() => {
                        this.success('Made controller: ' + name);
                    }, (err) => {
                        if (err) {
                            throw err;
                        }
                        this.info('Did not make controller: ' + name);
                    }).catch(err => {
                        console.error(err);
                    });
            },
            service(name) {
                this.requireArgs();
                this.onlyLetterArgs();

                name = uppercamelcase(name);

                this.makeClass('service', name)
                    .then(() => {
                        this.success('Made service: ' + name);
                    }, (err) => {
                        if (err) {
                            throw err;
                        }
                        this.info('Did not make service: ' + name);
                    }).catch(err => {
                        console.error(err);
                    });
            },
            component(name) {
                this.requireArgs();
                this.onlyLetterArgs();

                name = camelcase(name);

                this.makeObject('component', name)
                    .then(() => {
                        this.success('Made component: ' + name);
                    }, (err) => {
                        if (err) {
                            throw err;
                        }
                        this.info('Did not make component: ' + name);
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
                        this.success('Made component: ' + directiveName);
                    }, (err) => {
                        if (err) {
                            throw err;
                        }
                        this.info('Did not make directive: ' + directiveName);
                    }).catch(err => {
                        console.error(err);
                    });
            },
            view(name) {
                this.requireArgs();

                this.makeView(name)
                    .then(() => {
                        this.success('Make view ' + name);
                    }, (err) => {
                        if (err) {
                            throw err;
                        }
                        this.info('Did not make view ' + name);
                    });
            }
        }
    },

    extend: {
        makeClass,
        makeFunction,
        makeObject,
        makeView,
        onlyLetters(arg) {
            return this.assertMatches(this.args[arg], /^[a-zA-Z]+$/);
        },
        onlyLetterArgs() {
            Object.keys(this.args).forEach(arg => {
                this.onlyLetters(arg);
            });
        },
    }
});

function makeClass(type, name) {
    return writeTemplate.call(this, 'class', type, name);
}

function makeFunction(type, name) {
    return writeTemplate.call(this, 'function', type, name);
}

function makeObject(type, name) {
    return writeTemplate.call(this, 'object', type, name);
}

function makeView(name) {
    return writeTemplate.call(this, 'view', null, name);
}

function writeTemplate(templateName, type, name) {
    const template = ejs.render(templates[templateName], {
        name
    });

    if (! type) {
        type = '';
    }

    let fileName;
    if (templateName === 'view') {
        fileName = process.cwd() + '/src/views/' + decamelize(name) + '.html';
    } else {
        fileName = process.cwd() + '/src/js/' + pluralize(type) + '/' + decamelize(name, '-') + '.js';
    }

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
                    data.isFile = stats.isFile();
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
                if (err) {
                    rej(err);
                } else {
                    res(err);
                }
            });
        });
    }).then(data => {
        return new Promise((res, rej) => {
            fs.writeFile(fileName, template, (err) => {
                if (err) {
                    this.error('Could not write file');
                    rej(err);
                }
                else {
                    res();
                }
            });
        });
    });
}
