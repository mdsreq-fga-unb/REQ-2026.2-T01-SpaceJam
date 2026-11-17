const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const code = fs.readFileSync(path.join(__dirname, '../docs/javascripts/sj-navigation.js'), 'utf8');

function navigation(parent, contextual) {
  const attributes = {};
  const classes = new Set();
  const link = { href: 'https://example.org/project/' + (parent || 'requisitos/'),
    classList: { add: value => classes.add(value) },
    setAttribute: (key, value) => { attributes[key] = value; } };
  const document = {
    querySelector: selector => selector === 'a[data-sj-nav-parent]' && parent ? { href: link.href }
      : selector === '.sj-context-return' && contextual ? {} : null,
    querySelectorAll: selector => selector === '.md-sidebar--primary a.md-nav__link' ? [link] : [],
  };
  vm.runInNewContext(code, { document, location: { href: parent
    ? 'https://example.org/project/atas/encontro/' : 'https://example.org/project/regras_negocio/' },
    URL, window: { matchMedia: () => ({ matches: true }) } });
  return { classes, attributes };
}

test('atas destacam Reuniões como página de origem', () => {
  const result = navigation('reunioes/', false);
  assert.ok(result.classes.has('md-nav__link--active'));
  assert.equal(result.attributes['aria-current'], 'location');
});

test('consultas contextuais mantêm o retorno ao catálogo', () => {
  const result = navigation(null, true);
  assert.ok(result.classes.has('md-nav__link--active'));
});

test('páginas sem referência não ativam outra seção', () => {
  assert.equal(navigation(null, false).classes.size, 0);
});
