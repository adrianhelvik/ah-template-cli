module.exports =
` function <%= name %>() {
    'ngInject';

    return {
        restrict: 'A',
    };
}

module.exports = <%= name %>;
`;
