const fs = require('fs');
const templateNames = fs.readdirSync('./');
const templates = {}; // name -> template

templateNames.forEach(name => {
    templates[name] = require('./' + name);
});

module.exports = templates;
