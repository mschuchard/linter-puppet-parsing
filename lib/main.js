'use babel';

export default {
  config: {
    puppetExecutablePath: {
      title: 'Puppet Executable Path',
      type: 'string',
      description: 'Path to Puppet executable (e.g. /opt/puppetlabs/bin/puppet) if not in shell env path.',
      default: 'puppet',
    }
  },

  deactivate() {
    this.idleCallbacks.forEach((callbackID) => window.cancelIdleCallback(callbackID));
    this.idleCallbacks.clear();
    this.subscriptions.dispose();
  },

  provideLinter() {
    return {
      name: 'Puppet',
      grammarScopes: ['source.puppet'],
      scope: 'file',
      lintsOnChange: false,
      lint: async (textEditor) => {
        // set const vars
        const helpers = require('atom-linter');
        const regex = /(Error|Warning).*:\s(.*)\sat.*\.pp:(\d+):?(\d+)?/;
        const regex_new = /(Error|Warning).*:\s(.*)\s\(file.*line: (\d+), column: (\d+)/;
        const file = textEditor.getPath();

        return helpers.exec(atom.config.get('linter-puppet-parsing.puppetExecutablePath'), ['parser', 'validate', file], {stream: 'stderr', allowEmptyStderr: true}).then(output => {
          var toReturn = [];

          output.split(/\r?\n/).forEach((line) => {
            // setup matchers for normal line and col info or eof location
            const matches_line_col = regex.exec(line);
            const matches_new = regex_new.exec(line)
            const matches_eof = /Syntax error at end of/.exec(line);

            // parse the errors and warnings with line and col info output from puppet parser validate
            if (matches_line_col != null) {
              toReturn.push({
                severity: matches_line_col[1].toLowerCase(),
                excerpt: matches_line_col[2],
                location: {
                  file: file,
                  position: [[Number.parseInt(matches_line_col[3]) - 1, Number.parseInt(matches_line_col[4]) - 1], [Number.parseInt(matches_line_col[3]) - 1, Number.parseInt(matches_line_col[4])]],
                },
              });
            }
            // same kind of parsing, but for puppet>=5.4 output
            else if (matches_new != null) {
              toReturn.push({
                severity: matches_new[1].toLowerCase(),
                excerpt: matches_new[2],
                location: {
                  file: file,
                  position: [[Number.parseInt(matches_new[3]) - 1, Number.parseInt(matches_new[4]) - 1], [Number.parseInt(matches_new[3]) - 1, Number.parseInt(matches_new[4])]],
                },
              });
            }
            // parse the errors with end of file from puppet parser validate
            else if (matches_eof != null) {
              toReturn.push({
                severity: 'error',
                excerpt: 'Syntax error at end of file.',
                location: {
                  file: file,
                  position: [[textEditor.getLastScreenRow() - 1, 0], [textEditor.getLastScreenRow() - 1, 1]],
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
