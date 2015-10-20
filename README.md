### linter-puppet-parsing
Linter-puppet-parsing aims to provide working and robust puppet parser validate linting functionality.  Adapted from linter-ruby and linter-puppet-lint.  Intended to be used as a complement to linter-puppet-lint to provide syntax checks in addition to puppet-lint's style checks.

### Installation
Puppet is required to be installed before using this.  The 'linter' atom package is also required but should be automatically installed as a dependency thanks to steelbrain's package-deps.

### Usage
Avoid specifying arguments (e.g. --debug) that greatly affect the formatting of the parser output.  These will cause issues.
