"""Renderiza consultas relacionadas a partir dos registros mantidos em docs/."""
from pathlib import Path
from html.parser import HTMLParser
import html
import logging
import re

log = logging.getLogger('mkdocs.plugins.catalog_context')

REFERENCES = {
    'requisitos_nao_funcionais.md': 'requisitos_nao_funcionais',
    'regras_negocio.md': 'regras_negocio',
    'criterios_aceitacao.md': 'criterios_aceitacao',
}
HEADING = re.compile(r'^## (.+?) \{#((?:rnf\d+|rn\d+|ca-[\w-]+))\}\s*$', re.M)
CLASSIFICATION_COLORS = {
    'Usabilidade': 'usabilidade',
    'Confiabilidade': 'confiabilidade',
    'Segurança': 'seguranca',
    'Desempenho': 'desempenho',
    'Suportabilidade': 'suportabilidade',
    'Requisitos de Implementação': 'implementacao',
}


def records(markdown):
    headings = list(HEADING.finditer(markdown))
    return {m[2]: (m[1], markdown[m.end():headings[i+1].start() if i+1<len(headings) else len(markdown)].strip())
            for i,m in enumerate(headings)}


def render_catalog(markdown, docs_dir):
    docs_dir = Path(docs_dir)
    criteria = records((docs_dir/'criterios_aceitacao.md').read_text(encoding='utf-8'))
    missing = []
    def include(match):
        key,label = match[1],match[2]
        if key not in criteria:
            # Critério ainda não cadastrado em criterios_aceitacao.md: avisa no build em vez de interromper.
            missing.append(key)
            return '<p class="sj-record-note">Critérios de aceitação de '+html.escape(label)+' a definir.</p>'
        _,body = criteria[key]
        # O endereço canônico fica na consulta por história. A ficha é uma visualização.
        body = re.sub(r'\s+id="[^"]+"','',body)
        body = re.sub(r'^Histórias abrangidas:.*?\n','',body,flags=re.M)
        return ('<details class="sj-inline-criteria"><summary>Ver critérios · '+label+'</summary>'
                '<div class="sj-inline-criteria-body">'+body+
                '<p class="sj-source-link"><a href="../criterios_aceitacao/#'+key+'">Abrir registro por história</a></p>'
                '</div></details>')
    criteria_link = r'<a href="\.\./criterios_aceitacao/#([\w-]+)">([^<]+)</a>'
    def paragraph(match):
        if '../criterios_aceitacao/#' not in match[1]:return match[0]
        return match[1].replace(' · ','')
    markdown = re.sub(r'<p>(.*?)</p>',paragraph,markdown,flags=re.S)
    markdown = re.sub(criteria_link,include,markdown)
    if missing:
        log.warning('Critérios sem registro em criterios_aceitacao.md (%d): %s',
                    len(set(missing)), ', '.join(sorted(set(missing))))
    # Os nomes das condições acompanham a declaração, sem outra lista de títulos.
    for filename,route in list(REFERENCES.items())[:2]:
        if '../'+route+'/#' not in markdown:continue
        titles = records((docs_dir/filename).read_text(encoding='utf-8'))
        def name_link(match):
            key = match[1]
            if key not in titles:raise ValueError('Condição sem registro: '+key)
            title = titles[key][0]
            return '<a class="sj-condition-link" href="../'+route+'/#'+key+'">'+html.escape(title)+'</a>'
        markdown=re.sub(r'<a href="\.\./'+route+r'/#([\w-]+)">[^<]+</a>',name_link,markdown)
    return markdown


