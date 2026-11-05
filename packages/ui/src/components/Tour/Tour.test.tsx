import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRef, useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { Tour, type TourProps, type TourStep } from './Tour'

type DemoProps = Partial<TourProps>

/** Painel de pedidos fictício com três alvos (ref, seletor e função). */
function Demo({ steps: customSteps, onOpenChange, ...props }: DemoProps) {
  const [open, setOpen] = useState(false)
  const filtersRef = useRef<HTMLDivElement>(null)
  const steps: TourStep[] = customSteps ?? [
    {
      target: filtersRef,
      title: 'Filtros rápidos',
      content: 'Separe os pedidos por status com um clique.',
    },
    {
      target: '#tour-exportar',
      title: 'Exportar relatório',
      content: 'Baixe os pedidos do dia em planilha.',
      placement: 'left',
    },
    {
      target: () => document.querySelector('[data-tour="status"]'),
      title: 'Status ao vivo',
      content: 'Novos pedidos aparecem sem recarregar a página.',
    },
  ]
  return (
    <div>
      <button type="button" onClick={() => setOpen(true)}>
        Iniciar tour
      </button>
      <div ref={filtersRef}>
        <button type="button">Todos</button>
        <button type="button">Em separação</button>
      </div>
      <button type="button" id="tour-exportar">
        Exportar
      </button>
      <span data-tour="status">Ao vivo</span>
      <Tour
        label="Novidades do painel"
        steps={steps}
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          onOpenChange?.(next)
        }}
        {...props}
      />
    </div>
  )
}

async function startTour(props: DemoProps = {}) {
  const user = userEvent.setup()
  const utils = render(<Demo {...props} />)
  const trigger = screen.getByRole('button', { name: 'Iniciar tour' })
  await user.click(trigger)
  const dialog = screen.getByRole('dialog')
  return { user, trigger, dialog, ...utils }
}

function tourRoot() {
  return document.querySelector<HTMLElement>('.or-tour')!
}

/** Faz `matchMedia` responder `true` para as consultas escolhidas (restaurado após cada teste). */
function mockMatchMedia(matches: (query: string) => boolean) {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        matches: matches(query),
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList,
  )
}

