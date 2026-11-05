import {
  Bullets,
  Callout,
  Code,
  CodeBlock,
  ComponentPage,
  DefinitionTable,
  DoDont,
  Example,
  KeyboardTable,
  PropsTable,
  Section,
  WcagList,
} from '../../../kit'
import { T } from '../../../i18n'
import { Button, Stack } from '@orangesys/ui'
import Alinhamento from './examples/Alinhamento'
import AlinhamentoCode from './examples/Alinhamento?raw'
import Configuracoes from './examples/Configuracoes'
import ConfiguracoesCode from './examples/Configuracoes?raw'
import DirecaoResponsiva from './examples/DirecaoResponsiva'
import DirecaoResponsivaCode from './examples/DirecaoResponsiva?raw'
import Separadores from './examples/Separadores'
import SeparadoresCode from './examples/Separadores?raw'
import { meta } from './meta'

const revealCode = `import { Reveal, Stack } from '@orangesys/ui'

// Reveal com stagger escalona os filhos diretos DELE. Para escalonar os
// itens de uma Stack, envolva cada item em um Reveal com index:
<Stack gap={4}>
  {passos.map((passo, i) => (
    <Reveal key={passo.id} index={i}>
      <PassoDoCadastro {...passo} />
    </Reveal>
  ))}
</Stack>

// Em listas, o Reveal vira o próprio <li>:
<Stack as="ul" gap={4} aria-label="Próximos passos">
  {passos.map((passo, i) => (
    <Reveal as="li" key={passo.id} index={i}>{passo.titulo}</Reveal>
  ))}
</Stack>`

