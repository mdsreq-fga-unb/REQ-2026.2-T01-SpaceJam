import { useCallback, useEffect, useState } from 'react'
import { api } from '../../api/client'

/** Resposta pública de `GET /auth/termos/vigentes/` (US63, RN15). */
interface RespostaTermosVigentes {
  versao: string
  termos_uso_url: string | null
  politica_privacidade_url: string | null
  disponivel: boolean
}

export interface DocumentosTermos {
  versao: string
  termos: string
  privacidade: string
}

// Só aceita http(s):// ou caminho da própria aplicação ("/..."), nunca "//host" ou "javascript:".
const urlSegura = (url: string | null): url is string => !!url && /^(https?:\/\/|\/(?!\/))/.test(url)

function paraDocumentos(resposta: RespostaTermosVigentes): DocumentosTermos | null {
  const { disponivel, versao, termos_uso_url, politica_privacidade_url } = resposta
  return disponivel && versao && urlSegura(termos_uso_url) && urlSegura(politica_privacidade_url)
    ? { versao, termos: termos_uso_url, privacidade: politica_privacidade_url }
    : null
}

/**
 * Fonte única dos documentos vigentes para o cadastro e para a renovação do aceite.
 * Falhas de rede são tratadas como "indisponível": o aceite nunca é oferecido sem documentos.
 */
export function useTermosVigentes() {
  const [documentos, setDocumentos] = useState<DocumentosTermos | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [consulta, setConsulta] = useState(0)

  useEffect(() => {
    let ativa = true
    api<RespostaTermosVigentes>('/auth/termos/vigentes/', {}, false)
      .then(resposta => { if (ativa) setDocumentos(paraDocumentos(resposta)) })
      .catch(() => { if (ativa) setDocumentos(null) })
      .finally(() => { if (ativa) setCarregando(false) })
    return () => { ativa = false }
  }, [consulta])

  const recarregar = useCallback(() => {
    setCarregando(true)
    setConsulta(atual => atual + 1)
  }, [])

  return { documentos, carregando, recarregar }
}
