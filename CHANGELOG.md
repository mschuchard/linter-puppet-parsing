### 1.2.0
- Updates to Linter API usage.
- Remove arbitrary Puppet parser arguments from config options.
- Parse validator JSON output when possible.
- Capture all relevant messages from parser output.

### 1.1.3
- Display error marker at last line of file for EOF errors.

### 1.1.2
- Drop support for Puppet 3.
- Ensure support for Puppet 6.
- Updated `atom-linter` dependency.

### 1.1.1
- Capture line/col messages for new Puppet >= 5.4 parser validator output.
- Capture eof messages for new Puppet >= 5.5 parser validator output.

### 1.1.0
- Switched to using Linter v2 API.
- Removed `atom-package-deps` dependency and functionality.

### 1.0.5
- Removed range 1 where unnecessary.
- Fixed support for legacy Puppet parser not displaying column information.

### 1.0.4
- Updated `atom-linter` dependency.
- Added severity key.

### 1.0.3
- Updated `atom-linter` dependencies.
- Fixed issue where column of error was not being captured and displayed for `Puppet >= 4`.
- Adding support for unusual 'syntax error at end of file' error message.
- Now differentiating between errors and warnings.
- Very slight code optimization.

### 1.0.2
- Minor code cleanup and optimization.
- Updated `atom-linter` dependencies.
- Fixed issue with different output style of Puppet 4 parser for some types of errors not matching regexp.

### 1.0.1
- Minor improvements to code efficiency and layout.
- Minor improvements to documentation.

### 1.0.0
- Initial version ready for wide usage.
