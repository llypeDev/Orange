import { Bullets, Code, ComponentPage, DoDont, Example, PropsTable, Section, WcagList } from '../../../kit'
import { T } from '../../../i18n'
import Context from './examples/Context'
import ContextCode from './examples/Context?raw'
import Focusable from './examples/Focusable'
import FocusableCode from './examples/Focusable?raw'
import IconLabel from './examples/IconLabel'
import IconLabelCode from './examples/IconLabel?raw'
import { meta } from './meta'

export default function VisuallyHiddenPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use para completar o contexto que a interface já transmite visualmente — por exemplo, "Ler mais sobre <título>".',
              en: 'Use it to complete context the interface already conveys visually — for example, "Read more about <title>".',
            },
            {
              pt: (
                <>
                  Prefira rótulos visíveis. Esconder texto é exceção, não regra: se o rótulo ajuda todo mundo, mostre-o.
                </>
              ),
              en: <>Prefer visible labels. Hiding text is the exception: if a label helps everyone, show it.</>,
            },
            {
              pt: (
                <>
                  Não use <Code>display: none</Code> nem <Code>hidden</Code> para isso — eles escondem também dos leitores
                  de tela.
                </>
              ),
              en: (
                <>
                  Don't use <Code>display: none</Code> or <Code>hidden</Code> for this — they hide content from screen
                  readers too.
                </>
              ),
            },
            {
              pt: 'Nunca esconda conteúdo focável sem a prop focusable: o foco ficaria invisível (WCAG 2.4.7).',
              en: 'Never hide focusable content without the focusable prop: focus would become invisible (WCAG 2.4.7).',
            },
          ]}
        />
        <DoDont
          doItems={[
            {
              pt: 'Links repetidos como "Ler mais" com o complemento oculto que diz a qual item se referem.',
              en: 'Repeated links such as "Read more" with a hidden suffix naming the item.',
            },
          ]}
          dontItems={[
            {
              pt: 'Esconder instruções importantes que pessoas videntes também precisariam ler.',
              en: 'Hiding important instructions that sighted people would also need to read.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Rótulo para ícone com contador', en: 'Label for an icon with a counter' }}
          description={{
            pt: 'O número visível é decorativo; o leitor de tela ouve "Carrinho com 3 itens".',
            en: 'The visible number is decorative; screen readers hear "Cart with 3 items".',
          }}
          code={IconLabelCode}
        >
          <IconLabel />
        </Example>
        <Example
          title={{ pt: 'Contexto para links repetidos', en: 'Context for repeated links' }}
          description={{
            pt: 'Na lista de links do leitor de tela, cada "Ler mais" ganha um nome único.',
            en: 'In the screen reader links list, each "Read more" gets a unique name.',
          }}
          code={ContextCode}
        >
          <Context />
        </Example>
        <Example
          title={{ pt: 'Visível ao receber foco', en: 'Visible on focus' }}
          description={{
            pt: 'Com focusable, o conteúdo aparece quando recebe foco do teclado — a base do SkipLink.',
            en: 'With focusable, content appears when it receives keyboard focus — the basis of SkipLink.',
          }}
          code={FocusableCode}
        >
          <Focusable />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'as', type: 'ElementType', default: "'span'", description: { pt: 'Elemento renderizado.', en: 'Rendered element.' } },
            {
              name: 'focusable',
              type: 'boolean',
              default: 'false',
              description: { pt: 'Torna o conteúdo visível quando recebe foco.', en: 'Makes the content visible when focused.' },
            },
            { name: '...rest', type: 'HTMLAttributes', description: { pt: 'Atributos nativos repassados.', en: 'Native attributes passed through.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                Usa a técnica de recorte (<Code>clip</Code> + 1px) em vez de <Code>display: none</Code>, então o texto
                permanece na árvore de acessibilidade. Também disponível como classe utilitária{' '}
                <Code>.or-visually-hidden</Code>.
              </>
            }
            en={
              <>
                Uses the clipping technique (<Code>clip</Code> + 1px) instead of <Code>display: none</Code>, so the text
                stays in the accessibility tree. Also available as the <Code>.or-visually-hidden</Code> utility class.
              </>
            }
          />
        </p>
        <WcagList
          items={[
            {
              criterion: '1.1.1',
              description: { pt: 'Alternativa em texto para ícones e conteúdo não textual.', en: 'Text alternative for icons and non-text content.' },
            },
            {
              criterion: '2.4.4',
              description: { pt: 'Propósito do link claro no seu contexto.', en: 'Link purpose clear in context.' },
            },
            {
              criterion: '2.4.7',
              description: { pt: 'Com focusable, o foco nunca fica invisível.', en: 'With focusable, focus is never invisible.' },
            },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
