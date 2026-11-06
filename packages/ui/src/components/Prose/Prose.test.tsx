import { render, screen } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRef } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { Blockquote } from '../Blockquote'
import { Heading } from '../Typography'
import { Prose } from './Prose'

// O Vitest não carrega CSS (css: false); para verificar quais elementos o Prose
// estiliza, o arquivo é injetado no documento e lido com getComputedStyle.
// String (não `new URL`): no ambiente jsdom o URL global é o do jsdom.
const css = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'Prose.css'), 'utf8')

function injectProseCss() {
  const style = document.createElement('style')
  style.textContent = css
  document.head.appendChild(style)
  return style
}

const styleOf = (element: Element, property: string) =>
  getComputedStyle(element).getPropertyValue(property)

const releaseNotes = `
  <h2>Novidades da versão 3.8</h2>
  <p>Esta versão traz a <strong>exportação agendada</strong> de relatórios e corrige a paginação da busca.</p>
  <ul>
    <li>Agende exportações diárias ou semanais em <code>Relatórios › Agendamentos</code>.</li>
    <li>Atalho <kbd>Ctrl</kbd> + <kbd>E</kbd> para exportar a visão atual.</li>
  </ul>
  <pre><code>GET /v2/relatorios?formato=csv</code></pre>
`

