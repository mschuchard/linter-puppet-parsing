![Preview](https://raw.githubusercontent.com/mschuchard/linter-puppet-parsing/master/linter_puppet_parsing.png)

Image displays example of simultaneous use of Linter-Puppet-Parsing with Linter-Puppet-Lint.

### Linter-Puppet-Parsing
[![Build Status](https://travis-ci.org/mschuchard/linter-puppet-parsing.svg?branch=master)](https://travis-ci.org/mschuchard/linter-puppet-parsing)

Linter-Puppet-Parsing aims to provide functional and robust `puppet parser validate` linting functionality in Atom.

### Installation
The Puppet or Puppet Enterprise client software is required to be installed (preferably from a package or a gem) before using this. Version 4 or higher of Puppet is required, and version 5.5.x or 6.x is recommended. The Linter and Language-Puppet Atom packages are also required.

### Usage
- Avoid specifying arguments or flags (e.g. `--debug`) that greatly affect the formatting of the parser output.  These will cause issues.
- The Puppet parser only throws errors for the first line of errors it encounters in a manifest, so this linter only displays one line of errors at a time. However, multiple lines of warnings will be displayed.
- On Windows, you have to specify the absolute path to the Puppet executable, even if it is in your environment `PATH` (e.g. `C:\Program Files\Puppet Labs\Puppet\bin\puppet`).
