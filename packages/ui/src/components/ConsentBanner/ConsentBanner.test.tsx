import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef, useRef, useState, type Ref } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { ConsentBanner, type ConsentBannerProps, type ConsentCategory } from './ConsentBanner'

const categories: ConsentCategory[] = [
  {
    id: 'necessarios',
    label: 'Necessários',
    description: 'Login, segurança e carrinho. Sem eles o site não funciona.',
    required: true,
  },
  {
    id: 'desempenho',
    label: 'Desempenho',
    description: 'Estatísticas de uso, sem identificar você, para melhorar as páginas.',
  },
  { id: 'funcionalidade', label: 'Funcionalidade', description: 'Lembram idioma e região.' },
  { id: 'publicidade', label: 'Publicidade', description: 'Anúncios mais relevantes.' },
]

const allAccepted = { necessarios: true, desempenho: true, funcionalidade: true, publicidade: true }
const onlyRequired = {
  necessarios: true,
  desempenho: false,
  funcionalidade: false,
  publicidade: false,
}

function renderBanner(props: Partial<ConsentBannerProps> & { ref?: Ref<HTMLDivElement> } = {}) {
  return render(<ConsentBanner categories={categories} {...props} />)
}

const region = () => screen.getByRole('region', { name: 'Cookies neste site' })
const queryRegion = () => screen.queryByRole('region', { name: 'Cookies neste site' })
const dialog = () => screen.getByRole('dialog', { name: 'Preferências de cookies' })
const frame = () => document.querySelector('.or-consent-banner-frame')

afterEach(() => {
  vi.restoreAllMocks()
})

