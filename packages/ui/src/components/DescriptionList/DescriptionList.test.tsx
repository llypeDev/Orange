import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { DescriptionDetails, DescriptionGroup, DescriptionList, DescriptionTerm } from './DescriptionList'

const items = [
  { term: 'Plano', description: 'Pro anual' },
  { term: 'Vencimento', description: '12 de março de 2027' },
  { term: 'Responsáveis', description: ['Ana Souza', 'Bruno Lima'] },
]

describe('DescriptionList', () => {
  it('renderiza <dl> com <dt>/<dd> a partir de items, agrupados em <div>', () => {
    const { container } = render(<DescriptionList items={items} />)
    const dl = container.querySelector('dl')!
    expect(dl).toHaveClass('or-dl', 'or-dl--horizontal', 'or-dl--term-eyebrow', 'or-dl--divided', 'or-dl--md')
    expect(dl.querySelectorAll(':scope > div.or-dl__group')).toHaveLength(3)
    expect(screen.getAllByRole('term')[0].tagName).toBe('DT')
  })

  it('expõe papéis de termo e definição', () => {
    render(<DescriptionList items={items} />)
    expect(screen.getAllByRole('term').map((el) => el.textContent)).toEqual(['Plano', 'Vencimento', 'Responsáveis'])
    expect(screen.getAllByRole('definition').map((el) => el.textContent)).toEqual([
      'Pro anual',
      '12 de março de 2027',
      'Ana Souza',
      'Bruno Lima',
    ])
  })

  it('aceita composição com DescriptionTerm/DescriptionDetails', () => {
    render(
      <DescriptionList layout="vertical" termVariant="strong">
        <DescriptionTerm>Domínio</DescriptionTerm>
        <DescriptionDetails>app.orange.dev</DescriptionDetails>
        <DescriptionGroup>
          <DescriptionTerm>Região</DescriptionTerm>
          <DescriptionDetails>São Paulo (sa-east-1)</DescriptionDetails>
        </DescriptionGroup>
      </DescriptionList>,
    )
    expect(screen.getAllByRole('term')).toHaveLength(2)
    expect(screen.getByText('Região').closest('dl')).toHaveClass('or-dl--vertical', 'or-dl--term-strong')
  })

  it('layout grid define o número de colunas e não aplica divided', () => {
    const { container } = render(<DescriptionList layout="grid" columns={4} items={items} />)
    const dl = container.querySelector('dl')!
    expect(dl).toHaveClass('or-dl--grid')
    expect(dl).not.toHaveClass('or-dl--divided')
    expect(dl.style.getPropertyValue('--_cols')).toBe('4')
  })

  it('aceita termWidth, divided=false e size', () => {
    const { container } = render(<DescriptionList items={items} termWidth="8rem" divided={false} size="sm" />)
    const dl = container.querySelector('dl')!
    expect(dl.style.getPropertyValue('--_term-width')).toBe('8rem')
    expect(dl).not.toHaveClass('or-dl--divided')
    expect(dl).toHaveClass('or-dl--sm')
  })

  it('repassa ref e atributos', () => {
    const ref = createRef<HTMLDListElement>()
    render(<DescriptionList ref={ref} items={items} aria-label="Resumo da assinatura" />)
    expect(ref.current?.tagName).toBe('DL')
    expect(ref.current).toHaveAttribute('aria-label', 'Resumo da assinatura')
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <DescriptionList items={items} />
        <DescriptionList layout="grid" items={items} />
        <DescriptionList layout="vertical">
          <DescriptionGroup>
            <DescriptionTerm>Status</DescriptionTerm>
            <DescriptionDetails>Ativo</DescriptionDetails>
          </DescriptionGroup>
        </DescriptionList>
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
