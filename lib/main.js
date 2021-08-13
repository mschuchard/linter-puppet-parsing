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
        const file = textEditor.getPath();

        return helpers.exec(atom.config.get('linter-puppet-parsing.puppetExecutablePath'), ['parser', 'validate', '--render-as', 'json', file], {ignoreExitCode: true}).then(output => {
          var toReturn = [];

          // parse json output
          const info = JSON.parse(output)

          info.forEach((issue) => {

          });
          return toReturn;
        });
      }
    };
  }
};
