import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { Toast } from './Toast'
import {
  ToastProvider,
  useToast,
  type ToastOptions,
  type ToastProviderProps,
  type UseToastReturn,
} from './ToastProvider'

let api: UseToastReturn

function Trigger({ options, label = 'Mostrar' }: { options: ToastOptions; label?: string }) {
  const value = useToast()
  api = value
  return (
    <button type="button" onClick={() => value.toast(options)}>
      {label}
    </button>
  )
}

function setup(options: ToastOptions, providerProps: Omit<ToastProviderProps, 'children'> = {}) {
  return render(
    <ToastProvider {...providerProps}>
      <Trigger options={options} />
    </ToastProvider>,
  )
}

const region = () => screen.getByRole('region', { name: 'Notificações (F8)' })
/** Busca só na pilha visível (as regiões vivas ocultas repetem o texto). */
const queryToast = (text: string) => {
  const stack = document.querySelector<HTMLElement>('.or-toast-region')
  return stack ? within(stack).queryByText(text) : null
}
const getToast = (text: string) => within(region()).getByText(text)

afterEach(() => {
  vi.useRealTimers()
})

/**
 * O jsdom não aplica CSS: simula a animação de saída dos itens da pilha para
 * que o usePresence espere o `animationend`, como no navegador.
 */
function simulateExitAnimation() {
  const real = window.getComputedStyle.bind(window)
  vi.spyOn(window, 'getComputedStyle').mockImplementation((el, pseudo) => {
    const style = real(el, pseudo)
    if (!(el as Element).matches?.('.or-toast-region__item')) return style
    return Object.assign(Object.create(style), {
      animationName: 'or-toast-shrink',
      animationDuration: '0.25s',
      transitionDuration: '0s',
    }) as CSSStyleDeclaration
  })
}

const item = (text: string) => getToast(text).closest('li') as HTMLLIElement

