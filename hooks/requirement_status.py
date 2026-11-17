"""Apresenta status por versão da ficha, com evidências separadas do escopo."""
from pathlib import Path
import hashlib
import json
import re

CARDS = re.compile(r'<details class="sj-requirement" id="(rf\d+)"[^>]*>.*?</div>\s*</details>', re.S)
LABELS = {'validado': 'Validado pela equipe', 'validar': 'A validar',
          'refinar': 'Em refinamento'}

def card_hash(card):
    return hashlib.sha256(card.replace('\r\n', '\n').encode('utf-8')).hexdigest()

def render_statuses(markdown, data):
    def render(match):
        code, card = match[1], match[0]
        item = data.get('requisitos', {}).get(code.upper(), {})
        status = item.get('status', 'validar')
        if status not in LABELS:
            raise ValueError('Status desconhecido: ' + code)
        evidence = item.get('evidencia') or {}
        if status == 'validado':
            if evidence.get('tipo') != 'equipe' or not all(evidence.get(k) for k in ('data', 'origem', 'registro')):
                raise ValueError('Status sem evidência identificada: ' + code)
            if item.get('sha256_ficha') != card_hash(card):
                status = 'validar'
        title = {'validado': 'Validação pela equipe; não comprova aceite do cliente ou implementação',
                 'refinar': 'Há pontos a conferir na declaração, nos critérios ou nos vínculos',
                 'validar': 'Confirmação da versão ainda pendente'}[status]
        badge = ('<span class="sj-badge sj-status-' + status + '" title="' + title + '">'
                 + LABELS[status] + '</span>')
        card = card.replace('<span class="sj-requirement-tags">', '<span class="sj-requirement-tags">' + badge, 1)
        return card
    return CARDS.sub(render, markdown)

def legend():
    descriptions = {'validado': 'Validação pela equipe, com registro identificado.',
                    'validar': 'A confirmação desta versão está pendente.',
                    'refinar': 'Há pontos a conferir na declaração, nos critérios ou nos vínculos.'}
    return ('<details class="sj-status-legend"><summary>Entenda os status dos requisitos</summary><ul>'
            + ''.join('<li><span class="sj-badge sj-status-' + key + '">' + label
                      + '</span><span>' + descriptions[key] + '</span></li>' for key, label in LABELS.items())
            + '</ul><p>Os status não indicam implementação concluída, prioridade ou seleção para o MVP. '
            'A confirmação interna não representa aceite do cliente. '
            '<a href="../arquivos/status-requisitos-2026-11-16.json">Consultar registros dos status</a>.</p></details>')

def on_page_markdown(markdown, page, config, **kwargs):
    if page.file.src_uri != 'requisitos.md':
        return markdown
    data = json.loads((Path(config['docs_dir'])/'arquivos/status-requisitos-2026-11-16.json').read_text(encoding='utf-8'))
    rendered = render_statuses(markdown, data)
    marker = '<nav id="guia-do-catalogo"'
    return rendered.replace(marker, legend() + '\n\n' + marker, 1)
