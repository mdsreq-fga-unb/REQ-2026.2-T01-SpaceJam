"""RNF13 / RNF06 — Duração real do vídeo, lida no cabeçalho do próprio arquivo.

MP4 e MOV usam a mesma estrutura (ISO BMFF / QuickTime): uma sequência de "caixas"
(`tamanho` de 4 bytes + `tipo` de 4 letras). A duração fica em `moov/mvhd`, como
`duracao / escala_de_tempo`. Para achá-la basta ler os cabeçalhos das caixas do topo
(16 bytes cada) e o conteúdo de `moov` (alguns KB), pulando `mdat`, que é o vídeo em
si. Assim o servidor confere a duração sem baixar nem decodificar o arquivo.

Um arquivo que não tem essa estrutura (ex.: um .avi renomeado para .mp4) é recusado.

`leitor(inicio, tamanho) -> bytes` é quem busca os bytes (no Storage, por Range HTTP);
este módulo não sabe de rede, o que permite testá-lo com bytes montados à mão.
"""

# Caixas que podem abrir um MP4/MOV válido. Qualquer outra coisa no byte 0 = não é MP4/MOV.
CAIXAS_INICIAIS = {b"ftyp", b"moov", b"mdat", b"free", b"skip", b"wide", b"pnot"}
# Um `moov` de 60 s ocupa poucos KB; acima disso o arquivo é tratado como inválido.
LIMITE_MOOV = 8 * 1024 * 1024
# Teto de caixas percorridas no topo, contra arquivos montados para travar a leitura.
LIMITE_CAIXAS = 512
DURACAO_DESCONHECIDA = {0xFFFFFFFF, 0xFFFFFFFFFFFFFFFF}


class ArquivoIlegivel(Exception):
    """O arquivo não é um MP4/MOV legível ou não informa a duração."""


def _tipo_valido(tipo: bytes) -> bool:
    return len(tipo) == 4 and all(32 <= b < 127 for b in tipo)


def _caixas(dados: bytes):
    """Percorre as caixas filhas de um trecho já em memória (conteúdo do moov)."""
    posicao = 0
    while posicao + 8 <= len(dados):
        tamanho = int.from_bytes(dados[posicao:posicao + 4], "big")
        tipo = dados[posicao + 4:posicao + 8]
        cabecalho = 8
        if tamanho == 1:
            if posicao + 16 > len(dados):
                raise ArquivoIlegivel("Caixa truncada.")
            tamanho = int.from_bytes(dados[posicao + 8:posicao + 16], "big")
            cabecalho = 16
        elif tamanho == 0:
            tamanho = len(dados) - posicao
        if tamanho < cabecalho or posicao + tamanho > len(dados):
            raise ArquivoIlegivel("Caixa com tamanho inválido.")
        yield tipo, dados[posicao + cabecalho:posicao + tamanho]
        posicao += tamanho


def _ler_mvhd(corpo: bytes):
    """Devolve (escala_de_tempo, duracao) do cabeçalho do filme."""
    if not corpo:
        raise ArquivoIlegivel("mvhd vazio.")
    versao = corpo[0]
    if versao == 1:
        if len(corpo) < 32:
            raise ArquivoIlegivel("mvhd truncado.")
        escala = int.from_bytes(corpo[20:24], "big")
        duracao = int.from_bytes(corpo[24:32], "big")
    else:
        if len(corpo) < 20:
            raise ArquivoIlegivel("mvhd truncado.")
        escala = int.from_bytes(corpo[12:16], "big")
        duracao = int.from_bytes(corpo[16:20], "big")
    if duracao in DURACAO_DESCONHECIDA:
        duracao = 0
    return escala, duracao


def _ler_mehd(mvex: bytes) -> int:
    """MP4 fragmentado: a duração total fica em moov/mvex/mehd."""
    for tipo, corpo in _caixas(mvex):
        if tipo == b"mehd" and corpo:
            if corpo[0] == 1 and len(corpo) >= 12:
                return int.from_bytes(corpo[4:12], "big")
            if len(corpo) >= 8:
                return int.from_bytes(corpo[4:8], "big")
    return 0


def duracao_do_moov(moov: bytes) -> float:
    escala = duracao = None
    duracao_fragmentos = 0
    for tipo, corpo in _caixas(moov):
        if tipo == b"mvhd":
            escala, duracao = _ler_mvhd(corpo)
        elif tipo == b"mvex":
            duracao_fragmentos = _ler_mehd(corpo)
    if not escala:
        raise ArquivoIlegivel("Sem escala de tempo.")
    duracao = duracao or duracao_fragmentos
    if not duracao:
        raise ArquivoIlegivel("O arquivo não informa a duração.")
    return duracao / escala


def ler_duracao(leitor, tamanho_total: int) -> float:
    """Duração em segundos (com casas decimais) de um MP4/MOV de `tamanho_total` bytes."""
    posicao = 0
    for indice in range(LIMITE_CAIXAS):
        if posicao + 8 > tamanho_total:
            break
        cabecalho = leitor(posicao, min(16, tamanho_total - posicao))
        tamanho = int.from_bytes(cabecalho[0:4], "big")
        tipo = cabecalho[4:8]
        if not _tipo_valido(tipo) or (indice == 0 and tipo not in CAIXAS_INICIAIS):
            raise ArquivoIlegivel("O arquivo não é um MP4/MOV.")
        tamanho_cabecalho = 8
        if tamanho == 1:
            if len(cabecalho) < 16:
                raise ArquivoIlegivel("Caixa truncada.")
            tamanho = int.from_bytes(cabecalho[8:16], "big")
            tamanho_cabecalho = 16
        elif tamanho == 0:
            tamanho = tamanho_total - posicao
        if tamanho < tamanho_cabecalho or posicao + tamanho > tamanho_total:
            raise ArquivoIlegivel("Arquivo truncado ou corrompido.")

        if tipo == b"moov":
            corpo = tamanho - tamanho_cabecalho
            if corpo > LIMITE_MOOV:
                raise ArquivoIlegivel("Cabeçalho do vídeo grande demais.")
            return duracao_do_moov(leitor(posicao + tamanho_cabecalho, corpo))
        posicao += tamanho
    raise ArquivoIlegivel("O arquivo não tem o cabeçalho do vídeo (moov).")
