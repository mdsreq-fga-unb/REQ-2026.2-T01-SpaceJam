
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { aoTermosPendentes, api, ApiError, TOKEN_KEY, tokenStorage } from '../api/client'
import type { Papel, Usuario } from '../types/usuario'
import { AuthContext } from './contexto'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [carregando, setCarregando] = useState(
    () => tokenStorage.get() !== null
  )
  const versaoSessao = useRef(0)
  const [avisoSessao, setAvisoSessao] = useState('')

  // US63 (CA02): termos atualizados durante a sessão levam direto à renovação do aceite.
  useEffect(() => aoTermosPendentes(versaoAtual => {
    setUsuario(atual => atual && {
      ...atual,
      termos_pendentes: true,
      versao_termos_vigente: versaoAtual ?? atual.versao_termos_vigente,
    })
  }), [])

  // Recupera uma sessão já existente.
  useEffect(() => {
    function carregarSessao() {
      const versao = ++versaoSessao.current

      setUsuario(null)
      setAvisoSessao('')

      const temToken = tokenStorage.get() !== null
      setCarregando(temToken)

      if (!temToken) return

      api<Usuario>('/auth/me/')
        .then(perfil => {
          if (versao === versaoSessao.current) {
            setUsuario(perfil)
            setAvisoSessao('')
          }
        })
        .catch((erro: unknown) => {
          if (versao !== versaoSessao.current) return

          if (erro instanceof ApiError && erro.status === 401) {
            // O servidor confirmou que a sessão é inválida.
            tokenStorage.clear()
            setAvisoSessao('Sua sessão expirou. Entre novamente.')
          } else {
            // Uma falha temporária não deve apagar o token.
            setAvisoSessao(
              'Não foi possível recuperar sua sessão. Atualize a página para tentar novamente.'
            )
          }
        })
        .finally(() => {
          if (versao === versaoSessao.current) {
            setCarregando(false)
          }
        })
    }

    function sincronizarSessao(evento: StorageEvent) {
      if (
        evento.storageArea === localStorage &&
        (evento.key === TOKEN_KEY || evento.key === null)
      ) {
        carregarSessao()
      }
    }

    carregarSessao()

    window.addEventListener('storage', sincronizarSessao)

    return () => {
      ++versaoSessao.current
      window.removeEventListener('storage', sincronizarSessao)
    }
  }, [])

  async function login(
    identificador: string,
    senha: string,
    papel: Papel = 'ALUNO'
  ) {
    const versao = ++versaoSessao.current

    setAvisoSessao('')

    const treinador = papel === 'TREINADOR'

    const { access, refresh } = await api<{
      access: string
      refresh: string
    }>(
      treinador
        ? '/auth/login/treinador/'
        : '/auth/login/aluno/',
      {
        method: 'POST',
        body: JSON.stringify(
          treinador
            ? { email: identificador, senha }
            : { apelido: identificador, senha }
        ),
      },
      false
    )

    if (versao !== versaoSessao.current) return

    tokenStorage.set(access, refresh)

    try {
      const perfil = await api<Usuario>('/auth/me/')

      if (versao === versaoSessao.current) {
        setUsuario(perfil)
      }
    } catch (erro) {
      if (versao === versaoSessao.current) {
        // Em um login novo, não mantém uma autenticação incompleta.
        tokenStorage.clear()
        setUsuario(null)
      }

      throw erro
    } finally {
      if (versao === versaoSessao.current) {
        setCarregando(false)
      }
    }
  }

  function limparSessaoLocal() {
    const versao = ++versaoSessao.current
    tokenStorage.clear()
    setUsuario(null)
    setCarregando(false)
    setAvisoSessao('')
    return versao
  }

  async function logout() {
    const access = tokenStorage.get()
    const refresh = tokenStorage.getRefresh()
    const versao = limparSessaoLocal()

    try {
      if (!access || !refresh) {
        throw new Error('Sessão sem credenciais para revogação')
      }

      await api(
        '/auth/logout/',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${access}`,
          },
          body: JSON.stringify({ refresh }),
        },
        false
      )
    } catch {
      if (versao === versaoSessao.current) {
        setAvisoSessao(
          'Você saiu deste dispositivo, mas não foi possível confirmar o encerramento no servidor.'
        )
      }
    }
  }

  async function recarregarUsuario() {
    const versao = versaoSessao.current
    const perfil = await api<Usuario>('/auth/me/')
    if (versao === versaoSessao.current) setUsuario(perfil)
  }

  async function aceitarTermos(versaoTermos: string) {
    const versao = versaoSessao.current

    const perfil = await api<Usuario>('/auth/aceitar-termos/', {
      method: 'POST',
      body: JSON.stringify({ aceite_termos: true, versao: versaoTermos }),
    })

    if (versao === versaoSessao.current) {
      setUsuario(perfil)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        carregando,
        login,
        logout,
        aceitarTermos,
        recarregarUsuario,
        limparSessaoLocal,
        avisoSessao,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
