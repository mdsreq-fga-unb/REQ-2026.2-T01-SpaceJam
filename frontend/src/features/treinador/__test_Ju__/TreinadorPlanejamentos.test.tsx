
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import {
  TreinadorPlanejamentos,
  type PlanejamentoAlunoResumo,
} from '../TreinadorPlanejamentos'
import type { Usuario } from '../../../types/usuario'

const treinador: Usuario = {
  id: 1,
  apelido: 'lucas',
  first_name: 'Lucas',
  last_name: 'Treinador',
  email: 'lucas@teste.com',
  telefone: '',
  papel: 'TREINADOR',
}

const planejamentos: readonly PlanejamentoAlunoResumo[] = [
  {
    id: 1,
    nome: 'Beatriz Costa',
    descricao: 'Controle de bola · Planejamento vigente',
    alunoId: '1',
  },
  {
    id: 2,
    nome: 'André Lima',
    descricao: 'Nenhum planejamento vigente',
    alunoId: '2',
  },
]

function renderizarPagina(
  dados = planejamentos,
  demonstracao = false,
) {
  return render(
    <MemoryRouter>
      <TreinadorPlanejamentos
        treinador={treinador}
        planejamentos={dados}
        demonstracao={demonstracao}
      />
    </MemoryRouter>,
  )
}

describe('TreinadorPlanejamentos', () => {
  describe('Estrutura da página', () => {
    it('deve exibir o título Planejamentos', () => {
      renderizarPagina()

      expect(
        screen.getByRole('heading', { name: 'Planejamentos' }),
      ).toBeInTheDocument()
    })

    it('deve exibir a orientação para escolher um aluno', () => {
      renderizarPagina()

      expect(
        screen.getByText('Escolha um aluno da sua carteira.'),
      ).toBeInTheDocument()
    })

    it('deve exibir o nome do treinador', () => {
      renderizarPagina()

      expect(screen.getAllByText('Lucas').length).toBeGreaterThan(0)
    })

    it('deve identificar o usuário como treinador', () => {
      renderizarPagina()

      expect(screen.getAllByText('Treinador').length).toBeGreaterThan(0)
    })

    it('deve exibir a marca Space Jam', () => {
      renderizarPagina()

      expect(screen.getAllByText('SPACE JAM').length).toBeGreaterThan(0)
    })
  })

  describe('Lista de planejamentos', () => {
    it('deve exibir os alunos que possuem dados na lista', () => {
      renderizarPagina()

      expect(screen.getByText('Beatriz Costa')).toBeInTheDocument()
      expect(screen.getByText('André Lima')).toBeInTheDocument()
    })

    it('deve exibir a descrição de cada planejamento', () => {
      renderizarPagina()

      expect(
        screen.getByText('Controle de bola · Planejamento vigente'),
      ).toBeInTheDocument()

      expect(
        screen.getByText('Nenhum planejamento vigente'),
      ).toBeInTheDocument()
    })

    it('deve direcionar cada aluno para sua página de consulta', () => {
      renderizarPagina()

      const linkBeatriz = screen.getByRole('link', {
        name: /Beatriz Costa/,
      })

      const linkAndre = screen.getByRole('link', {
        name: /André Lima/,
      })

      expect(linkBeatriz).toHaveAttribute(
        'href',
        '/treinador/alunos/1',
      )

      expect(linkAndre).toHaveAttribute(
        'href',
        '/treinador/alunos/2',
      )
    })

    it('deve exibir a mensagem quando não existem planejamentos', () => {
      renderizarPagina([])

      expect(
        screen.getByRole('heading', {
          name: 'Planejamentos indisponíveis',
        }),
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          'Os planejamentos dos alunos ainda não estão disponíveis para consulta.',
        ),
      ).toBeInTheDocument()
    })

    it('não deve exibir a lista quando não existem planejamentos', () => {
      renderizarPagina([])

      expect(
        screen.queryByRole('region', {
          name: 'Planejamentos por aluno',
        }),
      ).not.toBeInTheDocument()
    })
  })

  describe('Modo de demonstração', () => {
    it('deve exibir o aviso quando estiver em modo de demonstração', () => {
      renderizarPagina(planejamentos, true)

      expect(
        screen.getByText(/Prévia visual com dados fictícios do Figma/),
      ).toBeInTheDocument()
    })

    it('não deve exibir o aviso fora do modo de demonstração', () => {
      renderizarPagina()

      expect(
        screen.queryByText(/Prévia visual com dados fictícios do Figma/),
      ).not.toBeInTheDocument()
    })
  })

  describe('Botão Novo planejamento', () => {
    it('deve exibir o link Novo planejamento', () => {
      renderizarPagina()

      expect(
        screen.getByRole('link', { name: 'Novo planejamento' }),
      ).toBeInTheDocument()
    })

    it('deve direcionar para o formulário na rota de demonstração', () => {
      renderizarPagina(planejamentos, true)

      expect(
        screen.getByRole('link', { name: 'Novo planejamento' }),
      ).toHaveAttribute(
        'href',
        '/teste/treinador/novo-planejamento',
      )
    })

    it('deve direcionar para o formulário na rota normal', () => {
      renderizarPagina()

      expect(
        screen.getByRole('link', { name: 'Novo planejamento' }),
      ).toHaveAttribute(
        'href',
        '/treinador/novo-planejamento',
      )
    })
  })

  describe('Navegação', () => {
    it('deve exibir os links do menu do treinador', () => {
      renderizarPagina()

      const menu = screen.getByRole('navigation', {
        name: 'Menu do treinador',
      })

      expect(
        within(menu).getByRole('link', { name: 'Alunos' }),
      ).toHaveAttribute('href', '/treinador/alunos')

      expect(
        within(menu).getByRole('link', { name: 'Treinos' }),
      ).toHaveAttribute('href', '/treinador/planejamentos')

      expect(
        within(menu).getByRole('link', { name: 'Biblioteca' }),
      ).toHaveAttribute('href', '/exercicios')

      expect(
        within(menu).getByRole('link', { name: 'Conta' }),
      ).toHaveAttribute('href', '/')
    })

    it('deve destacar Treinos como seção atual no menu lateral', () => {
      renderizarPagina()

      const menu = screen.getByRole('navigation', {
        name: 'Menu do treinador',
      })

      expect(
        within(menu).getByRole('link', { name: 'Treinos' }),
      ).toHaveAttribute('aria-current', 'page')
    })

    it('deve exibir a navegação mobile', () => {
      renderizarPagina()

      expect(
        screen.getByRole('navigation', {
          name: 'Seções do treinador',
        }),
      ).toBeInTheDocument()
    })
  })

  describe('Acessibilidade', () => {
    it('deve possuir link para pular diretamente ao conteúdo principal', () => {
      renderizarPagina()

      const link = screen.getByRole('link', {
        name: 'Pular para o conteúdo principal',
      })

      expect(link).toHaveAttribute(
        'href',
        '#sj-planejamentos-conteudo',
      )
    })

    it('deve possuir uma área principal identificada', () => {
      renderizarPagina()

      expect(
        screen.getByRole('main'),
      ).toHaveAttribute('id', 'sj-planejamentos-conteudo')
    })
  })
})
