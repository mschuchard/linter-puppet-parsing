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
        const editorFile = textEditor.getPath();

        return helpers.exec(atom.config.get('linter-puppet-parsing.puppetExecutablePath'), ['parser', 'validate', '--render-as', 'json', editorFile], {ignoreExitCode: true}).then(output => {
          var toReturn = [];

          // parse json output
          const info = JSON.parse(output)

          info.forEach((filename, issue) => {
            // defaults if no information provided
            const file = issue.file == null ? filename : issue.file;
            const lineStart = issue.line == null ? 0 : issue.line - 1;
            const lineEnd = issue.line == null ? 0 : issue.line - 1;
            const colStart = issue.pos == null ? 0 : issue.pos - 1;
            const colEnd = issue.pos == null ? 1 : issue.pos;
            const severity = /ERROR/.exec(issue.issue_code) == null ? 'warning' : 'error';

            toReturn.push({
              severity: severity,
              excerpt: issue.message,
              location: {
                file: file,
                position: [[lineStart, lineEnd], [colStart, colEnd]],
              },
            });
          });
          return toReturn;
        });
      }
    };
  }
};
