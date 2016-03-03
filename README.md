![Preview](https://raw.githubusercontent.com/mschuchard/linter-puppet-parsing/master/linter_puppet_parsing.png)

Image displays example of simultaneous use of 'linter-puppet-parsing' with 'linter-puppet-lint.'

### linter-puppet-parsing
Linter-puppet-parsing aims to provide functional and robust puppet parser validate linting functionality in Atom.  Adapted from linter-ruby and linter-puppet-lint.  Intended to be used as a complement to linter-puppet-lint to provide syntax checks in addition to puppet-lint's style checks.

### Installation
The Puppet or Puppet Enterprise Agent is required to be installed (preferably from a package or a gem) before using this.  The 'linter' atom package is also required but should be automatically installed as a dependency thanks to steelbrain's package-deps.

### Usage
- Avoid specifying arguments (e.g. --debug) that greatly affect the formatting of the parser output.  These will cause issues.
- Be aware that the puppet parser is slower than most executables used for linting and its errors may require several seconds after saving to display.
- Also be aware that the puppet parser only throws errors for the first line of errors it encounters in a manifest so this linter only display one line of errors at a time.
