import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { Rating } from './Rating'

describe('Rating', () => {
  it('renderiza um radiogroup rotulado com rádios nativos', () => {
    render(<Rating label="Avalie o atendimento" />)
    const group = screen.getByRole('radiogroup', { name: 'Avalie o atendimento' })
    const radios = screen.getAllByRole('radio')
    expect(group).toBeInTheDocument()
    expect(radios).toHaveLength(5)
    expect(radios[0]).toHaveAccessibleName('1 de 5 estrelas')
    expect(radios[4]).toHaveAccessibleName('5 de 5 estrelas')
    expect(radios[0].tagName).toBe('INPUT')
  })

  it('respeita max', () => {
    render(<Rating label="Nota" max={10} />)
    expect(screen.getAllByRole('radio')).toHaveLength(10)
    expect(screen.getByRole('radio', { name: '7 de 10 estrelas' })).toBeInTheDocument()
  })

  it('seleciona com clique e preenche as estrelas', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { container } = render(<Rating label="Nota" onChange={onChange} />)
    await user.click(screen.getByRole('radio', { name: '4 de 5 estrelas' }))
    expect(onChange).toHaveBeenCalledWith(4)
    expect(screen.getByRole('radio', { name: '4 de 5 estrelas' })).toBeChecked()
    expect(container.querySelectorAll('.or-rating__star[data-filled]')).toHaveLength(4)
  })

  it('setas do teclado mudam a nota (comportamento nativo de rádio)', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Rating label="Nota" defaultValue={2} onChange={onChange} />)
    await user.tab()
    expect(screen.getByRole('radio', { name: '2 de 5 estrelas' })).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: '3 de 5 estrelas' })).toBeChecked()
    expect(onChange).toHaveBeenLastCalledWith(3)
    await user.keyboard('{ArrowLeft}{ArrowLeft}')
    expect(onChange).toHaveBeenLastCalledWith(1)
  })

  it('hover mostra a prévia e o rótulo da nota', async () => {
    const user = userEvent.setup()
    const labels = ['Péssimo', 'Ruim', 'Regular', 'Bom', 'Excelente']
    const { container } = render(<Rating label="Nota" labels={labels} defaultValue={1} />)
    expect(screen.getByRole('radio', { name: 'Excelente' })).toBeInTheDocument()
    expect(container.querySelector('.or-rating-field__caption')).toHaveTextContent('Péssimo')
    const stars = container.querySelectorAll('label.or-rating__star')
    await user.hover(stars[3])
    expect(container.querySelector('.or-rating')).toHaveClass('or-rating--preview')
    expect(container.querySelectorAll('.or-rating__star[data-filled]')).toHaveLength(4)
    expect(container.querySelector('.or-rating-field__caption')).toHaveTextContent('Bom')
    await user.unhover(container.querySelector('.or-rating')!)
    expect(container.querySelectorAll('.or-rating__star[data-filled]')).toHaveLength(1)
  })

  it('motion: escolher uma nota dispara o pop em onda sem tirar o foco do rádio', async () => {
    const user = userEvent.setup()
    const { container } = render(<Rating label="Nota" defaultValue={2} />)
    expect(container.querySelector('.or-rating__glyph--pop')).toBeNull()
    await user.click(screen.getByRole('radio', { name: '3 de 5 estrelas' }))
    const popped = container.querySelectorAll<HTMLElement>('.or-rating__glyph--pop')
    expect(popped).toHaveLength(3)
    expect(popped[2].style.getPropertyValue('--_i')).toBe('2')
    const first = popped[0]
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: '4 de 5 estrelas' })).toHaveFocus()
    expect(container.querySelectorAll('.or-rating__glyph--pop')).toHaveLength(4)
    // o ícone remonta para repetir a animação
    expect(container.querySelector('.or-rating__glyph--pop')).not.toBe(first)
  })

  it('controlado: reflete value', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [rating, setRating] = useState<number | null>(3)
      return (
        <>
          <Rating label="Nota" value={rating} onChange={setRating} />
          <button type="button" onClick={() => setRating(null)}>
            Limpar
          </button>
        </>
      )
    }
    render(<Controlled />)
    expect(screen.getByRole('radio', { name: '3 de 5 estrelas' })).toBeChecked()
    await user.click(screen.getByRole('button', { name: 'Limpar' }))
    screen.getAllByRole('radio').forEach((radio) => expect(radio).not.toBeChecked())
  })

  it('readOnly renderiza role="img" com a nota por extenso (inclusive frações)', () => {
    const { container, rerender } = render(<Rating readOnly value={4} />)
    expect(screen.getByRole('img', { name: '4 de 5 estrelas' })).toBeInTheDocument()
    expect(screen.queryByRole('radio')).not.toBeInTheDocument()
    rerender(<Rating readOnly value={3.5} />)
    expect(screen.getByRole('img', { name: '3,5 de 5 estrelas' })).toBeInTheDocument()
    expect(container.querySelector('.or-rating__partial')).toHaveStyle({ width: '50%' })
  })

  it('formata conforme o locale', () => {
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <Rating readOnly value={4.5} />
      </OrangeProvider>,
    )
    expect(screen.getByRole('img', { name: '4.5 of 5 stars' })).toBeInTheDocument()
  })

  it('desabilitado, obrigatório e com erro', () => {
    const { rerender } = render(<Rating label="Nota" disabled />)
    screen.getAllByRole('radio').forEach((radio) => expect(radio).toBeDisabled())
    rerender(
      <Rating
        label="Nota"
        required
        error="Dê uma nota de 1 a 5"
        description="Sua opinião é anônima"
      />,
    )
    const group = screen.getByRole('radiogroup', { name: 'Nota' })
    expect(group).toHaveAttribute('aria-required', 'true')
    expect(group).toHaveAttribute('aria-invalid', 'true')
    expect(group).toHaveAccessibleDescription('Sua opinião é anônima Dê uma nota de 1 a 5')
  })

  it('aplica o tamanho', () => {
    const { container } = render(<Rating label="Nota" size="lg" />)
    expect(container.querySelector('.or-rating')).toHaveClass('or-rating--lg')
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <Rating label="Avalie o produto" defaultValue={3} description="De 1 a 5 estrelas" />
        <Rating label="Avalie a entrega" error="Escolha uma nota" required size="sm" />
        <Rating readOnly value={4.5} size="lg" />
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