describe('Prose', () => {
  let style: HTMLStyleElement | undefined

  afterEach(() => {
    style?.remove()
    style = undefined
  })

  it('renderiza um div com tamanho md e medida de leitura por padrão', () => {
    const { container } = render(
      <Prose>
        <p>Conteúdo do artigo.</p>
      </Prose>,
    )
    const root = container.firstElementChild!
    expect(root.tagName).toBe('DIV')
    expect(root).toHaveClass('or-prose', 'or-prose--md', 'or-prose--measure')
    expect(screen.getByText('Conteúdo do artigo.').tagName).toBe('P')
  })

  it('aplica size e ocupa toda a largura com measure={false}', () => {
    const { container, rerender } = render(<Prose size="sm" measure={false} />)
    expect(container.firstElementChild).toHaveClass('or-prose--sm')
    expect(container.firstElementChild).not.toHaveClass('or-prose--measure')
    rerender(<Prose size="lg" />)
    expect(container.firstElementChild).toHaveClass('or-prose--lg', 'or-prose--measure')
  })

  it('troca o elemento com `as` e repassa ref, className e atributos', () => {
    const ref = createRef<HTMLElement>()
    render(
      <Prose ref={ref} as="article" className="artigo" aria-labelledby="titulo" data-testid="prose">
        <h1 id="titulo">Como exportar relatórios</h1>
      </Prose>,
    )
    const article = screen.getByRole('article', { name: 'Como exportar relatórios' })
    expect(ref.current).toBe(article)
    expect(article).toBe(screen.getByTestId('prose'))
    expect(article).toHaveClass('or-prose', 'artigo')
  })

  it('aceita HTML pronto via dangerouslySetInnerHTML', () => {
    render(<Prose dangerouslySetInnerHTML={{ __html: releaseNotes }} />)
    expect(
      screen.getByRole('heading', { level: 2, name: 'Novidades da versão 3.8' }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByText('GET /v2/relatorios?formato=csv').closest('pre')).toBeInTheDocument()
  })

  it('estiliza os elementos do conteúdo, mas não componentes do Orange nem .or-not-prose', () => {
    style = injectProseCss()
    render(
      <Prose>
        <h2>Título do conteúdo</h2>
        <Heading level={2}>Título do componente</Heading>
        <div className="or-not-prose">
          <h2>Título fora do Prose</h2>
          <ul>
            <li>Item sem estilo</li>
          </ul>
        </div>
        <div className="painel or-not-prose">
          <h3>Classe do Orange depois de outra classe</h3>
        </div>
        <h3 className="titulo-cms">Classe do CMS</h3>
      </Prose>,
    )
    const display = 'var(--or-font-display)'
    expect(styleOf(screen.getByText('Título do conteúdo'), 'font-family')).toBe(display)
    expect(styleOf(screen.getByText('Classe do CMS'), 'font-family')).toBe(display)
    expect(styleOf(screen.getByText('Título do componente'), 'font-family')).toBe('')
    expect(styleOf(screen.getByText('Título fora do Prose'), 'font-family')).toBe('')
    expect(
      styleOf(screen.getByText('Classe do Orange depois de outra classe'), 'font-family'),
    ).toBe('')
    expect(styleOf(screen.getByText('Item sem estilo').parentElement!, 'list-style-type')).not.toBe(
      'square',
    )
  })

  it('listas mantêm marcadores nativos e respeitam ol[type]; a List do Orange fica de fora', () => {
    style = injectProseCss()
    const { container } = render(
      <Prose>
        <ul data-testid="ul">
          <li>Item</li>
        </ul>
        <ol data-testid="ol">
          <li>Passo</li>
        </ol>
        <ol type="a" data-testid="ol-a">
          <li>Alínea</li>
        </ol>
        <ul className="or-list or-list--bullet" role="list" data-testid="or-list">
          <li className="or-list__item">Item da List</li>
        </ul>
      </Prose>,
    )
    expect(styleOf(screen.getByTestId('ul'), 'list-style-type')).toBe('square')
    expect(styleOf(screen.getByTestId('ol'), 'list-style-type')).toBe('or-prose-decimal')
    expect(styleOf(screen.getByTestId('ol-a'), 'list-style-type')).not.toBe('or-prose-decimal')
    expect(styleOf(screen.getByTestId('or-list'), 'list-style-type')).not.toBe('square')
    // Itens de listas do Orange não recebem o recuo do Prose.
    const items = container.querySelectorAll('li')
    expect(styleOf(items[0], 'padding-inline-start')).toBe('0.375em')
    expect(styleOf(items[3], 'padding-inline-start')).toBe('')
  })

  it('tabelas largas rolam dentro delas mesmas; o Table do Orange fica de fora', () => {
    style = injectProseCss()
    render(
      <Prose>
        <table data-testid="cms">
          <thead>
            <tr>
              <th>Formato</th>
              <th>Limite</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>CSV</td>
              <td>1 milhão de linhas</td>
            </tr>
          </tbody>
        </table>
        <table className="or-table" data-testid="orange">
          <tbody>
            <tr>
              <td>Célula</td>
            </tr>
          </tbody>
        </table>
      </Prose>,
    )
    const table = screen.getByTestId('cms')
    expect(styleOf(table, 'display')).toBe('block')
    expect(styleOf(table, 'overflow-x')).toBe('auto')
    expect(styleOf(table, 'max-width')).toBe('100%')
    expect(styleOf(screen.getByText('Formato'), 'text-transform')).toBe('uppercase')
    expect(styleOf(screen.getByTestId('orange'), 'display')).not.toBe('block')
    expect(styleOf(screen.getByText('Célula'), 'vertical-align')).not.toBe('top')
  })

  it('o Blockquote dentro do Prose mantém o próprio estilo', () => {
    style = injectProseCss()
    const { container } = render(
      <Prose>
        <blockquote data-testid="cms">Citação do CMS</blockquote>
        <Blockquote source="Equipe de Suporte">Citação do componente</Blockquote>
      </Prose>,
    )
    expect(styleOf(screen.getByTestId('cms'), 'border-inline-start')).toContain(
      'var(--or-color-accent)',
    )
    expect(styleOf(container.querySelector('figure')!, 'border-inline-start')).toBe('')
    expect(styleOf(container.querySelector('figure > blockquote')!, 'border-inline-start')).toBe('')
  })

  it('todos os seletores de elemento usam :where() (especificidade 0,1,0)', () => {
    style = injectProseCss()
    const selectors: string[] = []
    const collect = (rules: CSSRuleList) => {
      for (const rule of Array.from(rules)) {
        if (rule instanceof CSSStyleRule) {
          // Normaliza as quebras de linha do Prettier: `:not(\n  :where(…)\n)` → `:not(:where(…))`.
          selectors.push(
            rule.selectorText
              .replace(/\s+/g, ' ')
              .replace(/\(\s+/g, '(')
              .replace(/\s+\)/g, ')')
              .trim(),
          )
        } else if (rule instanceof CSSMediaRule) collect(rule.cssRules)
      }
    }
    collect(style.sheet!.cssRules)
    const elementSelectors = selectors.filter(
      (selector) => !selector.startsWith('@') && !/^\.or-prose(--[a-z]+)?$/.test(selector),
    )
    expect(elementSelectors.length).toBeGreaterThan(40)
    const lowSpecificity =
      /^\.or-prose (> )?:where\(.+\)(:not\(:where\(.+\)\))?(::(marker|before))?$/
    expect(elementSelectors.filter((selector) => !lowSpecificity.test(selector))).toEqual([])
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <Prose as="article" aria-labelledby="artigo-titulo">
        <h1 id="artigo-titulo">Como exportar relatórios de vendas</h1>
        <p>
          Você pode exportar qualquer relatório em <strong>CSV</strong>, <strong>XLSX</strong> ou{' '}
          <strong>PDF</strong>. Veja também a{' '}
          <a href="/ajuda/agendamentos">central de agendamentos</a>.
        </p>
        <h2>Passo a passo</h2>
        <ol>
          <li>
            Abra <em>Relatórios</em> e escolha o período.
          </li>
          <li>
            Pressione{' '}
            <kbd>
              <kbd>Ctrl</kbd>+<kbd>E</kbd>
            </kbd>{' '}
            ou clique em <mark>Exportar</mark>.
          </li>
        </ol>
        <blockquote>
          <p>Arquivos ficam disponíveis por 7 dias.</p>
        </blockquote>
        <pre tabIndex={0}>
          <code>relatorio-vendas-2026-11.csv</code>
        </pre>
        <table>
          <caption>Limites por formato</caption>
          <thead>
            <tr>
              <th scope="col">Formato</th>
              <th scope="col">Limite</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>CSV</td>
              <td>1 milhão de linhas</td>
            </tr>
          </tbody>
        </table>
        <dl>
          <dt>Exportação agendada</dt>
          <dd>Gerada automaticamente e enviada por e-mail.</dd>
        </dl>
        <hr />
        <p>
          <small>Atualizado em 6 de novembro de 2026.</small>
        </p>
      </Prose>,
    )
    await expectNoA11yViolations(container)
  })
})