def related_requirements(catalog, route, key):
    class Relations(HTMLParser):
        def __init__(self):
            super().__init__();self.depth=0;self.code=None;self.name=[];self.in_name=False;self.found=False;self.items=[]
        def handle_starttag(self,tag,attrs):
            a=dict(attrs)
            if tag=='details':
                if not self.depth and a.get('class')=='sj-requirement':
                    self.code=a['id'];self.name=[];self.found=False;self.depth=1
                elif self.depth:self.depth+=1
            if not self.depth:return
            if tag=='span' and a.get('class')=='sj-requirement-name':self.in_name=True
            if tag=='a' and a.get('href')=='../'+route+'/#'+key:self.found=True
        def handle_data(self,data):
            if self.in_name:self.name.append(data)
        def handle_endtag(self,tag):
            if tag=='span':self.in_name=False
            if tag=='details' and self.depth:
                self.depth-=1
                if not self.depth and self.found:self.items.append((self.code,''.join(self.name)))
    relations=Relations();relations.feed(catalog)
    links=['<a href="../requisitos/#'+code+'">'+code.upper()+' · '+html.escape(name)+'</a>' for code,name in relations.items]
    if not links:
        return '<p class="sj-record-note">Nenhum vínculo específico registrado nas fichas. Conferir a aplicação durante a revisão do escopo.</p>'
    return '<details class="sj-related-requirements"><summary>Requisitos relacionados · '+str(len(links))+'</summary><div>'+''.join(links)+'</div></details>'


RNF_LABELS = ('Categoria', 'MVP', 'Descrição', 'Origem e perfis',
              'Regras de negócio associadas', 'Decisão de projeto (Justificativa técnica)',
              'Verificação e validação', 'Checklist estruturado')
RNF_FIELD = re.compile(r'^\*\*([^:*]+):\*\*[ \t]?(.*)$')


def rnf_record(body):
    fields = {}
    current = None
    for line in body.splitlines():
        match = RNF_FIELD.match(line)
        label = match[1].strip() if match else None
        if label in RNF_LABELS:
            current = label
            fields[current] = [match[2].strip()] if match[2].strip() else []
        elif current is not None:
            fields[current].append(line)
    if 'Descrição' not in fields:
        return None
    return {label: '\n'.join(lines).strip() for label, lines in fields.items()}


def md_href(url):
    match = re.match(r'^([\w-]+)\.md(?:#(.+))?$', url.strip())
    if not match:
        return url.strip()
    href = '../' + match[1] + '/'
    if match[2]:
        href += '#' + match[2]
    return href


def md_inline(text):
    text = html.escape(text, quote=False)
    text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)
    text = re.sub(r'`([^`]+)`', r'<code>\1</code>', text)
    return re.sub(r'\[([^\]]+)\]\(([^)]+)\)', lambda m: '<a href="'+md_href(m[2])+'">'+m[1]+'</a>', text)


def md_list(text):
    return [line[2:].strip() for line in text.splitlines() if line.strip().startswith('- ')]


def md_checklist(text):
    items = []
    for line in text.splitlines():
        item = line.strip()
        if item.startswith('- [ ]') or item.startswith('- [x]') or item.startswith('- [X]'):
            items.append(item[5:].strip())
    return items