describe('ConsentBanner', () => {
  it('é uma região nomeada pelo título, com texto, link da política e três ações', () => {
    const { container } = renderBanner({ policyHref: '/privacidade/cookies' })
    const banner = region()
    expect(
      within(banner).getByRole('heading', { level: 2, name: 'Cookies neste site' }),
    ).toHaveClass('or-consent-banner__title')
    expect(banner).toHaveTextContent('Usamos cookies necessários para o site funcionar')
    expect(within(banner).getByRole('link', { name: 'Política de cookies' })).toHaveAttribute(
      'href',
      '/privacidade/cookies',
    )
    const buttons = within(banner).getAllByRole('button')
    expect(buttons.map((button) => button.textContent)).toEqual([
      'Aceitar todos',
      'Rejeitar opcionais',
      'Personalizar',
    ])
    // Mesmo peso visual: mesma variante e tamanho nas três.
    for (const button of buttons)
      expect(button).toHaveClass('or-button--secondary', 'or-button--md')
    expect(buttons[2]).toHaveAttribute('aria-haspopup', 'dialog')
    expect(banner).toHaveClass('or-consent-banner', 'or-consent-banner--bottom')
    expect(frame()).toHaveClass('or-consent-banner-frame--bottom')
    // Fixo: em portal no início do <body>, fora do contêiner onde foi declarado.
    expect(container).not.toContainElement(banner)
    expect(document.body.firstElementChild).toContainElement(banner)
    expect(document.body.firstElementChild).toHaveAttribute('data-or-consent-banner-portal')
    // Sem diálogo aberto e sem anúncio de início.
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('aceita título, texto, nível de heading, ref e atributos próprios', () => {
    const ref = createRef<HTMLDivElement>()
    renderBanner({
      ref,
      title: 'Sua privacidade na Loja Aurora',
      headingLevel: 3,
      children: <p>Usamos cookies para manter o carrinho e, se você permitir, medir visitas.</p>,
      id: 'consentimento',
      className: 'meu-banner',
    })
    const banner = screen.getByRole('region', { name: 'Sua privacidade na Loja Aurora' })
    expect(ref.current).toBe(banner)
    expect(banner).toHaveAttribute('id', 'consentimento')
    expect(banner).toHaveClass('meu-banner')
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Sua privacidade')
    expect(banner).toHaveTextContent('se você permitir, medir visitas')
    expect(banner).not.toHaveTextContent('Usamos cookies necessários')
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('não rouba o foco ao aparecer, nem ao reabrir', () => {
    const outside = document.createElement('button')
    outside.textContent = 'Buscar'
    document.body.appendChild(outside)
    try {
      outside.focus()
      const { rerender } = render(<ConsentBanner categories={categories} open />)
      expect(region()).toBeInTheDocument()
      expect(outside).toHaveFocus()
      rerender(<ConsentBanner categories={categories} open={false} />)
      rerender(<ConsentBanner categories={categories} open />)
      expect(outside).toHaveFocus()
    } finally {
      outside.remove()
    }
  })

  it('"Aceitar todos" decide com todas as categorias e fecha o banner', async () => {
    const user = userEvent.setup()
    const onDecision = vi.fn()
    const onChange = vi.fn()
    const onOpenChange = vi.fn()
    renderBanner({ onDecision, onChange, onOpenChange })
    await user.click(screen.getByRole('button', { name: 'Aceitar todos' }))
    expect(onDecision).toHaveBeenCalledTimes(1)
    expect(onDecision).toHaveBeenCalledWith(allAccepted, 'accept-all')
    expect(onChange).toHaveBeenCalledWith(allAccepted)
    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(queryRegion()).not.toBeInTheDocument()
  })

  it('"Rejeitar opcionais" mantém só as obrigatórias (sem onChange quando nada muda)', async () => {
    const user = userEvent.setup()
    const onDecision = vi.fn()
    const onChange = vi.fn()
    renderBanner({ onDecision, onChange })
    await user.click(screen.getByRole('button', { name: 'Rejeitar opcionais' }))
    expect(onDecision).toHaveBeenCalledWith(onlyRequired, 'reject')
    // O padrão já era só as obrigatórias: o valor não mudou.
    expect(onChange).not.toHaveBeenCalled()
    expect(queryRegion()).not.toBeInTheDocument()
  })

  it('"Rejeitar opcionais" desliga o que estava aceito', async () => {
    const user = userEvent.setup()
    const onDecision = vi.fn()
    const onChange = vi.fn()
    renderBanner({ defaultValue: allAccepted, onDecision, onChange })
    await user.click(screen.getByRole('button', { name: 'Rejeitar opcionais' }))
    expect(onDecision).toHaveBeenCalledWith(onlyRequired, 'reject')
    expect(onChange).toHaveBeenCalledWith(onlyRequired)
  })

  it('"Personalizar" abre as preferências: obrigatórias travadas e opcionais desligadas', async () => {
    const user = userEvent.setup()
    const onDecision = vi.fn()
    renderBanner({ onDecision })
    await user.click(screen.getByRole('button', { name: 'Personalizar' }))
    const modal = dialog()
    expect(modal).toHaveAccessibleDescription(
      'Escolha quais cookies opcionais podemos usar. Os necessários mantêm o site funcionando e não podem ser desligados.',
    )
    // Caixas de seleção num grupo nomeado (fieldset + legend), não switches: só valem ao salvar.
    const group = within(modal).getByRole('group', { name: 'Categorias de cookies' })
    expect(within(modal).queryByRole('switch')).not.toBeInTheDocument()
    expect(within(group).getAllByRole('checkbox')).toHaveLength(4)
    const required = within(group).getByRole('checkbox', { name: 'Necessários Sempre ativos' })
    expect(required).toBeChecked()
    expect(required).toBeDisabled()
    expect(required).toHaveAccessibleDescription(
      'Login, segurança e carrinho. Sem eles o site não funciona.',
    )
    for (const name of ['Desempenho', 'Funcionalidade', 'Publicidade']) {
      const control = within(modal).getByRole('checkbox', { name })
      expect(control).not.toBeChecked()
      expect(control).toBeEnabled()
    }
    // O foco entra na primeira caixa que pode ser alterada.
    expect(within(modal).getByRole('checkbox', { name: 'Desempenho' })).toHaveFocus()

    await user.click(within(modal).getByRole('checkbox', { name: 'Desempenho' }))
    await user.click(within(modal).getByRole('checkbox', { name: 'Publicidade' }))
    await user.click(required)
    expect(required).toBeChecked()
    expect(onDecision).not.toHaveBeenCalled()

    await user.click(within(modal).getByRole('button', { name: 'Salvar preferências' }))
    expect(onDecision).toHaveBeenCalledWith(
      { necessarios: true, desempenho: true, funcionalidade: false, publicidade: true },
      'custom',
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(queryRegion()).not.toBeInTheDocument()
  })

  it('"Aceitar todos" também está nas preferências', async () => {
    const user = userEvent.setup()
    const onDecision = vi.fn()
    renderBanner({ onDecision })
    await user.click(screen.getByRole('button', { name: 'Personalizar' }))
    await user.click(within(dialog()).getByRole('button', { name: 'Aceitar todos' }))
    expect(onDecision).toHaveBeenCalledWith(allAccepted, 'accept-all')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(queryRegion()).not.toBeInTheDocument()
  })

  it('fechar as preferências sem salvar descarta as mudanças e devolve o foco a Personalizar', async () => {
    const user = userEvent.setup()
    const onDecision = vi.fn()
    renderBanner({ onDecision })
    const customize = screen.getByRole('button', { name: 'Personalizar' })
    await user.click(customize)
    await user.click(within(dialog()).getByRole('checkbox', { name: 'Desempenho' }))
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await waitFor(() => expect(customize).toHaveFocus())
    expect(region()).toBeInTheDocument()
    expect(onDecision).not.toHaveBeenCalled()

    await user.click(customize)
    expect(within(dialog()).getByRole('checkbox', { name: 'Desempenho' })).not.toBeChecked()
  })

  it('funciona só com o teclado', async () => {
    const user = userEvent.setup()
    const onDecision = vi.fn()
    render(
      <>
        <ConsentBanner
          categories={categories}
          policyHref="/privacidade/cookies"
          onDecision={onDecision}
        />
        <a href="#conteudo">Pular para o conteúdo</a>
      </>,
    )
    await user.tab()
    expect(screen.getByRole('link', { name: 'Política de cookies' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Aceitar todos' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Rejeitar opcionais' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Personalizar' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(within(dialog()).getByRole('checkbox', { name: 'Desempenho' })).toHaveFocus()
    await user.keyboard(' ')
    await user.tab()
    // Espaço marca a caixa (Enter não marca caixas nativas).
    await user.keyboard(' ')
    // Salvar com o teclado: Tab até "Salvar preferências".
    await user.tab()
    await user.tab()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Salvar preferências' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(onDecision).toHaveBeenCalledWith(
      { necessarios: true, desempenho: true, funcionalidade: true, publicidade: false },
      'custom',
    )
  })

  it('controlado: value define as preferências exibidas', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const onDecision = vi.fn()
    renderBanner({ open: true, value: { desempenho: true }, onChange, onDecision })
    const customize = screen.getByRole('button', { name: 'Personalizar' })
    await user.click(customize)
    expect(within(dialog()).getByRole('checkbox', { name: 'Desempenho' })).toBeChecked()
    await user.click(within(dialog()).getByRole('button', { name: 'Salvar preferências' }))
    // Salvar sem mudanças: decisão registrada, valor igual.
    expect(onDecision).toHaveBeenLastCalledWith(
      { necessarios: true, desempenho: true, funcionalidade: false, publicidade: false },
      'custom',
    )
    expect(onChange).not.toHaveBeenCalled()

    await user.click(customize)
    await user.click(within(dialog()).getByRole('checkbox', { name: 'Publicidade' }))
    await user.click(within(dialog()).getByRole('button', { name: 'Salvar preferências' }))
    expect(onChange).toHaveBeenCalledWith({
      necessarios: true,
      desempenho: true,
      funcionalidade: false,
      publicidade: true,
    })
    // O pai não atualizou `value`: ao reabrir, vale o valor controlado.
    await user.click(customize)
    expect(within(dialog()).getByRole('checkbox', { name: 'Publicidade' })).not.toBeChecked()
  })

  it('não controlado: defaultValue é o ponto de partida e guarda as decisões', async () => {
    const user = userEvent.setup()
    renderBanner({ open: true, defaultValue: { funcionalidade: true } })
    const customize = screen.getByRole('button', { name: 'Personalizar' })
    await user.click(customize)
    expect(within(dialog()).getByRole('checkbox', { name: 'Funcionalidade' })).toBeChecked()
    await user.click(within(dialog()).getByRole('checkbox', { name: 'Desempenho' }))
    await user.click(within(dialog()).getByRole('button', { name: 'Salvar preferências' }))
    await user.click(customize)
    expect(within(dialog()).getByRole('checkbox', { name: 'Desempenho' })).toBeChecked()
    expect(within(dialog()).getByRole('checkbox', { name: 'Funcionalidade' })).toBeChecked()
  })

  it('open controlado: a decisão pede para fechar com onOpenChange', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    const { rerender } = render(
      <ConsentBanner categories={categories} open onOpenChange={onOpenChange} />,
    )
    await user.click(screen.getByRole('button', { name: 'Aceitar todos' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(region()).toBeInTheDocument()
    rerender(<ConsentBanner categories={categories} open={false} onOpenChange={onOpenChange} />)
    expect(queryRegion()).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('defaultOpen={false} não mostra o banner', () => {
    renderBanner({ defaultOpen: false })
    expect(queryRegion()).not.toBeInTheDocument()
  })

  it('preferências abertas pelo rodapé com o banner fechado; o foco volta para quem abriu', async () => {
    const user = userEvent.setup()
    const onDecision = vi.fn()
    function App() {
      const [preferences, setPreferences] = useState(false)
      return (
        <>
          <ConsentBanner
            categories={categories}
            defaultOpen={false}
            defaultValue={allAccepted}
            preferencesOpen={preferences}
            onPreferencesOpenChange={setPreferences}
            onDecision={onDecision}
          />
          <footer>
            <button type="button" onClick={() => setPreferences(true)}>
              Preferências de cookies
            </button>
          </footer>
        </>
      )
    }
    render(<App />)
    const footerButton = screen.getByRole('button', { name: 'Preferências de cookies' })
    await user.click(footerButton)
    expect(queryRegion()).not.toBeInTheDocument()
    // Reabre com a escolha atual.
    const advertising = within(dialog()).getByRole('checkbox', { name: 'Publicidade' })
    expect(advertising).toBeChecked()
    await user.click(advertising)
    await user.click(within(dialog()).getByRole('button', { name: 'Salvar preferências' }))
    expect(onDecision).toHaveBeenCalledWith({ ...allAccepted, publicidade: false }, 'custom')
    await waitFor(() => expect(footerButton).toHaveFocus())
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(
        'Suas preferências de cookies foram salvas. Você pode mudá-las a qualquer momento.',
      ),
    )
  })

  it('anuncia a confirmação numa região de status, como no GOV.UK', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<ConsentBanner categories={categories} />)
    await user.click(screen.getByRole('button', { name: 'Aceitar todos' }))
    const status = screen.getByRole('status')
    expect(status).toHaveAttribute('aria-live', 'polite')
    await waitFor(() =>
      expect(status).toHaveTextContent(
        'Você aceitou todos os cookies. Você pode mudar as suas preferências a qualquer momento.',
      ),
    )
    // Reaberto: o anúncio anterior sai; rejeitar anuncia a outra mensagem.
    rerender(<ConsentBanner categories={categories} open />)
    await waitFor(() => expect(status).toBeEmptyDOMElement())
    await user.click(screen.getByRole('button', { name: 'Rejeitar opcionais' }))
    await waitFor(() => expect(status).toHaveTextContent('Você rejeitou os cookies opcionais.'))
  })

  describe('foco depois da decisão', () => {
    it('vai para o próximo elemento da página quando o foco estava no banner', async () => {
      const user = userEvent.setup()
      render(
        <>
          <ConsentBanner categories={categories} />
          <a href="#conteudo">Pular para o conteúdo</a>
        </>,
      )
      await user.tab()
      expect(screen.getByRole('button', { name: 'Aceitar todos' })).toHaveFocus()
      await user.keyboard('{Enter}')
      expect(screen.getByRole('link', { name: 'Pular para o conteúdo' })).toHaveFocus()
    })

    it('volta para onde estava antes de entrar no banner', async () => {
      const user = userEvent.setup()
      render(
        <>
          <button type="button">Minha conta</button>
          <ConsentBanner categories={categories} />
          <a href="#conteudo">Pular para o conteúdo</a>
        </>,
      )
      // O banner fixo vem antes de tudo: Shift+Tab a partir do primeiro botão entra nele.
      screen.getByRole('button', { name: 'Minha conta' }).focus()
      await user.tab({ shift: true })
      expect(screen.getByRole('button', { name: 'Personalizar' })).toHaveFocus()
      await user.tab({ shift: true })
      expect(screen.getByRole('button', { name: 'Rejeitar opcionais' })).toHaveFocus()
      await user.keyboard(' ')
      expect(screen.getByRole('button', { name: 'Minha conta' })).toHaveFocus()
    })

    it('inline e no fim da página, vai para o elemento anterior', async () => {
      const user = userEvent.setup()
      render(
        <>
          <a href="#topo">Início</a>
          <ConsentBanner categories={categories} placement="inline" />
        </>,
      )
      await user.click(screen.getByRole('button', { name: 'Aceitar todos' }))
      expect(screen.getByRole('link', { name: 'Início' })).toHaveFocus()
    })

    it('depois de salvar as preferências abertas pelo banner, vai para o próximo elemento', async () => {
      const user = userEvent.setup()
      render(
        <>
          <ConsentBanner categories={categories} />
          <a href="#conteudo">Pular para o conteúdo</a>
        </>,
      )
      await user.click(screen.getByRole('button', { name: 'Personalizar' }))
      await user.click(within(dialog()).getByRole('button', { name: 'Salvar preferências' }))
      await waitFor(() =>
        expect(screen.getByRole('link', { name: 'Pular para o conteúdo' })).toHaveFocus(),
      )
    })

    it('respeita finalFocus', async () => {
      const user = userEvent.setup()
      function App() {
        const headingRef = useRef<HTMLHeadingElement>(null)
        return (
          <>
            <ConsentBanner categories={categories} finalFocus={headingRef} />
            <a href="#conteudo">Pular para o conteúdo</a>
            <h1 ref={headingRef} tabIndex={-1}>
              Loja Aurora
            </h1>
          </>
        )
      }
      render(<App />)
      await user.click(screen.getByRole('button', { name: 'Aceitar todos' }))
      expect(screen.getByRole('heading', { name: 'Loja Aurora' })).toHaveFocus()
    })

    it('não mexe no foco que está fora do banner', async () => {
      const user = userEvent.setup()
      const { rerender } = render(
        <>
          <ConsentBanner categories={categories} open />
          <input aria-label="Buscar produtos" />
        </>,
      )
      await user.click(screen.getByRole('textbox', { name: 'Buscar produtos' }))
      rerender(
        <>
          <ConsentBanner categories={categories} open={false} />
          <input aria-label="Buscar produtos" />
        </>,
      )
      expect(screen.getByRole('textbox', { name: 'Buscar produtos' })).toHaveFocus()
    })
  })

  it('renderLink renderiza o link da política com o roteador', () => {
    const renderLink = vi.fn(({ href, ...props }) => (
      <a data-router="" href={`#/app${href}`} {...props} />
    ))
    renderBanner({ policyHref: '/cookies', renderLink })
    expect(renderLink).toHaveBeenCalledWith(
      expect.objectContaining({ href: '/cookies', children: 'Política de cookies' }),
    )
    const link = screen.getByRole('link', { name: 'Política de cookies' })
    expect(link).toHaveAttribute('data-router')
    expect(link).toHaveAttribute('href', '#/app/cookies')
    expect(link).toHaveClass('or-link')
  })

  it('placement: top e inline', () => {
    const { container, rerender } = renderBanner({ placement: 'top' })
    expect(frame()).toHaveClass('or-consent-banner-frame--top')
    expect(region()).toHaveAttribute('data-placement', 'top')
    rerender(<ConsentBanner categories={categories} placement="inline" />)
    expect(frame()).toHaveClass('or-consent-banner-frame--inline')
    // Inline: no lugar onde foi declarado, sem portal.
    expect(container).toContainElement(region())
    expect(document.querySelector('[data-or-consent-banner-portal]')).not.toBeInTheDocument()
    expect(region()).toHaveClass('or-consent-banner--inline')
  })

  it('fixo: reserva a altura do banner na rolagem da página e restaura ao fechar', async () => {
    const user = userEvent.setup()
    const height = vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(180)
    const html = document.documentElement
    try {
      const { unmount } = renderBanner()
      expect(html.style.scrollPaddingBottom).toBe('180px')
      await user.click(screen.getByRole('button', { name: 'Aceitar todos' }))
      expect(html.style.scrollPaddingBottom).toBe('')
      unmount()

      html.style.scrollPaddingTop = '64px'
      const top = renderBanner({ placement: 'top' })
      expect(html.style.scrollPaddingTop).toBe('calc(64px + 180px)')
      top.unmount()
      expect(html.style.scrollPaddingTop).toBe('64px')

      renderBanner({ placement: 'inline' })
      expect(html.style.scrollPaddingBottom).toBe('')
      expect(html.style.scrollPaddingTop).toBe('64px')
    } finally {
      height.mockRestore()
      html.style.scrollPaddingTop = ''
      html.style.scrollPaddingBottom = ''
    }
  })

  it('na saída fica montado e inert até a animação terminar', async () => {
    const real = window.getComputedStyle.bind(window)
    vi.spyOn(window, 'getComputedStyle').mockImplementation((el, pseudo) => {
      const style = real(el, pseudo)
      if (!(el as Element).matches?.('.or-consent-banner')) return style
      return Object.assign(Object.create(style), {
        animationName: 'or-consent-banner-exit',
        animationDuration: '0.16s',
        transitionDuration: '0s',
      }) as CSSStyleDeclaration
    })
    const user = userEvent.setup()
    renderBanner()
    await user.click(screen.getByRole('button', { name: 'Aceitar todos' }))
    const banner = document.querySelector('.or-consent-banner')!
    expect(banner).toHaveAttribute('data-state', 'closed')
    expect(frame()).toHaveAttribute('inert')
    fireEvent.animationEnd(banner)
    expect(document.querySelector('.or-consent-banner')).not.toBeInTheDocument()
    // O contêiner do portal sai junto.
    expect(document.querySelector('[data-or-consent-banner-portal]')).not.toBeInTheDocument()
  })

  it('fixo: leva o tema de uma área com data-theme para o portal', () => {
    render(
      <div data-theme="light">
        <ConsentBanner categories={categories} />
      </div>,
    )
    expect(frame()).toHaveAttribute('data-theme', 'light')
  })

  it('fixo: o portal sai do <body> ao desmontar, e o foco que estava nele não se perde', async () => {
    const user = userEvent.setup()
    function Page({ consent }: { consent: boolean }) {
      return (
        <>
          {consent && <ConsentBanner categories={categories} />}
          <a href="#conteudo">Pular para o conteúdo</a>
        </>
      )
    }
    const { rerender } = render(<Page consent />)
    await user.tab()
    expect(screen.getByRole('button', { name: 'Aceitar todos' })).toHaveFocus()
    rerender(<Page consent={false} />)
    expect(document.querySelector('[data-or-consent-banner-portal]')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Pular para o conteúdo' })).toHaveFocus()
  })

  it('usa os textos do idioma do OrangeProvider', async () => {
    const user = userEvent.setup()
    render(
      <OrangeProvider locale="en-US">
        <ConsentBanner categories={categories} policyHref="/cookies" />
      </OrangeProvider>,
    )
    const banner = screen.getByRole('region', { name: 'Cookies on this site' })
    expect(within(banner).getByRole('link', { name: 'Cookie policy' })).toBeInTheDocument()
    expect(
      within(banner)
        .getAllByRole('button')
        .map((b) => b.textContent),
    ).toEqual(['Accept all', 'Reject optional', 'Customize'])
    await user.click(within(banner).getByRole('button', { name: 'Customize' }))
    const modal = screen.getByRole('dialog', { name: 'Cookie preferences' })
    expect(
      within(modal).getByRole('checkbox', { name: 'Necessários Always active' }),
    ).toBeDisabled()
    expect(within(modal).getByRole('button', { name: 'Save preferences' })).toBeInTheDocument()
    await user.click(within(modal).getByRole('button', { name: 'Accept all' }))
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent("You've accepted all cookies."),
    )
  })

  it('não tem violações de acessibilidade (banner)', async () => {
    const { unmount } = renderBanner({ policyHref: '/privacidade/cookies' })
    await expectNoA11yViolations(document.body)
    unmount()
    renderBanner({ policyHref: '/privacidade/cookies', placement: 'inline' })
    await expectNoA11yViolations(document.body)
  })

  it('não tem violações de acessibilidade (preferências)', async () => {
    const user = userEvent.setup()
    renderBanner({ policyHref: '/privacidade/cookies' })
    await user.click(screen.getByRole('button', { name: 'Personalizar' }))
    expect(dialog()).toBeInTheDocument()
    await expectNoA11yViolations(document.body)
  })
})
