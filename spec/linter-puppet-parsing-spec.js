'use babel';

import * as path from 'path';

describe('The Puppet Parser provider for Linter', () => {
  const lint = require(path.join('..', 'lib', 'main.js')).provideLinter().lint;

  beforeEach(() => {
    atom.workspace.destroyActivePaneItem();
    waitsForPromise(() => {
      atom.packages.activatePackage('linter-puppet-parsing');
      return atom.packages.activatePackage('language-puppet').then(() =>
        atom.workspace.open(path.join(__dirname, 'fixtures', 'test_two.pp'))
      );
    });
  });

  describe('checks a file with one issue and', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures', 'test.pp');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds at least one message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toBeGreaterThan(0);
        })
      );
    });

    it('verifies the first message', () => {
      waitsForPromise(() => {
        const messageText = "Syntax error at 'ensure'";
        return lint(editor).then(messages => {
          expect(messages[0].type).toBeDefined();
          expect(messages[0].type).toEqual('Error');
          expect(messages[0].text).toBeDefined();
          expect(messages[0].text).toEqual(messageText);
          expect(messages[0].filePath).toBeDefined();
          expect(messages[0].filePath).toMatch(/.+test\.pp$/);
          expect(messages[0].range).toBeDefined();
          expect(messages[0].range.length).toBeDefined();
          expect(messages[0].range.length).toEqual(2);
          expect(messages[0].range).toEqual([[0, 0], [0, 32]]);
        });
      });
    });
  });

  describe('checks a file with two issues and', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures', 'test_three.pp');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds more than one message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toBeGreaterThan(1);
        })
      );
    });

    it('verifies the first message', () => {
      waitsForPromise(() => {
        const messageTextOne = 'This Variable has no effect. A value was produced and then forgotten (one or more preceding expressions may have the wrong form)';
        const messageTextTwo = "Illegal variable name, The given name '' does not conform to the naming rule /^((::)?[a-z]\w*)*((::)?[a-z_]\w*)$/"
        return lint(editor).then(messages => {
          expect(messages[0].type).toBeDefined();
          expect(messages[0].type).toEqual('Error');
          expect(messages[0].text).toBeDefined();
          expect(messages[0].text).toEqual(messageText);
          expect(messages[0].filePath).toBeDefined();
          expect(messages[0].filePath).toMatch(/.+test_three\.pp$/);
          expect(messages[0].range).toBeDefined();
          expect(messages[0].range.length).toBeDefined();
          expect(messages[0].range.length).toEqual(2);
          expect(messages[0].range).toEqual([[0, 0], [0, 32]]);
          expect(messages[1].type).toBeDefined();
          expect(messages[1].type).toEqual('Error');
          expect(messages[1].text).toBeDefined();
          expect(messages[1].text).toEqual(messageText);
          expect(messages[1].filePath).toBeDefined();
          expect(messages[1].filePath).toMatch(/.+test_three\.pp$/);
          expect(messages[1].range).toBeDefined();
          expect(messages[1].range.length).toBeDefined();
          expect(messages[1].range.length).toEqual(2);
          expect(messages[1].range).toEqual([[0, 0], [0, 32]]);
        });
      });
    });
  });

  it('finds nothing wrong with a valid file', () => {
    waitsForPromise(() => {
      const goodFile = path.join(__dirname, 'fixtures', 'test_two.pp');
      return atom.workspace.open(goodFile).then(editor =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(0);
        })
      );
    });
  });
});
