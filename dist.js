var fs = require('fs'),
    path = require('path'),
    template, oneLinedTemplate, directive;

template = fs.readFileSync(path.resolve('src/user-component.html'));
oneLinedTemplate = template.toString().split(/\s*\n\s*/).join('');

directive = fs.readFileSync(path.resolve('src/user-component.js')).toString();
directive = directive.replace(
    /templateUrl\s*\:\s*? 'user\-component\.html\'/, 'template: \'' +
    oneLinedTemplate +'\'');

fs.writeFileSync(path.resolve('user-component.js'), directive);
