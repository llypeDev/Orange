import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { Grid, GridItem } from './Grid'

describe('Grid', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renderiza um <div> com as classes padrão e sem estilo inline', () => {
    render(<Grid data-testid="grid" />)
    const grid = screen.getByTestId('grid')
    expect(grid.tagName).toBe('DIV')
    expect(grid).toHaveClass('or-grid', 'or-grid--plain')
    expect(grid).not.toHaveAttribute('style')
  })

  it('columns numérico vira a variável base', () => {
    render(<Grid data-testid="grid" columns={3} />)
    const grid = screen.getByTestId('grid')
    expect(grid.style.getPropertyValue('--_grid-cols')).toBe('3')
    expect(grid.className).not.toMatch(/or-grid--cols-/)
  })

  it('columns responsivo: variável e classe por breakpoint informado', () => {
    render(<Grid data-testid="grid" columns={{ base: 1, sm: 2, lg: 4 }} />)
    const grid = screen.getByTestId('grid')
    expect(grid.style.getPropertyValue('--_grid-cols')).toBe('1')
    expect(grid.style.getPropertyValue('--_grid-cols-sm')).toBe('2')
    expect(grid.style.getPropertyValue('--_grid-cols-lg')).toBe('4')
    expect(grid).toHaveClass('or-grid--cols-sm', 'or-grid--cols-lg')
    expect(grid).not.toHaveClass('or-grid--cols-md')
  })

  it('minItemWidth usa colunas automáticas e tem prioridade sobre columns', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(<Grid data-testid="grid" minItemWidth="14rem" columns={{ base: 1, md: 3 }} />)
    const grid = screen.getByTestId('grid')
    expect(grid).toHaveClass('or-grid--auto')
    expect(grid.style.getPropertyValue('--_grid-min')).toBe('14rem')
    expect(grid.style.getPropertyValue('--_grid-cols')).toBe('')
    expect(grid).not.toHaveClass('or-grid--cols-md')
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('minItemWidth'))
  })

  it('gap vale para os dois eixos; rowGap e columnGap substituem cada eixo', () => {
    render(
      <>
        <Grid data-testid="a" gap={{ base: 3, md: 6 }} />
        <Grid data-testid="b" gap={8} rowGap={2} columnGap={{ base: 4, xl: 12 }} />
      </>,
    )
    const a = screen.getByTestId('a')
    expect(a.style.getPropertyValue('--_grid-row-gap')).toBe('var(--or-space-3)')
    expect(a.style.getPropertyValue('--_grid-col-gap-md')).toBe('var(--or-space-6)')
    expect(a).toHaveClass('or-grid--row-gap-md', 'or-grid--col-gap-md')

    const b = screen.getByTestId('b')
    expect(b.style.getPropertyValue('--_grid-row-gap')).toBe('var(--or-space-2)')
    expect(b.style.getPropertyValue('--_grid-col-gap')).toBe('var(--or-space-4)')
    expect(b.style.getPropertyValue('--_grid-col-gap-xl')).toBe('var(--or-space-12)')
    expect(b).toHaveClass('or-grid--col-gap-xl')
    expect(b).not.toHaveClass('or-grid--row-gap-xl')
  })

  it('variant="bordered" aplica a classe de bordas', () => {
    render(<Grid data-testid="grid" variant="bordered" columns={4} />)
    expect(screen.getByTestId('grid')).toHaveClass('or-grid--bordered')
  })

  it('com as="ul" e itens li mantém a semântica de lista', () => {
    render(
      <Grid as="ul" columns={{ base: 1, md: 3 }} aria-label="Produtos">
        <li>Cadeira Flex</li>
        <GridItem as="li" span={2}>
          Mesa Atlas
        </GridItem>
        <li>Luminária Arco</li>
      </Grid>,
    )
    const list = screen.getByRole('list', { name: 'Produtos' })
    expect(list.tagName).toBe('UL')
    expect(list).toHaveAttribute('role', 'list')
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(3)
    expect(items[1]).toHaveClass('or-grid-item')
  })

  it('repassa ref, atributos e mescla o style do usuário', () => {
    const ref = createRef<HTMLElement>()
    render(<Grid ref={ref} as="section" id="vitrine" columns={2} style={{ marginTop: 4 }} />)
    expect(ref.current?.tagName).toBe('SECTION')
    expect(ref.current).toHaveAttribute('id', 'vitrine')
    expect(ref.current?.style.marginTop).toBe('4px')
    expect(ref.current?.style.getPropertyValue('--_grid-cols')).toBe('2')
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <Grid as="dl" variant="bordered" columns={{ base: 2, lg: 4 }} gap={6}>
          <div>
            <dt>Receita do mês</dt>
            <dd>R$ 48,2 mil</dd>
          </div>
          <div>
            <dt>Pedidos</dt>
            <dd>1.284</dd>
          </div>
          <div>
            <dt>Ticket médio</dt>
            <dd>R$ 37,50</dd>
          </div>
        </Grid>
        <Grid as="ul" minItemWidth="12rem" aria-label="Categorias">
          <li>Escritório</li>
          <GridItem as="li" span="full">
            Iluminação
          </GridItem>
        </Grid>
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})

describe('GridItem', () => {
  it('renderiza um <div> sem estilo quando não há span', () => {
    render(<GridItem data-testid="item">Resumo</GridItem>)
    const item = screen.getByTestId('item')
    expect(item.tagName).toBe('DIV')
    expect(item).toHaveClass('or-grid-item')
    expect(item).not.toHaveAttribute('style')
  })

  it('span numérico e full viram valores de grid-column', () => {
    render(
      <>
        <GridItem data-testid="dois" span={2} />
        <GridItem data-testid="linha" span="full" />
      </>,
    )
    expect(screen.getByTestId('dois').style.getPropertyValue('--_grid-span')).toBe(
      'span 2 / span 2',
    )
    expect(screen.getByTestId('linha').style.getPropertyValue('--_grid-span')).toBe('1 / -1')
  })

  it('span responsivo: variável e classe por breakpoint informado', () => {
    render(<GridItem data-testid="item" span={{ base: 'full', md: 2, xl: 3 }} />)
    const item = screen.getByTestId('item')
    expect(item.style.getPropertyValue('--_grid-span')).toBe('1 / -1')
    expect(item.style.getPropertyValue('--_grid-span-md')).toBe('span 2 / span 2')
    expect(item.style.getPropertyValue('--_grid-span-xl')).toBe('span 3 / span 3')
    expect(item).toHaveClass('or-grid-item--span-md', 'or-grid-item--span-xl')
    expect(item).not.toHaveClass('or-grid-item--span-lg')
  })

  it('repassa a ref', () => {
    const ref = createRef<HTMLElement>()
    render(<GridItem ref={ref} as="article" />)
    expect(ref.current?.tagName).toBe('ARTICLE')
  })
})