describe('Toast', () => {
  it('renderiza o visual com título, descrição, tom e botão de fechar', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const { container } = render(
      <Toast
        tone="success"
        title="Pedido enviado"
        description="Chega até sexta-feira."
        onClose={onClose}
      />,
    )
    expect(container.firstElementChild).toHaveClass('or-toast', 'or-toast--success')
    expect(container).toHaveTextContent('Sucesso: Pedido enviado')
    await user.click(screen.getByRole('button', { name: 'Fechar' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('sem onClose não mostra o botão de fechar', () => {
    render(<Toast title="Link copiado" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})

describe('ToastProvider / useToast', () => {
  it('useToast fora do provider lança erro claro', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Trigger options={{ title: 'x' }} />)).toThrow(/ToastProvider/)
    spy.mockRestore()
  })

  it('mostra o toast em uma região rotulada e anuncia de forma educada', async () => {
    const user = userEvent.setup()
    setup({ title: 'Link copiado', description: 'Cole onde quiser.' })
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Mostrar' }))
    expect(within(region()).getByText('Link copiado')).toBeInTheDocument()
    expect(within(region()).getAllByRole('listitem')).toHaveLength(1)
    // título e descrição separados por pausa; sem rótulos de botões no anúncio
    expect(screen.getByRole('status').textContent).toBe('Link copiado. Cole onde quiser.')
    expect(screen.getByRole('alert')).toBeEmptyDOMElement()
  })

  it('toasts danger são anunciados com role="alert"', async () => {
    const user = userEvent.setup()
    setup({ title: 'Falha no pagamento', tone: 'danger' })
    await user.click(screen.getByRole('button', { name: 'Mostrar' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Erro: Falha no pagamento')
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('retorna o id e fecha sozinho após a duração', () => {
    vi.useFakeTimers()
    const onDismiss = vi.fn()
    setup({ title: 'Salvo' }, { duration: 3000 })
    let id = ''
    act(() => {
      id = api.toast({ title: 'Rascunho salvo', onDismiss })
    })
    expect(id).toMatch(/^or-toast-/)
    expect(getToast('Rascunho salvo')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(2900))
    expect(onDismiss).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(100))
    expect(onDismiss).toHaveBeenCalledTimes(1)
    act(() => vi.advanceTimersByTime(300))
    expect(queryToast('Rascunho salvo')).not.toBeInTheDocument()
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  })

  it('a duração por toast tem prioridade e Infinity mantém o toast', () => {
    vi.useFakeTimers()
    setup({ title: 'x' })
    act(() => {
      api.toast({ title: 'Rápido', duration: 1000 })
      api.toast({ title: 'Fixo', duration: Infinity })
    })
    act(() => vi.advanceTimersByTime(1500))
    expect(queryToast('Rápido')).not.toBeInTheDocument()
    act(() => vi.advanceTimersByTime(60_000))
    expect(getToast('Fixo')).toBeInTheDocument()
  })

  it('pausa o timer enquanto o ponteiro está sobre a região', () => {
    vi.useFakeTimers()
    setup({ title: 'x' }, { duration: 2000 })
    act(() => {
      api.toast({ title: 'Arquivo enviado' })
    })
    act(() => vi.advanceTimersByTime(1500))
    fireEvent.pointerEnter(region())
    act(() => vi.advanceTimersByTime(10_000))
    expect(getToast('Arquivo enviado')).toBeInTheDocument()
    fireEvent.pointerLeave(region())
    act(() => vi.advanceTimersByTime(400))
    expect(getToast('Arquivo enviado')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(400))
    expect(queryToast('Arquivo enviado')).not.toBeInTheDocument()
  })

  it('pausa o timer enquanto o foco está dentro de um toast', () => {
    vi.useFakeTimers()
    setup({ title: 'x' }, { duration: 2000 })
    act(() => {
      api.toast({ title: 'Contato salvo' })
    })
    act(() => {
      within(region()).getByRole('button', { name: 'Fechar' }).focus()
    })
    act(() => vi.advanceTimersByTime(10_000))
    expect(getToast('Contato salvo')).toBeInTheDocument()
    act(() => {
      screen.getByRole('button', { name: 'Mostrar' }).focus()
    })
    act(() => vi.advanceTimersByTime(2500))
    expect(queryToast('Contato salvo')).not.toBeInTheDocument()
  })

  it('fecha pelo botão de fechar', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    setup({ title: 'Convite enviado', onDismiss })
    await user.click(screen.getByRole('button', { name: 'Mostrar' }))
    await user.click(within(region()).getByRole('button', { name: 'Fechar' }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(queryToast('Convite enviado')).not.toBeInTheDocument())
  })

  it('F8 leva o foco ao toast mais recente e Escape o fecha, devolvendo o foco', async () => {
    const user = userEvent.setup()
    setup({ title: 'Item arquivado', action: { label: 'Desfazer', onClick: () => {} } })
    const trigger = screen.getByRole('button', { name: 'Mostrar' })
    await user.click(trigger)
    expect(trigger).toHaveFocus()
    await user.keyboard('{F8}')
    expect(within(region()).getByRole('button', { name: 'Desfazer' })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(trigger).toHaveFocus()
    await waitFor(() => expect(queryToast('Item arquivado')).not.toBeInTheDocument())
  })

  it('Escape no toast não se propaga para o documento', async () => {
    const user = userEvent.setup()
    const onDocumentKey = vi.fn()
    document.addEventListener('keydown', onDocumentKey)
    setup({ title: 'Mensagem', duration: Infinity })
    await user.click(screen.getByRole('button', { name: 'Mostrar' }))
    within(region()).getByRole('button', { name: 'Fechar' }).focus()
    await user.keyboard('{Escape}')
    expect(onDocumentKey).not.toHaveBeenCalledWith(expect.objectContaining({ key: 'Escape' }))
    document.removeEventListener('keydown', onDocumentKey)
  })

  it('ao fechar com foco, o foco vai para o toast vizinho', async () => {
    const user = userEvent.setup()
    setup({ title: 'x' }, { duration: Infinity })
    act(() => {
      api.toast({ title: 'Primeiro' })
      api.toast({ title: 'Segundo' })
    })
    const [firstClose, secondClose] = within(region()).getAllByRole('button', { name: 'Fechar' })
    firstClose.focus()
    await user.keyboard('{Enter}')
    expect(secondClose).toHaveFocus()
  })

  it('a ação chama onClick e fecha; toasts com ação não somem sozinhos', async () => {
    vi.useFakeTimers()
    const onClick = vi.fn()
    setup({ title: 'x' })
    act(() => {
      api.toast({ title: '3 e-mails excluídos', action: { label: 'Desfazer', onClick } })
    })
    act(() => vi.advanceTimersByTime(60_000))
    expect(getToast('3 e-mails excluídos')).toBeInTheDocument()
    fireEvent.click(within(region()).getByRole('button', { name: 'Desfazer' }))
    expect(onClick).toHaveBeenCalledTimes(1)
    act(() => vi.advanceTimersByTime(300))
    expect(queryToast('3 e-mails excluídos')).not.toBeInTheDocument()
  })

  it('respeita o limite de toasts visíveis e mostra os da fila depois', () => {
    vi.useFakeTimers()
    setup({ title: 'x' }, { limit: 2, duration: Infinity })
    const ids: string[] = []
    act(() => {
      ids.push(
        api.toast({ title: 'Um' }),
        api.toast({ title: 'Dois' }),
        api.toast({ title: 'Três' }),
      )
    })
    expect(within(region()).getAllByRole('listitem')).toHaveLength(2)
    expect(queryToast('Três')).not.toBeInTheDocument()
    act(() => api.dismiss(ids[0]))
    act(() => vi.advanceTimersByTime(300))
    expect(getToast('Três')).toBeInTheDocument()
    expect(queryToast('Um')).not.toBeInTheDocument()
  })

  it('reutilizar o id substitui o conteúdo e reanuncia', () => {
    vi.useFakeTimers()
    setup({ title: 'x' })
    act(() => {
      api.toast({ id: 'upload', title: 'Enviando arquivo…', duration: Infinity })
    })
    act(() => {
      api.toast({ id: 'upload', title: 'Arquivo enviado', tone: 'success' })
    })
    expect(within(region()).getAllByRole('listitem')).toHaveLength(1)
    expect(getToast('Arquivo enviado')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Sucesso: Arquivo enviado')
  })

  it('saída animada: o item fica "closed" até a animação terminar e então sai do DOM', () => {
    simulateExitAnimation()
    setup({ title: 'x' }, { duration: Infinity })
    let id = ''
    act(() => {
      id = api.toast({ title: 'Contrato enviado' })
    })
    const li = item('Contrato enviado')
    expect(li).toHaveAttribute('data-state', 'open')
    act(() => api.dismiss(id))
    expect(li).toHaveAttribute('data-state', 'closed')
    expect(li).toHaveAttribute('aria-hidden', 'true')
    expect(li).toBeInTheDocument()
    act(() => {
      fireEvent.animationEnd(li)
    })
    expect(li).not.toBeInTheDocument()
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  })

  it('reabrir pelo id durante a saída cancela a remoção', () => {
    simulateExitAnimation()
    setup({ title: 'x' }, { duration: Infinity })
    act(() => {
      api.toast({ id: 'sync', title: 'Sincronizando…' })
    })
    const li = item('Sincronizando…')
    act(() => api.dismiss('sync'))
    act(() => {
      api.toast({ id: 'sync', title: 'Sincronizado', tone: 'success' })
    })
    expect(li).toHaveAttribute('data-state', 'open')
    act(() => {
      fireEvent.animationEnd(li)
    })
    expect(getToast('Sincronizado')).toBeInTheDocument()
  })

  it('toasts na fila saem na hora (não há o que animar)', () => {
    simulateExitAnimation()
    setup({ title: 'x' }, { limit: 1, duration: Infinity })
    let queued = ''
    act(() => {
      api.toast({ title: 'Visível' })
      queued = api.toast({ title: 'Na fila' })
    })
    expect(within(region()).getAllByRole('listitem')).toHaveLength(1)
    act(() => api.dismiss(queued))
    // sem animação de saída para esperar: o item da fila some do store na hora
    act(() => api.dismissAll())
    expect(item('Visível')).toHaveAttribute('data-state', 'closed')
    act(() => {
      fireEvent.animationEnd(item('Visível'))
    })
    expect(queryToast('Na fila')).not.toBeInTheDocument()
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  })

  it('showProgress mostra a barra de tempo restante só em toasts temporizados', () => {
    setup({ title: 'x' }, { showProgress: true, duration: 3000 })
    act(() => {
      api.toast({ title: 'Com tempo' })
      api.toast({ title: 'Fixo', duration: Infinity })
      api.toast({ title: 'Sem barra', showProgress: false })
    })
    const timer = item('Com tempo').querySelector<HTMLElement>('.or-toast-region__timer')!
    expect(timer).toHaveAttribute('aria-hidden', 'true')
    expect(timer.style.getPropertyValue('--_timer-duration')).toBe('3000ms')
    expect(item('Fixo').querySelector('.or-toast-region__timer')).not.toBeInTheDocument()
    expect(item('Sem barra').querySelector('.or-toast-region__timer')).not.toBeInTheDocument()
    expect(region()).not.toHaveAttribute('data-paused')
    fireEvent.pointerEnter(region())
    // a barra pausa junto com o timer (CSS: [data-paused] → animation-play-state: paused)
    expect(region()).toHaveAttribute('data-paused', 'true')
  })

  it('a barra recomeça quando o conteúdo do toast é atualizado', () => {
    setup({ title: 'x' }, { showProgress: true })
    act(() => {
      api.toast({ id: 'up', title: 'Enviando' })
    })
    const before = item('Enviando').querySelector('.or-toast-region__timer')
    act(() => {
      api.toast({ id: 'up', title: 'Enviado' })
    })
    const after = item('Enviado').querySelector('.or-toast-region__timer')
    expect(after).toBeInTheDocument()
    expect(after).not.toBe(before)
  })

  it('dismissAll fecha todos', () => {
    vi.useFakeTimers()
    setup({ title: 'x' }, { duration: Infinity })
    act(() => {
      api.toast({ title: 'A' })
      api.toast({ title: 'B' })
    })
    act(() => api.dismissAll())
    act(() => vi.advanceTimersByTime(300))
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  })

  it('posições no topo mostram o mais recente primeiro', () => {
    setup({ title: 'x' }, { position: 'top-center', duration: Infinity })
    act(() => {
      api.toast({ title: 'Antigo' })
      api.toast({ title: 'Novo' })
    })
    expect(region()).toHaveClass('or-toast-region--top-center')
    const items = within(region()).getAllByRole('listitem')
    expect(items[0]).toHaveTextContent('Novo')
    expect(items[1]).toHaveTextContent('Antigo')
  })

  it('traduz o rótulo da região e permite desativar o atalho', () => {
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <ToastProvider hotkey={false}>
          <Trigger options={{ title: 'x' }} />
        </ToastProvider>
      </OrangeProvider>,
    )
    act(() => {
      api.toast({ title: 'Saved' })
    })
    expect(screen.getByRole('region', { name: 'Notifications' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })

  it('não possui violações de acessibilidade', async () => {
    render(
      <ToastProvider duration={Infinity}>
        <Trigger options={{ title: 'x' }} />
      </ToastProvider>,
    )
    act(() => {
      api.toast({ title: 'Pedido enviado', description: 'Chega até sexta.', tone: 'success' })
      api.toast({
        title: 'Falha ao sincronizar',
        tone: 'danger',
        action: { label: 'Tentar de novo', onClick: () => {} },
      })
      api.toast({ title: 'Sem ícone', icon: false, dismissible: false })
    })
    await expectNoA11yViolations(document.body)
  })
})
