module.exports = {
    'class':
`class <%= name %> {
    constructor() {
        'ngInject';
    }
}

module.exports = <%= name %>;
`,
    'function':
`function <%= name %> {
    'ngInject';
}

module.exports = <%= name %>;
`
};
