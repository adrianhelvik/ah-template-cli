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
    bindings: {
        // @ : text
        // < : one way binding
        // = : two way binding
        // & : Outputs are realized with & bindings, which function as callbacks to component events.
    },
    template: \`
    \`
};`
};
