/* Hiperlinks são acessos aos registros existentes, sem seleção paralela. */
(() => {
  function mvpLinks(records) {
    return records.filter((record) => record.inMvp).map((record) => ({
      href: '#' + record.id,
      label: record.id.toUpperCase() + ' · ' + record.name
    }));
  }

  function targetId(hash) {
    try { return decodeURIComponent(hash.replace(/^#/, '')) || null; }
    catch { return null; }
  }

  function referenceHref(href, origin) {
    if (!/^rf\d+$/.test(origin) || !/^\.\.\/(regras_negocio|requisitos_nao_funcionais|criterios_aceitacao)\/#[-\w]+$/.test(href)) return href;
    return href.replace('/#', '/?origem=' + origin + '#');
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = {mvpLinks, targetId, referenceHref};
  if (typeof document === 'undefined') return;

  const attachOrigin = (root, origin) => {
    root.querySelectorAll('a[href]').forEach((anchor) => {
      anchor.setAttribute('href', referenceHref(anchor.getAttribute('href'), origin));
    });
  };
  document.querySelectorAll('details.sj-requirement').forEach((record) => attachOrigin(record, record.id));
  const origin = new URLSearchParams(location.search).get('origem');
  const context = document.querySelector('.sj-context-return');
  if (context && /^rf\d+$/.test(origin || '')) {
    const source = [...document.querySelectorAll('.sj-related-requirements a')]
      .find((anchor) => anchor.getAttribute('href') === '../requisitos/#' + origin);
    if (source) {
      const back = document.createElement('a');
      back.href = source.getAttribute('href');
      back.textContent = 'Voltar a ' + source.textContent.trim();
      context.append(back);
      context.hidden = false;
      attachOrigin(document.querySelector('article'), origin);
    }
  }

  const index = document.getElementById('sj-mvp-links');
  if (index) {
    const records = [...document.querySelectorAll('details.sj-requirement')].map((element) => ({
      id: element.id,
      name: element.querySelector('.sj-requirement-name').textContent.trim(),
      inMvp: Boolean(element.querySelector('.sj-tag-mvp'))
    }));
    for (const item of mvpLinks(records)) {
      const anchor = document.createElement('a');
      anchor.href = item.href;
      anchor.textContent = item.label;
      index.append(anchor);
    }
    index.hidden = false;
  }

  function revealTarget() {
    const id = targetId(location.hash);
    const target = id && document.getElementById(id);
    if (!target) return;
    let detail = target.closest('details');
    if (!detail) return;
    while (detail) {
      detail.open = true;
      detail = detail.parentElement?.closest('details');
    }
    const referenceBody = target.closest('.sj-reference')?.querySelector('.sj-reference-body');
    if (referenceBody && context && !context.hidden) referenceBody.prepend(context);
    target.scrollIntoView({block:'start', behavior:'instant'});
  }
  addEventListener('hashchange', revealTarget);
  revealTarget();
})();
