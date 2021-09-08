'use babel';

import * as path from 'path';

describe('The Puppet Parser provider for Linter', () => {
  const lint = require(path.join(__dirname, '../lib/main.js')).provideLinter().lint;

  beforeEach(() => {
    atom.workspace.destroyActivePaneItem();
    waitsForPromise(() => {
      atom.packages.activatePackage('linter-puppet-parsing');
      return atom.packages.activatePackage('language-puppet').then(() =>
        atom.workspace.open(path.join(__dirname, 'fixtures', 'clean.pp'))
      );
    });
  });

  describe('checks a file with multiple errors on separate lines and', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures', 'errors_line_col.pp');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds only one message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(1);
        })
      );
    });

    it('verifies the message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('error');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toEqual("Syntax error at 'ensure'");
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+errors_line_col\.pp$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[2, 2], [2, 3]]);
        });
      });
    });
  });

  describe('checks a file with two issues on one line and', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures', 'multi_errors.pp');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds both messages', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(2);
        })
      );
    });

    it('verifies the messages', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('error');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toEqual('This Variable has no effect. A value was produced and then forgotten (one or more preceding expressions may have the wrong form)');
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+multi_errors\.pp$/);
          expect(messages[0].location.position.length).toBeDefined();
          expect(messages[0].location.position).toEqual([[2, 19], [2, 20]]);
          expect(messages[1].severity).toBeDefined();
          expect(messages[1].severity).toEqual('error');
          expect(messages[1].excerpt).toBeDefined();
          expect(messages[1].excerpt).toEqual("Illegal variable name, The given name '' does not conform to the naming rule /^((::)?[a-z]\\w*)*((::)?[a-z_]\\w*)$/");
          expect(messages[1].location.file).toBeDefined();
          expect(messages[1].location.file).toMatch(/.+multi_errors\.pp$/);
          expect(messages[1].location.position).toBeDefined();
          expect(messages[1].location.position).toEqual([[2, 19], [2, 20]]);
        });
      });
    });
  });

  describe('checks a file with an issue with no line or col information and', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures', 'error_eof.pp');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds one message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(1);
        })
      );
    });

    it('verifies the only message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('error');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toEqual("Syntax error at end of input.");
          expect(messages[0].location.position.length).toBeDefined();
          expect(messages[0].location.position).toEqual([[3, 0], [3, 1]]);
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+error_eof\.pp$/);
        });
      });
    });
  });

  describe('checks a file with warnings and', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures', 'warnings.pp');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds both messages', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(2);
        })
      );
    });

    it('verifies the messages', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('warning');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toEqual("Unrecognized escape sequence '\\['");
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+warnings\.pp$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[1, 37], [1, 38]]);
          expect(messages[1].severity).toBeDefined();
          expect(messages[1].severity).toEqual('warning');
          expect(messages[1].excerpt).toBeDefined();
          expect(messages[1].excerpt).toEqual("Unrecognized escape sequence '\\]'");
          expect(messages[1].location.file).toBeDefined();
          expect(messages[1].location.file).toMatch(/.+warnings\.pp$/);
          expect(messages[1].location.position).toBeDefined();
          expect(messages[1].location.position).toEqual([[1, 37], [1, 38]]);
        });
      });
    });
  });

  describe('checks a file with warnings on multiple lines and', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures', 'multi_warnings.pp');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds both messages', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(2);
        })
      );
    });

    it('verifies the messages', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('warning');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toEqual("The key '/etc/foo' is declared more than once");
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+multi_warnings\.pp$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[1, 25], [1, 26]]);
          expect(messages[1].severity).toBeDefined();
          expect(messages[1].severity).toEqual('warning');
          expect(messages[1].excerpt).toBeDefined();
          expect(messages[1].excerpt).toEqual("The key '/etc/foo' is declared more than once");
          expect(messages[1].location.file).toBeDefined();
          expect(messages[1].location.file).toMatch(/.+multi_warnings\.pp$/);
          expect(messages[1].location.position).toBeDefined();
          expect(messages[1].location.position).toEqual([[2, 25], [2, 26]]);
        });
      });
    });
  });

  it('finds nothing wrong with a valid file', () => {
    waitsForPromise(() => {
      const goodFile = path.join(__dirname, 'fixtures', 'clean.pp');
      return atom.workspace.open(goodFile).then(editor =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(0);
        })
      );
    });
  });
});