export default function StackPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use Stack para qualquer sequência em uma dimensão: campos de um formulário, seções de uma página, grupos de botões, metadados em linha. Para linhas e colunas ao mesmo tempo, use Grid.',
              en: 'Use Stack for any one-dimensional sequence: form fields, page sections, button groups, inline metadata. For rows and columns at once, use Grid.',
            },
            {
              pt: (
                <>
                  Prefira <Code>gap</Code> a margens nos filhos: o espaço fica num lugar só e segue
                  a escala (<Code>4</Code> = 16px, <Code>6</Code> = 24px, <Code>8</Code> = 32px).
                </>
              ),
              en: (
                <>
                  Prefer <Code>gap</Code> over margins on children: spacing lives in one place and
                  follows the scale (<Code>4</Code> = 16px, <Code>6</Code> = 24px, <Code>8</Code> =
                  32px).
                </>
              ),
            },
            {
              pt: (
                <>
                  O padrão mais comum é <strong>empilhado no celular, em linha no desktop</strong>:{' '}
                  <Code>{"direction={{ base: 'vertical', md: 'horizontal' }}"}</Code>. Breakpoints:
                  sm 640px, md 768px, lg 1024px, xl 1280px (largura da janela).
                </>
              ),
              en: (
                <>
                  The most common pattern is <strong>stacked on mobile, in a row on desktop</strong>
                  : <Code>{"direction={{ base: 'vertical', md: 'horizontal' }}"}</Code>.
                  Breakpoints: sm 640px, md 768px, lg 1024px, xl 1280px (window width).
                </>
              ),
            },
            {
              pt: (
                <>
                  Escolha o elemento com <Code>as</Code>: <Code>ul</Code>/<Code>ol</Code> para
                  listas (com itens <Code>li</Code>), <Code>nav</Code> para grupos de links,{' '}
                  <Code>section</Code> com título para regiões.
                </>
              ),
              en: (
                <>
                  Pick the element with <Code>as</Code>: <Code>ul</Code>/<Code>ol</Code> for lists
                  (with <Code>li</Code> items), <Code>nav</Code> for groups of links,{' '}
                  <Code>section</Code> with a heading for regions.
                </>
              ),
            },
            {
              pt: (
                <>
                  Não existe <Code>reverse</Code>, de propósito: a ordem visual é sempre a ordem do
                  código. Se o item precisa aparecer antes, mude-o de lugar no JSX — assim leitores
                  de tela e o Tab seguem a mesma ordem que os olhos (WCAG 1.3.2).
                </>
              ),
              en: (
                <>
                  There is no <Code>reverse</Code>, on purpose: the visual order is always the
                  source order. If an item must come first, move it in the JSX — so screen readers
                  and Tab follow the same order as the eyes (WCAG 1.3.2).
                </>
              ),
            },
          ]}
        />
        <DoDont
          doExample={
            <Stack direction="horizontal" gap={3}>
              <Button variant="outline">Cancelar</Button>
              <Button>Salvar</Button>
            </Stack>
          }
          dontExample={
            <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: 12 }}>
              <Button>Salvar</Button>
              <Button variant="outline">Cancelar</Button>
            </div>
          }
          doItems={[
            { pt: 'A ordem do código é a ordem da tela.', en: 'Source order is screen order.' },
          ]}
          dontItems={[
            {
              pt: 'row-reverse: o Tab vai de Salvar para Cancelar, ao contrário do que se vê.',
              en: 'row-reverse: Tab goes from Save to Cancel, the opposite of what is seen.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Opções de layout', en: 'Layout options' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: <Code>direction</Code>, en: <Code>direction</Code> },
              description: {
                pt: 'vertical (coluna, padrão) ou horizontal (linha). Responsivo.',
                en: 'vertical (column, default) or horizontal (row). Responsive.',
              },
            },
            {
              term: { pt: <Code>gap</Code>, en: <Code>gap</Code> },
              description: {
                pt: 'Escala de espaço: 0, 1, 2, 3, 4 (padrão, 16px), 5, 6, 8, 10, 12, 16. Responsivo.',
                en: 'Space scale: 0, 1, 2, 3, 4 (default, 16px), 5, 6, 8, 10, 12, 16. Responsive.',
              },
            },
            {
              term: { pt: <Code>align</Code>, en: <Code>align</Code> },
              description: {
                pt: 'Eixo cruzado: start, center, end, stretch (padrão) e baseline.',
                en: 'Cross axis: start, center, end, stretch (default) and baseline.',
              },
            },
            {
              term: { pt: <Code>justify</Code>, en: <Code>justify</Code> },
              description: {
                pt: 'Eixo principal: start (padrão), center, end, between, around e evenly.',
                en: 'Main axis: start (default), center, end, between, around and evenly.',
              },
            },
            {
              term: { pt: <Code>separator</Code>, en: <Code>separator</Code> },
              description: {
                pt: 'Linha de 1px entre os filhos, com gap de cada lado. Acompanha a direção sozinha, inclusive a responsiva.',
                en: 'A 1px line between children, with gap on each side. Follows the direction by itself, including responsive direction.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Página de configurações', en: 'Settings page' }}
          description={{
            pt: 'Stacks aninhadas montam a seção inteira: título, lista de preferências com separadores e ações alinhadas à direita — sem nenhuma linha de CSS.',
            en: 'Nested stacks build the whole section: heading, a list of preferences with separators and right-aligned actions — without a single line of CSS.',
          }}
          code={ConfiguracoesCode}
          align="stretch"
        >
          <Configuracoes />
        </Example>
        <Example
          title={{ pt: 'Direção responsiva', en: 'Responsive direction' }}
          description={{
            pt: 'Empilhado no celular, em linha a partir de 768px (md), com o gap crescendo junto. Redimensione a janela para ver a troca — os breakpoints olham a largura da janela, não a da prévia.',
            en: 'Stacked on mobile, in a row from 768px (md) up, with the gap growing too. Resize the window to see it switch — breakpoints look at the window width, not the preview width.',
          }}
          code={DirecaoResponsivaCode}
          align="stretch"
        >
          <DirecaoResponsiva />
        </Example>
        <Example
          title={{ pt: 'Alinhamento e distribuição', en: 'Alignment and distribution' }}
          description={{
            pt: 'justify="between" separa dois grupos numa barra de ações; wrap deixa o segundo grupo descer quando falta espaço. align="baseline" alinha textos de tamanhos diferentes.',
            en: 'justify="between" splits two groups in an action bar; wrap lets the second group drop down when space runs out. align="baseline" aligns text of different sizes.',
          }}
          code={AlinhamentoCode}
          align="stretch"
        >
          <Alinhamento />
        </Example>
        <Example
          title={{ pt: 'Separadores e semântica', en: 'Separators and semantics' }}
          description={{
            pt: 'Na horizontal, o separador vira uma linha vertical. Com as="nav", a pilha vira um landmark de navegação — dê um nome com aria-label.',
            en: 'In a row, the separator becomes a vertical line. With as="nav", the stack becomes a navigation landmark — name it with aria-label.',
          }}
          code={SeparadoresCode}
          align="stretch"
        >
          <Separadores />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Stack', en: 'Stack' },
              description: {
                pt: 'Sem movimento próprio. Trocas de direção, gap ou separadores por breakpoint acontecem na hora — animar layout (largura, posição) custa caro e desorienta.',
                en: 'No motion of its own. Direction, gap or separator changes per breakpoint happen instantly — animating layout (width, position) is expensive and disorienting.',
              },
            },
            {
              term: { pt: 'Entrada dos itens', en: 'Items entering' },
              description: {
                pt: 'Combine com Reveal: cada item envolto em <Reveal index={i}> sobe 24px e aparece em 600ms, 80ms (--or-stagger) depois do anterior. O Reveal com stagger só escalona os filhos diretos dele, por isso o index em cada item.',
                en: 'Combine with Reveal: each item wrapped in <Reveal index={i}> rises 24px and fades in over 600ms, 80ms (--or-stagger) after the previous one. Reveal with stagger only staggers its own direct children, hence the index on each item.',
              },
            },
            {
              term: { pt: 'Movimento reduzido', en: 'Reduced motion' },
              description: {
                pt: 'O Reveal mostra tudo de imediato; o layout não muda.',
                en: 'Reveal shows everything immediately; the layout does not change.',
              },
            },
          ]}
        />
        <CodeBlock code={revealCode} language="tsx" title="Stack + Reveal" />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            {
              name: 'as',
              type: 'ElementType',
              default: "'div'",
              description: {
                pt: (
                  <>
                    Elemento renderizado. <Code>ul</Code>/<Code>ol</Code> recebem{' '}
                    <Code>role="list"</Code>.
                  </>
                ),
                en: (
                  <>
                    Rendered element. <Code>ul</Code>/<Code>ol</Code> get <Code>role="list"</Code>.
                  </>
                ),
              },
            },
            {
              name: 'direction',
              type: "ResponsiveValue<'vertical' | 'horizontal'>",
              default: "'vertical'",
              description: {
                pt: 'Eixo principal; aceita um valor por breakpoint.',
                en: 'Main axis; accepts one value per breakpoint.',
              },
            },
            {
              name: 'gap',
              type: 'ResponsiveValue<LayoutGap>',
              default: '4',
              description: {
                pt: 'Espaço entre os filhos (0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16).',
                en: 'Space between children (0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16).',
              },
            },
            {
              name: 'align',
              type: "'start' | 'center' | 'end' | 'stretch' | 'baseline'",
              default: "'stretch'",
              description: { pt: 'Alinhamento no eixo cruzado.', en: 'Cross-axis alignment.' },
            },
            {
              name: 'justify',
              type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'",
              default: "'start'",
              description: { pt: 'Distribuição no eixo principal.', en: 'Main-axis distribution.' },
            },
            {
              name: 'wrap',
              type: 'boolean',
              default: 'false',
              description: {
                pt: 'Quebra os filhos em novas linhas.',
                en: 'Wraps children onto new lines.',
              },
            },
            {
              name: 'separator',
              type: 'boolean',
              default: 'false',
              description: {
                pt: 'Linha decorativa de 1px entre os filhos. Pensada para pilhas sem wrap.',
                en: 'Decorative 1px line between children. Meant for stacks without wrap.',
              },
            },
            {
              name: '...rest',
              type: 'HTMLAttributes<HTMLElement>',
              description: {
                pt: 'Atributos do elemento (aria-label, id…).',
                en: 'Element attributes (aria-label, id…).',
              },
            },
          ]}
        />
        <PropsTable
          caption={{
            pt: 'Tipos compartilhados (Stack e Grid)',
            en: 'Shared types (Stack and Grid)',
          }}
          rows={[
            {
              name: 'ResponsiveValue<T>',
              type: 'T | { base?: T; sm?: T; md?: T; lg?: T; xl?: T }',
              description: {
                pt: 'Mobile-first: cada breakpoint vale daquela largura para cima, até o próximo definido.',
                en: 'Mobile-first: each breakpoint applies from that width up, until the next one defined.',
              },
            },
            {
              name: 'LayoutGap',
              type: '0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16',
              description: {
                pt: (
                  <>
                    Passos de <Code>--or-space-*</Code>.
                  </>
                ),
                en: (
                  <>
                    Steps of <Code>--or-space-*</Code>.
                  </>
                ),
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                A Stack é puramente visual: a semântica vem do elemento escolhido em <Code>as</Code>
                . Listas mantêm a semântica — como o <Code>list-style: none</Code> faz o Safari
                esquecer que é uma lista, a Stack adiciona <Code>role="list"</Code>. Os separadores
                são decorativos (<Code>aria-hidden</Code>); dentro de listas eles são{' '}
                <Code>&lt;li&gt;</Code> ocultos, então a contagem de itens anunciada não muda.
              </>
            }
            en={
              <>
                Stack is purely visual: semantics come from the element chosen in <Code>as</Code>.
                Lists keep their semantics — since <Code>list-style: none</Code> makes Safari forget
                it is a list, Stack adds <Code>role="list"</Code>. Separators are decorative (
                <Code>aria-hidden</Code>); inside lists they are hidden <Code>&lt;li&gt;</Code>{' '}
                elements, so the announced item count does not change.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            {
              keys: ['Tab'],
              description: {
                pt: 'Percorre os elementos focáveis na ordem do código — a mesma ordem da tela, em qualquer direção.',
                en: 'Moves through focusable elements in source order — the same order as on screen, in any direction.',
              },
            },
          ]}
        />
        <Callout
          tone="info"
          title={{ pt: 'Por que não há reverse', en: 'Why there is no reverse' }}
        >
          <T
            pt="row-reverse e column-reverse invertem só o desenho: leitores de tela e o foco do teclado continuam na ordem do código. Quem enxerga e usa teclado vê o foco pular para trás. Reordene o JSX."
            en="row-reverse and column-reverse only flip the drawing: screen readers and keyboard focus keep source order. Sighted keyboard users see focus jump backwards. Reorder the JSX instead."
          />
        </Callout>
        <WcagList
          items={[
            {
              criterion: '1.3.1',
              description: {
                pt: 'Estrutura real com as (ul, ol, nav, section); listas mantêm role="list".',
                en: 'Real structure via as (ul, ol, nav, section); lists keep role="list".',
              },
            },
            {
              criterion: '1.3.2',
              description: {
                pt: 'Sem reverse: ordem visual igual à ordem de leitura.',
                en: 'No reverse: visual order matches reading order.',
              },
            },
            {
              criterion: '1.4.10',
              description: {
                pt: 'Direção responsiva empilha o conteúdo em telas estreitas, sem rolagem horizontal a 320px.',
                en: 'Responsive direction stacks content on narrow screens, with no horizontal scrolling at 320px.',
              },
            },
            {
              criterion: '2.4.3',
              description: {
                pt: 'A ordem do foco segue a ordem visual.',
                en: 'Focus order follows visual order.',
              },
            },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
