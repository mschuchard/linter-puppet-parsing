"use babel";

//TODO: add atom testrunner(jasmine+travisci)

export default {
  config: {
    puppetExecutablePath: {
      title: 'Puppet Executable Path',
      type: 'string',
      description: 'Path to Puppet executable (e.g. /opt/puppetlabs/bin/puppet) if not in shell env path.',
      default: 'puppet'
    },
    puppetParserArgs: {
      title: 'Puppet Parser Arguments',
      type: 'array',
      description: 'Arguments (e.g. --parser=future --parser=foobar) to pass to parser.',
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
    return {
      name: 'Puppet',
      grammarScopes: ['source.puppet'],
      scope: 'file',
      lintOnFly: false,
      lint: (activeEditor) => {
        const helpers = require('atom-linter');
        const regex = /^.*:\s(.*)\sat.*\.pp:(\d+).*$/;
        const file = activeEditor.getPath();

        var args = ['parser']
        if (atom.config.get('linter-puppet-parsing.puppetParserArgs')[0] !== '') {
          args = args.concat(atom.config.get('linter-puppet-parsing.puppetParserArgs'));
        }
        args = args.concat(['validate', file]);

        return helpers.exec(atom.config.get('linter-puppet-parsing.puppetExecutablePath'), args, {stream: 'stderr'}).then(output => {
          var toReturn = [];
          output.split(/\r?\n/).forEach(function (line) {
            const matches = regex.exec(line);
            if (matches != null) {
              toReturn.push({
                type: 'Error',
                text: matches[1],
                range: helpers.rangeFromLineNumber(activeEditor, Number.parseInt((matches[2] - 1))),
                filePath: file
              });
            }
          });
          return toReturn;
        });
      }
    };
  }
};
