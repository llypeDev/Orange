import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Icon } from '../../icons'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { Tag } from './Tag'

describe('Tag', () => {
  it('renderiza o rótulo com marcador, tom, variante e tamanho', () => {
    const { container } = render(
      <Tag tone="success" variant="solid" size="lg">
        Pago
      </Tag>,
    )
    const tag = screen.getByText('Pago').parentElement!
    expect(tag).toHaveClass('or-tag', 'or-tag--success', 'or-tag--solid', 'or-tag--lg')
    expect(container.querySelector('.or-tag__marker')).toHaveAttribute('aria-hidden', 'true')
  })

  it('aceita ícone no lugar do marcador ou nenhum marcador', () => {
    const { container, rerender } = render(<Tag icon={<Icon name="clock" />}>Agendado</Tag>)
    expect(container.querySelector('.or-tag__marker')).toBeNull()
    expect(container.querySelector('[data-icon="clock"]')).not.toBeNull()
    rerender(<Tag marker={false}>Rascunho</Tag>)
    expect(container.querySelector('.or-tag__marker')).toBeNull()
  })

  it('não mostra botão de remover sem onRemove', () => {
    render(<Tag>Fixo</Tag>)
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('remove por mouse e teclado com rótulo acessível', async () => {
    const user = userEvent.setup()
    function Filters() {
      const [tags, setTags] = useState(['São Paulo', 'Rio de Janeiro'])
      return (
        <div>
          {tags.map((tag) => (
            <Tag key={tag} onRemove={() => setTags((list) => list.filter((t) => t !== tag))}>
              {tag}
            </Tag>
          ))}
        </div>
      )
    }
    render(<Filters />)
    await user.click(screen.getByRole('button', { name: 'Remover São Paulo' }))
    expect(screen.queryByText('São Paulo')).toBeNull()
    screen.getByRole('button', { name: 'Remover Rio de Janeiro' }).focus()
    await user.keyboard('{Enter}')
    expect(screen.queryByText('Rio de Janeiro')).toBeNull()
  })

  it('usa removeLabel, traduz o rótulo e respeita disabled', async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    const { rerender } = render(
      <Tag onRemove={onRemove} removeLabel="Remover filtro de categoria">
        Eletrônicos
      </Tag>,
    )
    expect(screen.getByRole('button', { name: 'Remover filtro de categoria' })).toBeInTheDocument()
    rerender(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <Tag onRemove={onRemove} disabled>
          Electronics
        </Tag>
      </OrangeProvider>,
    )
    const button = screen.getByRole('button', { name: 'Remove Electronics' })
    expect(button).toBeDisabled()
    await user.click(button)
    expect(onRemove).not.toHaveBeenCalled()
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <ul>
        {(['neutral', 'accent', 'success', 'warning', 'danger', 'info'] as const).map((tone) => (
          <li key={tone}>
            <Tag tone={tone}>{tone}</Tag>
            <Tag tone={tone} variant="solid" size="sm" onRemove={() => {}}>
              {tone}
            </Tag>
          </li>
        ))}
      </ul>,
    )
    await expectNoA11yViolations(container)
  })
})
