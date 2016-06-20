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
`function <%= name %>() {
    'ngInject';
}

module.exports = <%= name %>;
`,
    'view':
`<!-- A fresh view for your pleasure! -->`,
'object':
`module.exports = {
    //
}`
};
