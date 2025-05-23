'use babel';

export default {
  config: {
    puppetExecutablePath: {
      title: 'Puppet Executable Path',
      type: 'string',
      description: 'Path to Puppet executable (e.g. /opt/puppet/bin/puppet) if not in shell env path.',
      default: 'puppet',
    },
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
        const editorFile = textEditor.getPath();
        const args = ['parser', 'validate', '--render-as', 'json'];

        // detect if plan and assign args appropriately
        if (/plan\s.*::/.exec(textEditor.getText()))
          args.push(...['--tasks', editorFile]);
        else
          args.push(editorFile);

        return helpers.exec(atom.config.get('linter-puppet-parsing.puppetExecutablePath'), args, { stream: 'both' }).then(output => {
          // initialize vars
          const toReturn = [];
          let info = [[]];

          // parse json output
          try {
            info = JSON.parse(output.stdout);

            // valid json (else caught by now), so iterate through array destructured object entries representing issue(s)
            Object.entries(info).forEach(([filename, issue]) => {
              // defaults if no information provided
              const file = issue.file == null ? filename : issue.file;
              const lineStart = issue.line == null ? textEditor.getLastScreenRow() - 1 : issue.line - 1;
              const lineEnd = issue.line == null ? textEditor.getLastScreenRow() - 1 : issue.line - 1;
              const colStart = issue.pos == null ? 0 : issue.pos - 1;
              const colEnd = issue.pos == null ? 1 : issue.pos;
              const severity = /ERROR/.exec(issue.issue_code) == null ? 'warning' : 'error';

              toReturn.push({
                severity,
                excerpt: issue.message,
                location: {
                  file,
                  position: [[lineStart, colStart], [lineEnd, colEnd]],
                },
              });
            });
          } catch (SyntaxError) {
            // if parser returns invalid json, then the file is clean or the output contains a raw string(s); either way, continue onwards to handle each situation appropriately
          }

          // sometimes issues fail to output as json, or also contain non-json info
          output.stderr.split(/\r?\n/).forEach((line) => {
            const matches = /(Error|Warning).*:\s(.*)\sat.*\.pp:(\d+):?(\d+)?/.exec(line);
            const matchesNew = /(Error|Warning).*:\s(.*)\s\(file.*line: (\d+), column: (\d+)/.exec(line);

            // parse the errors and warnings with line and col info output from puppet parser validate
            if (matches != null) {
              toReturn.push({
                severity: matches[1].toLowerCase(),
                excerpt: matches[2],
                location: {
                  file: editorFile,
                  position: [[Number.parseInt(matches[3], 10) - 1, Number.parseInt(matches[4], 10) - 1], [Number.parseInt(matches[3], 10) - 1, Number.parseInt(matches[4], 10)]],
                },
              });
            } else if (matchesNew != null) {
              // same kind of parsing, but for puppet>=5.4 output
              toReturn.push({
                severity: matchesNew[1].toLowerCase(),
                excerpt: matchesNew[2],
                location: {
                  file: editorFile,
                  position: [[Number.parseInt(matchesNew[3], 10) - 1, Number.parseInt(matchesNew[4], 10) - 1], [Number.parseInt(matchesNew[3], 10) - 1, Number.parseInt(matchesNew[4], 10)]],
                },
              });
            }
          });

          // return the parsed info from stdout and stderr
          return toReturn;
        });
      }
    };
  }
};
