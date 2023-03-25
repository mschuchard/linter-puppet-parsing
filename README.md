![Preview](https://raw.githubusercontent.com/mschuchard/linter-puppet-parsing/master/linter_puppet_parsing.png)

Image displays example of simultaneous use of Linter-Puppet-Parsing with Linter-Puppet-Lint.

### Linter-Puppet-Parsing
[![Build Status](https://travis-ci.com/mschuchard/linter-puppet-parsing.svg?branch=master)](https://travis-ci.com/mschuchard/linter-puppet-parsing)

Linter-Puppet-Parsing aims to provide functional and robust `puppet parser validate` linting functionality in Atom/Pulsar.

### APM (Atom) and PPM (Pulsar) Support

`apm` was discontinued prior to the sunset by the Atom Editor team. `ppm` for Pulsar does not yet support package publishing. Therefore, the installation instructions are now as follows if you want the latest version in Atom, Atom Beta, or Atom Dev:

- Locate the Atom or Pulsar packages directory on your filesystem (normally at `<home>/.{atom,pulsar}/packages`)
- Retrieve the code from this repository either via `git` or the Code-->Download ZIP option in Github.
- Place the directory containing the repository's code in the Atom or Pulsar packages directory.
- Execute `npm install` in the package directory (requires NPM).
- Repeat for any missing or outdated dependencies.

and Pulsar:

- Install the old version of the package as usual with either PPM or the GUI installer in the editor.
- Locate the Atom or Pulsar packages directory on your filesystem (normally at `<home>/.{atom,pulsar}/packages`)
- Replace the `lib/main.js` file in the package directory with the file located in this remote Github repository.

Additionally: this package is now in maintenance mode. All feature requests and bug reports in the Github repository issue tracker will receive a response, and possibly also be implemented (especially bug fixes). However, active development on this package has ceased.

Note that at this current time the package unit tests (outside of CI which will be Atom Beta `1.61.0` for the time being) and acceptance testing are performed with the latest stable version of Pulsar.

### Installation
The Puppet or Puppet Enterprise client software is required to be installed before using this. A version of Puppet in the range from 4 to 7 is required. While version 4 is theoretically supported, it is no longer available for testing, and therefore compatibility cannot be guaranteed. The Linter and Language-Puppet Atom packages are also required.

### Usage
- The Puppet parser only throws errors for the first line of errors it encounters in a manifest, so this linter only displays one line of errors at a time. However, multiple lines of warnings will be displayed.
- On Windows, you have to specify the absolute path to the Puppet executable, even if it is in your environment `PATH` (e.g. `C:\Program Files\Puppet Labs\Puppet\bin\puppet`).
