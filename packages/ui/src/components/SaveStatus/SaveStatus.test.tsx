import { createRef, useState } from 'react'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { SaveStatus, type SaveStatusProps, type SaveStatusState } from './SaveStatus'

const NOW = new Date('2026-11-12T12:00:00-03:00')
const twoMinutesAgo = new Date('2026-11-12T11:58:00-03:00')

const politeRegion = () => screen.getByRole('status')
const alertRegion = () => screen.getByRole('alert')

/** Conta os nós adicionados a uma região viva — cada adição é um anúncio. */
function watchAdditions(region: Element) {
  const added: string[] = []
  const observer = new MutationObserver((records) => {
    for (const record of records) {
      record.addedNodes.forEach((node) => added.push(node.textContent ?? ''))
    }
  })
  observer.observe(region, { childList: true, subtree: true, characterData: true })
  return {
    added,
    flush: () => {
      added.push(
        ...observer
          .takeRecords()
          .flatMap((r) => Array.from(r.addedNodes, (n) => n.textContent ?? '')),
      )
      return added
    },
    stop: () => observer.disconnect(),
  }
}

function setup(props: Partial<SaveStatusProps> = {}) {
  const view = render(<SaveStatus status="idle" {...props} />)
  const rerender = (next: Partial<SaveStatusProps>) =>
    view.rerender(<SaveStatus status="idle" {...next} />)
  return { ...view, rerender }
}

afterEach(() => {
  vi.useRealTimers()
})