def render_rnf_record(title, key, fields, catalog='', route=''):
    code, _, name = title.partition(' · ')
    tags = []
    if fields.get('Categoria', '').strip():
        category = fields['Categoria'].strip()
        primary = category.split(' / ', 1)[0].split(' (', 1)[0]
        color = CLASSIFICATION_COLORS.get(primary, 'neutra')
        tags.append('<span class="sj-tag sj-classification sj-class-' + color + '">'
                    + html.escape(category) + '</span>')
    if fields.get('MVP', '').strip():
        tags.append('<span class="sj-tag sj-tag-mvp">MVP: ' + html.escape(fields['MVP'].strip()) + '</span>')
    blocks = ['<div class="sj-record-full"><p class="sj-record-label">Descrição</p><p>'
              + md_inline(fields.get('Descrição', '')) + '</p></div>']
    if fields.get('Origem e perfis', '').strip():
        profiles = md_list(fields['Origem e perfis'])
        if profiles:
            blocks.append('<div><p class="sj-record-label">Origem e perfis</p><ul class="sj-rnf-perfis">'
                          + ''.join('<li>' + md_inline(item) + '</li>' for item in profiles) + '</ul></div>')
        else:
            blocks.append('<div><p class="sj-record-label">Origem e perfis</p><p>'
                          + md_inline(fields['Origem e perfis']) + '</p></div>')
    rules = md_list(fields.get('Regras de negócio associadas', ''))
    if rules:
        blocks.append('<div><p class="sj-record-label">Regras de negócio associadas</p><ul class="sj-rnf-relacionadas">'
                      + ''.join('<li>' + md_inline(item) + '</li>' for item in rules) + '</ul></div>')
    decisions = md_list(fields.get('Decisão de projeto (Justificativa técnica)', ''))
    if decisions:
        blocks.append('<div class="sj-record-full"><p class="sj-record-label">Decisão de projeto (Justificativa técnica)</p><ul>'
                      + ''.join('<li>' + md_inline(item) + '</li>' for item in decisions) + '</ul></div>')
    checks = md_list(fields.get('Verificação e validação', ''))
    if checks:
        blocks.append('<div class="sj-record-full"><p class="sj-record-label">Verificação e validação</p><ul>'
                      + ''.join('<li>' + md_inline(item) + '</li>' for item in checks) + '</ul></div>')
    checklist = md_checklist(fields.get('Checklist estruturado', ''))
    if checklist:
        blocks.append('<div class="sj-record-full"><p class="sj-record-label">Checklist estruturado (critérios de inspeção)</p>'
                      '<ul class="sj-rnf-checklist">'
                      + ''.join('<li>' + md_inline(item) + '</li>' for item in checklist) + '</ul></div>')
    footer = related_requirements(catalog, route, key) if route else ''
    return ('<details class="sj-requirement sj-rnf" id="' + key + '">\n'
            '<summary><span class="sj-requirement-id">' + html.escape(code) + '</span>'
            '<span class="sj-requirement-name">' + html.escape(name or title) + '</span>'
            '<span class="sj-requirement-tags">' + ''.join(tags) + '</span></summary>\n'
            '<div class="sj-requirement-body">\n' + ''.join(blocks) + '\n</div>\n'
            + footer + '</details>\n\n')


def render_reference(markdown, route, catalog):
    def render(title,key,body):
        body=body.strip()
        if key.startswith('rnf'):
            fields=rnf_record(body)
            if fields is not None:
                return render_rnf_record(title,key,fields,catalog,route)
        if key.startswith('ca-'):
            code,_,name=title.partition(' — ')
            stories=re.findall(r'US\d+[ab]?',code)
            code=stories[0] if len(stories)==1 else str(len(stories))+' histórias'
        else:
            code,_,name=title.partition(' · ')
        related=related_requirements(catalog,route,key)
        return ('<details class="sj-reference" id="'+key+'" markdown="1">\n'
                '<summary><span class="sj-reference-code">'+html.escape(code)+'</span>'
                '<strong>'+html.escape(name or title)+'</strong></summary>\n'
                '<div class="sj-reference-body" markdown="1">\n\n'+body+'\n\n'+related+
                '\n\n</div>\n</details>\n\n')
    # Delimitação pelos cabeçalhos canônicos; não depende dos rótulos apresentados.
    starts=list(HEADING.finditer(markdown))
    if not starts:return markdown
    prefix=markdown[:starts[0].start()]
    chunks=[]
    for i,m in enumerate(starts):
        body=markdown[m.end():starts[i+1].start() if i+1<len(starts) else len(markdown)]
        chunks.append(render(m[1],m[2],body))
    return prefix+''.join(chunks)


def on_page_markdown(markdown, page, config, **kwargs):
    name=page.file.src_uri
    docs_dir=Path(config['docs_dir'])
    if name=='requisitos.md':return render_catalog(markdown,docs_dir)
    if name in REFERENCES:
        catalog=render_catalog((docs_dir/'requisitos.md').read_text(encoding='utf-8'),docs_dir)
        result=render_reference(markdown,REFERENCES[name],catalog)
        return result.replace('\n', '\n<nav class="sj-context-return" aria-label="Retomar consulta" hidden></nav>\n',1)
    return markdown
