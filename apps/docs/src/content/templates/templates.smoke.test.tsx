// Teste de fumaça DESCARTÁVEL dos modelos — apagar depois de rodar.
import { OrangeProvider } from '@orange/ui'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expectNoA11yViolations } from '@ui-test/axe'
import axe from 'axe-core'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { LangProvider, type Lang } from '../../i18n'
import Dashboard from './dashboard/Dashboard'
import DashboardPage from './dashboard'
import Settings from './settings/Settings'
import SettingsPage from './settings'
import SignIn from './sign-in/SignIn'
import SignInPage from './sign-in'

function Shell({ children, lang = 'pt', url = '/pt/templates/x' }: { children: ReactNode; lang?: Lang; url?: string }) {
  return (
    <MemoryRouter initialEntries={[url]}>
      <OrangeProvider locale={lang === 'pt' ? 'pt-BR' : 'en-US'}>
        <LangProvider lang={lang}>
          {/* Como na documentação: o modelo vive dentro do <main> da página. */}
          <main>{children}</main>
        </LangProvider>
      </OrangeProvider>
    </MemoryRouter>
  )
}

const realMatchMedia = window.matchMedia
function wideScreen(on: boolean) {
  window.matchMedia = on
    ? (query: string) =>
        ({
          matches: /min-width/.test(query),
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        }) as MediaQueryList
    : realMatchMedia
}

function expectNoExtraLandmarks(container: HTMLElement) {
  expect(container.querySelectorAll('main')).toHaveLength(1)
  expect(container.querySelectorAll('h1')).toHaveLength(0)
}

describe.each([
  ['compacto', false],
  ['largo', true],
])('modelos (%s)', (_label, wide) => {
  beforeEach(() => wideScreen(wide))
  afterEach(() => wideScreen(false))

  it('Entrar: renderiza, valida no envio e passa no axe', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <Shell>
        <SignIn />
      </Shell>,
    )
    expectNoExtraLandmarks(container)
    expect(screen.getByRole('heading', { level: 2, name: 'Entrar na sua loja' })).toBeInTheDocument()
    expect(screen.getByRole('form', { name: 'Entrar na sua loja' })).toBeInTheDocument()
    await expectNoA11yViolations(container)

    await user.click(screen.getByRole('button', { name: 'Entrar' }))
    const summary = await screen.findByRole('heading', { name: /corrija/i })
    expect(summary).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Informe seu e-mail de trabalho.' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Informe sua senha.' })).toBeInTheDocument()
    await expectNoA11yViolations(container)

    // Erro do servidor na senha.
    await user.type(screen.getByLabelText(/E-mail de trabalho/), 'equipe@lojaaurora.com.br')
    await user.type(screen.getByLabelText(/^Senha/), 'qualquer')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(await screen.findByRole('link', { name: /E-mail ou senha incorretos/ }, { timeout: 3000 })).toBeInTheDocument()
    await expectNoA11yViolations(container)

    await user.click(screen.getByRole('button', { name: /SSO/ }))
    expect(screen.getByText(/Abrindo a página de login da sua empresa/)).toBeInTheDocument()
  })

  it('Painel: renderiza indicadores, gráficos, tabela e paginação e passa no axe', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <Shell>
        <Dashboard />
      </Shell>,
    )
    expectNoExtraLandmarks(container)
    expect(screen.getByRole('heading', { level: 2, name: 'Visão geral' })).toBeInTheDocument()
    for (const name of ['Indicadores', 'Vendas', 'Pedidos recentes']) {
      expect(screen.getByRole('heading', { level: 3, name })).toBeInTheDocument()
    }
    const table = screen.getByRole('table', { name: 'Pedidos recentes' })
    expect(within(table).getAllByRole('row')).toHaveLength(7) // cabeçalho + 6
    expect(screen.getByText('30 pedidos no período')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Páginas dos pedidos' })).toBeInTheDocument()
    if (wide) expect(screen.getByRole('navigation', { name: 'Navegação do painel' })).toBeInTheDocument()
    await expectNoA11yViolations(container)

    // Ordenar por total e ir para a página 2.
    await user.click(within(table).getByRole('button', { name: /Total/ }))
    const pager = screen.getByRole('navigation', { name: 'Páginas dos pedidos' })
    await user.click(within(pager).getAllByRole('button', { name: /2/ })[0])
    expect(within(screen.getByRole('table', { name: 'Pedidos recentes' })).getAllByRole('row')).toHaveLength(7)
    await expectNoA11yViolations(container)
  })

  it('Configurações: renderiza seções, valida, salva e passa no axe', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <Shell>
        <Settings />
      </Shell>,
    )
    expectNoExtraLandmarks(container)
    expect(screen.getByRole('heading', { level: 2, name: 'Loja' })).toBeInTheDocument()
    for (const name of ['Identidade da loja', 'Vendas e estoque', 'Avisos por e-mail', 'Zona de perigo']) {
      expect(screen.getByRole('heading', { level: 3, name })).toBeInTheDocument()
    }
    expect(screen.getByRole('group', { name: 'Identidade da loja' })).toBeInTheDocument()
    expect(screen.getByText('Tudo salvo.')).toBeInTheDocument()
    await expectNoA11yViolations(container)

    // Alteração → barra avisa.
    const nome = screen.getByLabelText(/Nome da loja/)
    await user.clear(nome)
    await waitFor(() => expect(screen.getByText('Você tem alterações não salvas.')).toBeInTheDocument())

    // Envio com erro → resumo com link para o nome.
    await user.click(screen.getByRole('button', { name: 'Salvar alterações' }))
    expect(await screen.findByRole('link', { name: 'Informe o nome da loja.' })).toBeInTheDocument()
    await expectNoA11yViolations(container)

    // Descartar volta ao valor salvo.
    await user.click(screen.getByRole('button', { name: 'Descartar' }))
    await waitFor(() => expect(screen.getByLabelText(/Nome da loja/)).toHaveValue('Aurora Centro'))
    expect(screen.getByText('Tudo salvo.')).toBeInTheDocument()

    // Salvar com sucesso → toast.
    await user.type(screen.getByLabelText(/Nome da loja/), ' Norte')
    await user.click(screen.getByRole('button', { name: 'Salvar alterações' }))
    expect(await screen.findByText('Configurações salvas', undefined, { timeout: 3000 })).toBeInTheDocument()

    // Zona de perigo: diálogo de exclusão.
    await user.click(screen.getByRole('button', { name: 'Excluir loja' }))
    const dialog = await screen.findByRole('alertdialog')
    expect(within(dialog).getByRole('heading', { name: /Excluir a loja Aurora Centro/ })).toBeInTheDocument()
    await expectNoA11yViolations(document.body)
  })
})

