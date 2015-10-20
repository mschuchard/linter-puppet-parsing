"use babel";

export default {
  config: {
    puppetExecutablePath: {
      title: "Puppet Executable Path",
      type: 'string',
      description: "Path to Puppet executable",
      default: 'puppet'
    },
    puppetParserArgs: {
      title: "Puppet Parser Arguments",
      type: 'array',
      description: "Arguments (e.g. --parser=future --parser=foobar) to pass to parser",
      default: [''],
      items: {
        type: 'string'
      }
    }
  },

  activate: () => {
    require('atom-package-deps').install('linter-puppet-parsing');
  },

  provideLinter: () => {
    const helpers = require("atom-linter");
    const path = require("path");
    const regex = /^.*:.*:\s(.*) at.*\.pp:(\d+).*$/;
    return {
      name: "Puppet",
      grammarScopes: ["source.puppet"],
      scope: "file",
//TODO: lintonfly
      lintOnFly: false,
      lint: (activeEditor) => {
        const file = activeEditor.getPath();
        const cwd = path.dirname(file);
        const command = atom.config.get("linter-puppet-parsing.puppetExecutablePath");

        var args = ['parser']
        if (atom.config.get("linter-puppet-parsing.puppetParserArgs")[0] !== '') {
          args = args.concat(atom.config.get("linter-puppet-parsing.puppetParserArgs"));
        }
        args = args.concat(['validate', file]);

        return helpers.exec(command, args, {stream: 'stderr', cwd: cwd}).then(output => {
          var toReturn = [];
//TODO: parser only ever outputs one error at a time
          output.split(/\r?\n/).forEach(function (line) {
            const matches = regex.exec(line);
            if (matches === null) {
              return;
            }
            toReturn.push({
              range: helpers.rangeFromLineNumber(activeEditor, Number.parseInt((matches[2] - 1))),
              type: 'Error',
              text: matches[1],
              filePath: file
            });
          });
          return toReturn;
        });
      }
    };
  }
};
