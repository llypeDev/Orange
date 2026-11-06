import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, type AccordionProps } from './Accordion'

function Faq(props: Partial<AccordionProps>) {
  return (
    <Accordion {...(props as AccordionProps)}>
      <AccordionItem value="prazo">
        <AccordionTrigger>Qual o prazo de entrega?</AccordionTrigger>
        <AccordionContent>Até 5 dias úteis para capitais.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="troca">
        <AccordionTrigger>Posso trocar um produto?</AccordionTrigger>
        <AccordionContent>Sim, em até 30 dias.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="nf" disabled>
        <AccordionTrigger>Onde baixo a nota fiscal?</AccordionTrigger>
        <AccordionContent>Na área de pedidos.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="pagamento">
        <AccordionTrigger>Quais formas de pagamento?</AccordionTrigger>
        <AccordionContent>Pix, cartão e boleto.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

const trigger = (name: string) => screen.getByRole('button', { name })

describe('Accordion', () => {
  it('renderiza botões dentro de headings com aria-expanded e aria-controls', () => {
    render(<Faq defaultValue="prazo" />)
    const heading = screen.getByRole('heading', { level: 3, name: 'Qual o prazo de entrega?' })
    const button = trigger('Qual o prazo de entrega?')
    expect(heading).toContainElement(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    const region = screen.getByRole('region', { name: 'Qual o prazo de entrega?' })
    expect(button).toHaveAttribute('aria-controls', region.id)
    expect(region).toBeVisible()
    expect(trigger('Posso trocar um produto?')).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByText('Sim, em até 30 dias.').closest('[role="region"]')).not.toBeVisible()
  })

  it('modo single: abrir um item fecha o outro; collapsible permite fechar', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Faq defaultValue="prazo" onChange={onChange} />)
    await user.click(trigger('Posso trocar um produto?'))
    expect(trigger('Posso trocar um produto?')).toHaveAttribute('aria-expanded', 'true')
    expect(trigger('Qual o prazo de entrega?')).toHaveAttribute('aria-expanded', 'false')
    expect(onChange).toHaveBeenLastCalledWith('troca')
    await user.click(trigger('Posso trocar um produto?'))
    expect(trigger('Posso trocar um produto?')).toHaveAttribute('aria-expanded', 'false')
    expect(onChange).toHaveBeenLastCalledWith(null)
  })

  it('modo single não recolhível marca o item aberto com aria-disabled', async () => {
    const user = userEvent.setup()
    render(<Faq defaultValue="prazo" collapsible={false} />)
    const open = trigger('Qual o prazo de entrega?')
    expect(open).toHaveAttribute('aria-disabled', 'true')
    await user.click(open)
    expect(open).toHaveAttribute('aria-expanded', 'true')
  })

  it('modo multiple mantém vários itens abertos', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Faq type="multiple" defaultValue={['prazo']} onChange={onChange} />)
    await user.click(trigger('Posso trocar um produto?'))
    expect(trigger('Qual o prazo de entrega?')).toHaveAttribute('aria-expanded', 'true')
    expect(trigger('Posso trocar um produto?')).toHaveAttribute('aria-expanded', 'true')
    expect(onChange).toHaveBeenLastCalledWith(['prazo', 'troca'])
  })

  it('funciona controlado', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [value, setValue] = useState<string | null>('troca')
      return (
        <>
          <p data-testid="value">{value ?? 'nenhum'}</p>
          <Faq value={value} onChange={(v: string | string[] | null) => setValue(v as string | null)} />
        </>
      )
    }
    render(<Controlled />)
    expect(trigger('Posso trocar um produto?')).toHaveAttribute('aria-expanded', 'true')
    await user.click(trigger('Quais formas de pagamento?'))
    expect(screen.getByTestId('value')).toHaveTextContent('pagamento')
    expect(trigger('Quais formas de pagamento?')).toHaveAttribute('aria-expanded', 'true')
  })

  it('teclado: Enter/Espaço alternam; setas, Home e End movem o foco pulando desabilitados', async () => {
    const user = userEvent.setup()
    render(<Faq />)
    const first = trigger('Qual o prazo de entrega?')
    first.focus()
    await user.keyboard('{Enter}')
    expect(first).toHaveAttribute('aria-expanded', 'true')
    await user.keyboard(' ')
    expect(first).toHaveAttribute('aria-expanded', 'false')

    await user.keyboard('{ArrowDown}')
    expect(trigger('Posso trocar um produto?')).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(trigger('Quais formas de pagamento?')).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(first).toHaveFocus()
    await user.keyboard('{ArrowUp}')
    expect(trigger('Quais formas de pagamento?')).toHaveFocus()
    await user.keyboard('{Home}')
    expect(first).toHaveFocus()
    await user.keyboard('{End}')
    expect(trigger('Quais formas de pagamento?')).toHaveFocus()
  })

  it('respeita o nível de heading e itens desabilitados', () => {
    render(<Faq headingLevel={2} />)
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(4)
    expect(trigger('Onde baixo a nota fiscal?')).toBeDisabled()
  })

  it('motion: o painel abre com data-state e só fica hidden ao fechar', async () => {
    const user = userEvent.setup()
    render(<Faq />)
    const button = trigger('Posso trocar um produto?')
    const panel = document.getElementById(button.getAttribute('aria-controls')!)!
    expect(panel).toHaveAttribute('data-state', 'closed')
    expect(panel).not.toBeVisible()
    await user.click(button)
    expect(panel).toBeVisible()
    // um quadro em 0fr antes de expandir, para a transição acontecer
    await waitFor(() => expect(panel).toHaveAttribute('data-state', 'open'))
    expect(panel).not.toHaveAttribute('inert')
    await user.click(button)
    expect(panel).toHaveAttribute('data-state', 'closed')
    // fora do Tab e da árvore de acessibilidade já durante a saída
    expect(panel).toHaveAttribute('inert')
    await waitFor(() => expect(panel).not.toBeVisible())
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <Faq defaultValue="prazo" />
        <Faq type="multiple" defaultValue={['troca', 'pagamento']} variant="flush" />
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