describe('páginas da documentação', () => {
  it.each([
    ['sign-in', SignInPage, 'Entrar'],
    ['dashboard', DashboardPage, 'Painel'],
    ['settings', SettingsPage, 'Configurações'],
  ] as const)('%s: página com prévia, código e acessibilidade', async (_slug, Page, title) => {
    const { container } = render(
      <MemoryRouter initialEntries={[`/pt/templates/${_slug}`]}>
        <OrangeProvider>
          <LangProvider lang="pt">
            <main>
              <Page />
            </main>
          </LangProvider>
        </OrangeProvider>
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument()
    for (const name of ['Visão geral', 'Prévia', 'Código-fonte', 'Acessibilidade']) {
      expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument()
    }
    const iframe = container.querySelector('iframe')
    expect(iframe?.getAttribute('src')).toBe(`/pt/templates/${_slug}?embed=1&theme=dark`)
    expect(screen.getByRole('group', { name: 'Largura da prévia' })).toBeInTheDocument()
    expect(screen.getByRole('tablist', { name: 'Arquivos do modelo' })).toBeInTheDocument()
    // O jsdom não executa o iframe: o axe roda só na página (o modelo é coberto acima).
    const results = await axe.run(container, {
      iframes: false,
      rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
    })
    const messages = results.violations.map((v) => `[${v.id}] ${v.help}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)
    expect(messages, messages.join('\n')).toEqual([])
  })

  it('modo embed: só o modelo, no body', async () => {
    render(
      <MemoryRouter initialEntries={['/pt/templates/sign-in?embed=1&theme=light']}>
        <OrangeProvider>
          <LangProvider lang="pt">
            <SignInPage />
          </LangProvider>
        </OrangeProvider>
      </MemoryRouter>,
    )
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull()
    expect(screen.getByRole('heading', { level: 2, name: 'Entrar na sua loja' })).toBeInTheDocument()
    expect(document.querySelector('.tpl-embed')?.parentElement).toBe(document.body)
    await waitFor(() => expect(document.documentElement.getAttribute('data-theme')).toBe('light'))
  })
})
