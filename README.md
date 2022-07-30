![Preview](https://raw.githubusercontent.com/mschuchard/linter-puppet-parsing/master/linter_puppet_parsing.png)

Image displays example of simultaneous use of Linter-Puppet-Parsing with Linter-Puppet-Lint.

### Linter-Puppet-Parsing
[![Build Status](https://travis-ci.com/mschuchard/linter-puppet-parsing.svg?branch=master)](https://travis-ci.com/mschuchard/linter-puppet-parsing)

Linter-Puppet-Parsing aims to provide functional and robust `puppet parser validate` linting functionality in Atom.

### Atom Editor Sunset Updates

`apm` was discontinued prior to the sunset by the Atom Editor team. Therefore, the installation instructions are now as follows:

- Locate the Atom packages directory on your filesystem (normally at `<home>/.atom/packages`)
- Retrieve the code from this repository either via `git` or the Code-->Download ZIP option in Github.
- Place the directory containing the repository's code in the Atom packages directory.
- Execute `npm install` in the package directory.

Additionally, this package is now in maintenance mode. All feature requests and bug reports in the Github repository issue tracker will receive a response, and possibly also be implemented. However, active development on this package has ceased.

### Installation
The Puppet or Puppet Enterprise client software is required to be installed before using this. A version of Puppet in the range from 4 to 7 is required. While version 4 is theoretically supported, it is no longer available for testing, and therefore compatibility cannot be guaranteed. The Linter and Language-Puppet Atom packages are also required.

### Usage
- The Puppet parser only throws errors for the first line of errors it encounters in a manifest, so this linter only displays one line of errors at a time. However, multiple lines of warnings will be displayed.
- On Windows, you have to specify the absolute path to the Puppet executable, even if it is in your environment `PATH` (e.g. `C:\Program Files\Puppet Labs\Puppet\bin\puppet`).
