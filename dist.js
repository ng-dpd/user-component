var fs = require('fs'),
    exec = require('child_process').exec,
    path = require('path');

exec('mkdir dist', function () {
  var template = fs.readFileSync(path.resolve('src/user-component.html'));
  var oneLinedTemplate = template.toString().split(/\s*\n\s*/).join('');

  var directive = fs.readFileSync(path.resolve('src/user-component.js')).toString();
  directive = directive.replace(
      /templateUrl\:\s*? 'user\-component\.html\'/, 'template: \'' +
      oneLinedTemplate +'\'');
  console.log(directive);

  fs.writeFileSync(path.resolve('dist/user-component.js'), directive);
});