describe('Tour', () => {
  it('abre no passo 1 como diálogo modal com nome, descrição e contador', async () => {
    const { dialog } = await startTour()
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAccessibleName('Novidades do painel Filtros rápidos')
    expect(dialog).toHaveAccessibleDescription('Separe os pedidos por status com um clique.')
    expect(within(dialog).getByRole('heading', { level: 2, name: 'Filtros rápidos' })).toBeInTheDocument()
    expect(within(dialog).getByText('1 de 3')).toBeInTheDocument()
    // Voltar escondido no primeiro passo; Próximo e Pular tour visíveis.
    expect(within(dialog).queryByRole('button', { name: 'Voltar' })).not.toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: 'Próximo' })).toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: 'Pular tour' })).toBeInTheDocument()
    // Pontos de progresso são decorativos.
    expect(dialog.querySelector('.or-tour__dots')).toHaveAttribute('aria-hidden', 'true')
    expect(dialog.querySelectorAll('.or-tour__dot')).toHaveLength(3)
    expect(dialog.querySelector('.or-tour__dot[data-state="current"]')).toBe(
      dialog.querySelectorAll('.or-tour__dot')[0],
    )
    // O fundo com o recorte é decorativo e o passo tem alvo.
    expect(document.querySelector('.or-tour__spotlight')).toHaveAttribute('aria-hidden', 'true')
    expect(tourRoot()).toHaveAttribute('data-mode', 'anchored')
    expect(tourRoot()).toHaveAttribute('data-spotlight', 'on')
  })

  it('avança, volta e conclui chamando os callbacks', async () => {
    const onStepChange = vi.fn()
    const onFinish = vi.fn()
    const onSkip = vi.fn()
    const onOpenChange = vi.fn()
    const { user, dialog } = await startTour({ onStepChange, onFinish, onSkip, onOpenChange })

    await user.click(within(dialog).getByRole('button', { name: 'Próximo' }))
    expect(onStepChange).toHaveBeenLastCalledWith(1)
    expect(within(dialog).getByText('2 de 3')).toBeInTheDocument()
    expect(dialog).toHaveAccessibleName('Novidades do painel Exportar relatório')

    await user.click(within(dialog).getByRole('button', { name: 'Voltar' }))
    expect(onStepChange).toHaveBeenLastCalledWith(0)
    expect(within(dialog).getByText('1 de 3')).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: 'Próximo' }))
    await user.click(within(dialog).getByRole('button', { name: 'Próximo' }))
    expect(within(dialog).getByText('3 de 3')).toBeInTheDocument()
    expect(within(dialog).queryByRole('button', { name: 'Próximo' })).not.toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: 'Concluir' }))
    expect(onFinish).toHaveBeenCalledTimes(1)
    expect(onSkip).not.toHaveBeenCalled()
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(onStepChange).toHaveBeenCalledTimes(4)
  })

  it('"Pular tour" chama onSkip com o passo atual e fecha', async () => {
    const onSkip = vi.fn()
    const onFinish = vi.fn()
    const { user, dialog } = await startTour({ onSkip, onFinish })
    await user.click(within(dialog).getByRole('button', { name: 'Próximo' }))
    await user.click(within(dialog).getByRole('button', { name: 'Pular tour' }))
    expect(onSkip).toHaveBeenCalledWith(1)
    expect(onFinish).not.toHaveBeenCalled()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('Escape pula o tour; com dismissible={false} não há saída antecipada', async () => {
    const onSkip = vi.fn()
    const { user, unmount } = await startTour({ onSkip })
    await user.keyboard('{Escape}')
    expect(onSkip).toHaveBeenCalledWith(0)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    unmount()

    const locked = await startTour({ onSkip: vi.fn(), dismissible: false })
    expect(within(locked.dialog).queryByRole('button', { name: 'Pular tour' })).not.toBeInTheDocument()
    await locked.user.keyboard('{Escape}')
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('move o foco para o título a cada passo, prende o Tab e devolve o foco ao fechar', async () => {
    const { user, trigger, dialog } = await startTour()
    await waitFor(() => expect(within(dialog).getByRole('heading', { name: 'Filtros rápidos' })).toHaveFocus())

    // Tab a partir do título segue para os controles; Shift+Tab dá a volta dentro do diálogo.
    await user.tab()
    expect(within(dialog).getByRole('button', { name: 'Próximo' })).toHaveFocus()
    await user.tab()
    expect(within(dialog).getByRole('button', { name: 'Pular tour' })).toHaveFocus()
    await user.tab({ shift: true })
    expect(within(dialog).getByRole('button', { name: 'Próximo' })).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(within(dialog).getByRole('heading', { name: 'Exportar relatório' })).toHaveFocus()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('Shift+Tab no título vai para o último controle quando não há nada antes dele', async () => {
    const { user, dialog } = await startTour({ dismissible: false })
    const heading = within(dialog).getByRole('heading', { name: 'Filtros rápidos' })
    await waitFor(() => expect(heading).toHaveFocus())
    await user.tab({ shift: true })
    expect(within(dialog).getByRole('button', { name: 'Próximo' })).toHaveFocus()
  })

  it('passo sem alvo, ou com alvo ausente, aparece centralizado e sem recorte', async () => {
    const { user, dialog } = await startTour({
      steps: [
        { title: 'Novo painel de pedidos', content: 'Tudo o que mudou, em dois passos.' },
        { target: '#nao-existe', title: 'Atalhos', content: 'Pressione ? para ver os atalhos.' },
        { target: '#tour-exportar', title: 'Exportar', content: 'Baixe a planilha do dia.' },
      ],
    })
    expect(tourRoot()).toHaveAttribute('data-mode', 'center')
    expect(tourRoot()).toHaveAttribute('data-spotlight', 'off')
    expect(dialog.querySelector('.or-tour__arrow')).not.toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: 'Próximo' }))
    expect(within(dialog).getByText('2 de 3')).toBeInTheDocument()
    expect(tourRoot()).toHaveAttribute('data-mode', 'center')

    await user.click(within(dialog).getByRole('button', { name: 'Próximo' }))
    expect(tourRoot()).toHaveAttribute('data-mode', 'anchored')
    expect(tourRoot()).toHaveAttribute('data-spotlight', 'on')
  })

  it('anúncio de um passo só: centralizado, sem contador e com "Concluir"', async () => {
    const user = userEvent.setup()
    const onFinish = vi.fn()
    render(
      <Tour
        label="Novidade"
        defaultOpen
        onFinish={onFinish}
        steps={[{ title: 'Relatórios agendados', content: 'Receba o resumo de vendas toda segunda-feira.' }]}
      />,
    )
    const dialog = await screen.findByRole('dialog', { name: 'Novidade Relatórios agendados' })
    expect(tourRoot()).toHaveAttribute('data-mode', 'center')
    expect(within(dialog).queryByText('1 de 1')).not.toBeInTheDocument()
    expect(dialog.querySelector('.or-tour__dots')).not.toBeInTheDocument()
    expect(within(dialog).queryByRole('button', { name: 'Voltar' })).not.toBeInTheDocument()
    await user.click(within(dialog).getByRole('button', { name: 'Concluir' }))
    expect(onFinish).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('aceita o passo controlado com step/onStepChange', async () => {
    const user = userEvent.setup()
    const onStepChange = vi.fn()
    const steps: TourStep[] = [
      { title: 'Pedidos', content: 'Lista de pedidos.' },
      { title: 'Filtros', content: 'Filtros por status.' },
      { title: 'Exportar', content: 'Planilha do dia.' },
    ]
    const { rerender } = render(<Tour label="Painel" steps={steps} defaultOpen step={1} onStepChange={onStepChange} />)
    const dialog = await screen.findByRole('dialog', { name: 'Painel Filtros' })
    expect(within(dialog).getByText('2 de 3')).toBeInTheDocument()

    // Sem atualizar a prop, o passo não muda — só avisa.
    await user.click(within(dialog).getByRole('button', { name: 'Próximo' }))
    expect(onStepChange).toHaveBeenCalledWith(2)
    expect(within(dialog).getByText('2 de 3')).toBeInTheDocument()

    rerender(<Tour label="Painel" steps={steps} defaultOpen step={2} onStepChange={onStepChange} />)
    expect(within(dialog).getByText('3 de 3')).toBeInTheDocument()
    expect(within(dialog).getByRole('heading', { name: 'Exportar' })).toHaveFocus()
    expect(within(dialog).getByRole('button', { name: 'Concluir' })).toBeInTheDocument()
  })

  it('passo não controlado recomeça do início ao reabrir, sem disparar onStepChange', async () => {
    const onStepChange = vi.fn()
    const { user, trigger, dialog } = await startTour({ onStepChange })
    await user.click(within(dialog).getByRole('button', { name: 'Próximo' }))
    expect(onStepChange).toHaveBeenCalledTimes(1)
    await user.keyboard('{Escape}')
    expect(onStepChange).toHaveBeenCalledTimes(1)

    await user.click(trigger)
    expect(within(screen.getByRole('dialog')).getByText('1 de 3')).toBeInTheDocument()
  })

  it('rola o alvo para o centro da tela antes de mostrar o passo', async () => {
    const scrollIntoView = vi.fn()
    const { user, dialog } = await startTour()
    const exportButton = document.getElementById('tour-exportar')!
    exportButton.scrollIntoView = scrollIntoView
    // Alvo fora da tela (abaixo da dobra).
    exportButton.getBoundingClientRect = () => new DOMRect(40, 2000, 120, 40)

    await user.click(within(dialog).getByRole('button', { name: 'Próximo' }))
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'center', inline: 'nearest', behavior: 'smooth' })
    // O passo aparece quando a rolagem termina (o alvo para de se mover).
    expect(await within(dialog).findByText('2 de 3')).toBeInTheDocument()
  })

  it('com movimento reduzido rola sem animação e mostra o passo na hora', async () => {
    mockMatchMedia((query) => query.includes('prefers-reduced-motion'))
    const scrollIntoView = vi.fn()
    const { user, dialog } = await startTour()
    const exportButton = document.getElementById('tour-exportar')!
    exportButton.scrollIntoView = scrollIntoView
    exportButton.getBoundingClientRect = () => new DOMRect(40, 2000, 120, 40)

    await user.click(within(dialog).getByRole('button', { name: 'Próximo' }))
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'center', inline: 'nearest', behavior: 'auto' })
    expect(within(dialog).getByText('2 de 3')).toBeInTheDocument()
  })

  it('em telas estreitas vira uma folha encostada na borda da tela', async () => {
    mockMatchMedia((query) => query.includes('max-width'))
    const { dialog } = await startTour()
    expect(tourRoot()).toHaveAttribute('data-mode', 'sheet')
    expect(tourRoot()).toHaveAttribute('data-dock', 'bottom')
    expect(dialog.querySelector('.or-tour__arrow')).not.toBeInTheDocument()
  })

  it('usa os textos do idioma configurado', async () => {
    const user = userEvent.setup()
    render(
      <OrangeProvider locale="en-US">
        <Tour
          defaultOpen
          steps={[
            { title: 'Orders', content: 'All orders in one place.' },
            { title: 'Export', content: 'Download a spreadsheet.' },
          ]}
        />
      </OrangeProvider>,
    )
    const dialog = await screen.findByRole('dialog', { name: 'Guided tour Orders' })
    expect(within(dialog).getByText('1 of 2')).toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: 'Skip tour' })).toBeInTheDocument()
    await user.click(within(dialog).getByRole('button', { name: 'Next' }))
    expect(within(dialog).getByRole('button', { name: 'Back' })).toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: 'Finish' })).toBeInTheDocument()
  })

  it('não possui violações de acessibilidade com o tour aberto', async () => {
    const { user, dialog } = await startTour({
      steps: [
        {
          target: '#tour-exportar',
          title: 'Exportar relatório',
          content: 'Baixe os pedidos do dia em planilha.',
          media: <img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="Botão Exportar no topo do painel" />,
        },
        { title: 'Pronto!', content: 'Você pode rever este tour no menu Ajuda.' },
      ],
    })
    await expectNoA11yViolations(document.body)
    await user.click(within(dialog).getByRole('button', { name: 'Próximo' }))
    await expectNoA11yViolations(document.body)
  })
})
