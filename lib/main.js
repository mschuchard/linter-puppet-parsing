'use babel';

export default {
  config: {
    puppetExecutablePath: {
      title: 'Puppet Executable Path',
      type: 'string',
      description: 'Path to Puppet executable (e.g. /opt/puppetlabs/bin/puppet) if not in shell env path.',
      default: 'puppet',
    },
    puppetParserArgs: {
      title: 'Puppet Parser Arguments',
      type: 'array',
      description: 'Arguments (e.g. --parser=future --parser=foobar) to pass to parser.',
      default: [],
      items: {
        type: 'string'
      }
    }
  },

  provideLinter() {
    return {
      name: 'Puppet',
      grammarScopes: ['source.puppet'],
      scope: 'file',
      lintsOnChange: false,
      lint: (activeEditor) => {
        // sert const vars
        const helpers = require('atom-linter');
        const regex = /(Error|Warning).*:\s(.*)\sat.*\.pp:(\d+):?(\d+)?/;
        const file = activeEditor.getPath();

        // add arg to puppet to use parser subcommand
        var args = ['parser']

        // add arbitrary puppet args
        if (atom.config.get('linter-puppet-parsing.puppetParserArgs')[0] !== '')
          args = args.concat(atom.config.get('linter-puppet-parsing.puppetParserArgs'));

        // add arg to parser for sub-subcommand to validate and file to validate
        args = args.concat(['validate', file]);

        return helpers.exec(atom.config.get('linter-puppet-parsing.puppetExecutablePath'), args, {stream: 'stderr', allowEmptyStderr: true}).then(output => {
          var toReturn = [];
          output.split(/\r?\n/).forEach(function (line) {
            // setup matchers for normal line and col info or eof location
            const matches_line_col = regex.exec(line);
            const matches_eof = /Syntax error at end of file/.exec(line);

            // parse the errors and warnings with line and col info output from puppet parser validate
            if (matches_line_col != null) {
              toReturn.push({
                severity: matches_line_col[1].toLowerCase(),
                excerpt: matches_line_col[2],
                location: {
                  file: file,
                  position: matches_line_col[4] == undefined ? [[Number.parseInt(matches_line_col[3]) - 1, 0], [Number.parseInt(matches_line_col[3]) - 1, 1]] : [[Number.parseInt(matches_line_col[3]) - 1, Number.parseInt(matches_line_col[4]) - 1], [Number.parseInt(matches_line_col[3]) - 1, Number.parseInt(matches_line_col[4])]],
                },
              });
            }
            // parse the errors and warnings with end of file from puppet parser validate
            else if (matches_eof != null) {
              toReturn.push({
                severity: 'error',
                excerpt: 'Syntax error at end of file.',
                location: {
                  file: file,
                  position: [[0, 0], [0, 1]],
                },
              });
            }
          });
          return toReturn;
        });
      }
    };
  }
};