describe('SaveStatus', () => {
  describe('estados (sempre ícone + texto)', () => {
    it('idle não mostra nada, mas mantém as regiões vivas montadas', () => {
      const { container } = setup()
      expect(container.querySelector('.or-save-status__layer')).toBeEmptyDOMElement()
      expect(politeRegion()).toBeEmptyDOMElement()
      expect(alertRegion()).toBeEmptyDOMElement()
    })

    it('idle mostra labels.idle quando informado', () => {
      setup({ labels: { idle: 'Salvamento automático ativado' } })
      expect(screen.getByText('Salvamento automático ativado')).toBeInTheDocument()
    })

    it('saving: Spinner decorativo + "Salvando…" (a região própria é a única viva)', () => {
      const { container } = setup({ status: 'saving' })
      expect(container).toHaveTextContent('Salvando…')
      const spinner = container.querySelector('.or-spinner')
      expect(spinner).toHaveAttribute('aria-hidden', 'true')
      expect(screen.getAllByRole('status')).toHaveLength(1)
      expect(container.querySelector('.or-save-status')).toHaveAttribute('data-status', 'saving')
    })

    it('saved sem savedAt: check + "Salvo"', () => {
      const { container } = setup({ status: 'saved' })
      expect(container.querySelector('.or-save-status__layer')).toHaveTextContent('Salvo')
      expect(container.querySelector('.or-save-status__icon svg')).toBeInTheDocument()
      expect(container.querySelector('.or-save-status__icon')).toHaveAttribute(
        'aria-hidden',
        'true',
      )
    })

    it('saved com savedAt: tempo relativo com RelativeTime ("Salvo há 2 min.")', () => {
      vi.useFakeTimers({ now: NOW })
      const { container } = setup({ status: 'saved', savedAt: twoMinutesAgo })
      const layer = container.querySelector('.or-save-status__layer')!
      expect(layer).toHaveTextContent('Salvo há 2 min.')
      const time = layer.querySelector('time')
      expect(time).toHaveAttribute('datetime', twoMinutesAgo.toISOString())
    })

    it('error: ícone de alerta + "Erro ao salvar"; sem onRetry não há botão', () => {
      const { container } = setup({ status: 'error' })
      expect(container.querySelector('.or-save-status__layer')).toHaveTextContent('Erro ao salvar')
      expect(container.querySelector('.or-save-status__icon svg')).toBeInTheDocument()
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('labels substitui os textos e size aplica a classe', () => {
      vi.useFakeTimers({ now: NOW })
      const { container } = setup({
        status: 'saved',
        savedAt: twoMinutesAgo,
        size: 'sm',
        labels: { savedAt: 'Rascunho salvo {time}' },
      })
      expect(container.querySelector('.or-save-status')).toHaveClass('or-save-status--sm')
      expect(container.querySelector('.or-save-status__layer')).toHaveTextContent(
        'Rascunho salvo há 2 min.',
      )
    })

    it('textos padrão no idioma do provider', () => {
      vi.useFakeTimers({ now: NOW })
      const { container } = render(
        <OrangeProvider locale="en-US">
          <SaveStatus status="saved" savedAt={twoMinutesAgo} />
        </OrangeProvider>,
      )
      expect(container.querySelector('.or-save-status__layer')).toHaveTextContent(
        'Saved 2 min. ago',
      )
    })
  })

  describe('tentar de novo', () => {
    it('com onRetry, o erro mostra um botão descrito pela mensagem de erro', async () => {
      const user = userEvent.setup()
      const onRetry = vi.fn()
      setup({ status: 'error', onRetry })
      const button = screen.getByRole('button', { name: 'Tentar de novo' })
      expect(button).toHaveAttribute('type', 'button')
      expect(button).toHaveAccessibleDescription('Erro ao salvar')
      await user.click(button)
      button.focus()
      await user.keyboard('{Enter}')
      expect(onRetry).toHaveBeenCalledTimes(2)
    })

    it('ao tentar de novo, o foco não cai no <body>: estaciona no indicador', async () => {
      const user = userEvent.setup()
      function Editor() {
        const [status, setStatus] = useState<SaveStatusState>('error')
        return <SaveStatus status={status} onRetry={() => setStatus('saving')} data-testid="raiz" />
      }
      render(<Editor />)
      await user.click(screen.getByRole('button', { name: 'Tentar de novo' }))
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
      const root = screen.getByTestId('raiz')
      expect(root).toHaveFocus()
      expect(root).toHaveAttribute('tabindex', '-1')
      // Fora da ordem do Tab: o tabindex temporário sai quando o foco sai.
      await user.tab()
      expect(root).not.toHaveAttribute('tabindex')
    })

    it('não rouba o foco se onRetry o levou a outro lugar', async () => {
      const user = userEvent.setup()
      function Editor() {
        const [status, setStatus] = useState<SaveStatusState>('error')
        return (
          <>
            <textarea aria-label="Texto" id="texto" />
            <SaveStatus
              status={status}
              onRetry={() => {
                document.getElementById('texto')?.focus()
                setStatus('saving')
              }}
            />
          </>
        )
      }
      render(<Editor />)
      await user.click(screen.getByRole('button', { name: 'Tentar de novo' }))
      expect(screen.getByRole('textbox', { name: 'Texto' })).toHaveFocus()
    })

    it('o botão só aparece no estado de erro', () => {
      const { rerender } = setup({ status: 'saving', onRetry: () => {} })
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
      rerender({ status: 'error', onRetry: () => {} })
      expect(screen.getByRole('button', { name: 'Tentar de novo' })).toBeInTheDocument()
      rerender({ status: 'saving', onRetry: () => {} })
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })

  describe('anúncios (uma vez por transição)', () => {
    it('nada é anunciado na primeira renderização', () => {
      setup({ status: 'saved' })
      expect(politeRegion()).toBeEmptyDOMElement()
      expect(alertRegion()).toBeEmptyDOMElement()
    })

    it('saving não é anunciado; saving → saved anuncia "Salvo" uma vez (polite)', () => {
      const { rerender } = setup({ status: 'idle' })
      const watch = watchAdditions(politeRegion())
      rerender({ status: 'saving' })
      expect(politeRegion()).toBeEmptyDOMElement()
      rerender({ status: 'saved', savedAt: twoMinutesAgo })
      expect(politeRegion()).toHaveTextContent('Salvo')
      // Novas renderizações com as mesmas props não anunciam de novo.
      rerender({ status: 'saved', savedAt: new Date(twoMinutesAgo) })
      rerender({ status: 'saved', savedAt: twoMinutesAgo })
      expect(watch.flush()).toEqual(['Salvo'])
      expect(alertRegion()).toBeEmptyDOMElement()
      watch.stop()
    })

    it('o tempo relativo que se atualiza sozinho não é anunciado', () => {
      vi.useFakeTimers({ now: NOW })
      const { rerender, container } = setup({ status: 'saving' })
      rerender({ status: 'saved', savedAt: NOW })
      const watch = watchAdditions(politeRegion())
      // O RelativeTime reagenda o próximo tique a cada atualização: avança aos poucos.
      for (let i = 0; i < 36; i++) {
        act(() => {
          vi.advanceTimersByTime(5000)
        })
      }
      expect(container.querySelector('.or-save-status__layer')).toHaveTextContent('Salvo há 3 min.')
      expect(watch.flush()).toEqual([])
      watch.stop()
    })

    it('cada novo salvamento é anunciado de novo (saved → saving → saved)', () => {
      const { rerender } = setup({ status: 'saving' })
      const watch = watchAdditions(politeRegion())
      rerender({ status: 'saved' })
      rerender({ status: 'saving' })
      expect(politeRegion()).toBeEmptyDOMElement()
      rerender({ status: 'saved' })
      expect(watch.flush()).toEqual(['Salvo', 'Salvo'])
      watch.stop()
    })

    it('um savedAt novo sem passar por saving também é anunciado', () => {
      const { rerender } = setup({ status: 'saved', savedAt: twoMinutesAgo })
      const watch = watchAdditions(politeRegion())
      rerender({ status: 'saved', savedAt: NOW })
      expect(watch.flush()).toEqual(['Salvo'])
      watch.stop()
    })

    it('erro é anunciado em role="alert" (assertivo), uma vez', () => {
      const { rerender } = setup({ status: 'saving', onRetry: () => {} })
      const watch = watchAdditions(alertRegion())
      rerender({ status: 'error', onRetry: () => {} })
      rerender({ status: 'error', onRetry: () => {} })
      expect(alertRegion()).toHaveTextContent('Erro ao salvar')
      expect(politeRegion()).toBeEmptyDOMElement()
      expect(watch.flush()).toEqual(['Erro ao salvar'])
      // Nova tentativa que falha de novo: novo anúncio.
      rerender({ status: 'saving', onRetry: () => {} })
      rerender({ status: 'error', onRetry: () => {} })
      expect(watch.flush()).toEqual(['Erro ao salvar', 'Erro ao salvar'])
      watch.stop()
    })

    it('anuncia os textos de labels', () => {
      const { rerender } = setup({ status: 'saving' })
      rerender({ status: 'saved', labels: { saved: 'Rascunho salvo' } })
      expect(politeRegion()).toHaveTextContent('Rascunho salvo')
    })

    it('o anúncio sai da região depois de alguns segundos', () => {
      vi.useFakeTimers({ now: NOW })
      const { rerender } = setup({ status: 'saving' })
      rerender({ status: 'saved' })
      expect(politeRegion()).toHaveTextContent('Salvo')
      act(() => {
        vi.advanceTimersByTime(7000)
      })
      expect(politeRegion()).toBeEmptyDOMElement()
    })
  })

  describe('movimento', () => {
    it('só anima depois da primeira troca de estado', () => {
      const { container, rerender } = setup({ status: 'saved' })
      const layer = () => container.querySelector('.or-save-status__layer:not([aria-hidden])')
      expect(layer()).not.toHaveAttribute('data-state')
      rerender({ status: 'saving' })
      expect(layer()).toHaveAttribute('data-state', 'open')
      expect(layer()).toHaveAttribute('data-status', 'saving')
    })

    it('sem animação (jsdom / movimento reduzido), a camada que sai desmonta na hora', () => {
      const { container, rerender } = setup({ status: 'saving' })
      rerender({ status: 'saved' })
      expect(container.querySelectorAll('.or-save-status__layer')).toHaveLength(1)
      expect(container.querySelector('[data-state="closed"]')).toBeNull()
    })
  })

  it('repassa ref e props para a raiz', () => {
    const ref = createRef<HTMLSpanElement>()
    render(<SaveStatus ref={ref} status="saved" className="extra" data-testid="raiz" />)
    expect(ref.current).toBe(screen.getByTestId('raiz'))
    expect(ref.current).toHaveClass('or-save-status', 'or-save-status--md', 'extra')
  })

  it('não tem violações de acessibilidade em nenhum estado', async () => {
    vi.useFakeTimers({ now: NOW, shouldAdvanceTime: true })
    const { container, rerender } = setup({ status: 'saving' })
    await expectNoA11yViolations(container)
    rerender({ status: 'saved', savedAt: twoMinutesAgo })
    await expectNoA11yViolations(container)
    rerender({ status: 'error', onRetry: () => {} })
    await expectNoA11yViolations(container)
  })
})
