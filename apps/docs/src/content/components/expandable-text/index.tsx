import { Bullets, Code, ComponentPage, Example, KeyboardTable, PropsTable, Section, WcagList } from '../../../kit'
import { T } from '../../../i18n'
import Controlled from './examples/Controlled'
import ControlledCode from './examples/Controlled?raw'
import CustomLabels from './examples/CustomLabels'
import CustomLabelsCode from './examples/CustomLabels?raw'
import Paragraphs from './examples/Paragraphs'
import ParagraphsCode from './examples/Paragraphs?raw'
import Review from './examples/Review'
import ReviewCode from './examples/Review?raw'
import { meta } from './meta'

export default function ExpandableTextPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use para textos longos que nem todos precisam ler inteiros: avaliações, descrições de produto, notas de versão.',
              en: 'Use it for long text not everyone needs to read in full: reviews, product descriptions, release notes.',
            },
            {
              pt: 'Mostre linhas suficientes para a pessoa decidir se quer continuar — 3 é um bom padrão.',
              en: 'Show enough lines for people to decide whether to keep reading — 3 is a good default.',
            },
            {
              pt: (
                <>
                  Em listas com vários textos expansíveis, use <strong>showMoreLabel</strong> para dar contexto ao botão
                  ("Ler notas da v3.2.0" em vez de vários "Mostrar mais").
                </>
              ),
              en: (
                <>
                  In lists with several expandable texts, use <strong>showMoreLabel</strong> to give the button context ("Read
                  v3.2.0 notes" instead of many "Show more").
                </>
              ),
            },
            {
              pt: 'Não esconda informações críticas (preços, prazos, avisos legais obrigatórios) atrás do botão.',
              en: 'Never hide critical information (prices, deadlines, mandatory legal notices) behind the button.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Avaliação de produto', en: 'Product review' }}
          description={{
            pt: 'Recolhido em 3 linhas. O botão só aparece porque o texto transborda — redimensione a janela para ver.',
            en: 'Collapsed to 3 lines. The button only appears because the text overflows — resize the window to see.',
          }}
          code={ReviewCode}
        >
          <Review />
        </Example>
        <Example
          title={{ pt: 'Vários parágrafos', en: 'Several paragraphs' }}
          description={{ pt: 'O conteúdo pode ter marcação própria; o corte conta as linhas de todos os blocos.', en: 'Content can have its own markup; clamping counts lines across blocks.' }}
          code={ParagraphsCode}
        >
          <Paragraphs />
        </Example>
        <Example
          title={{ pt: 'Rótulos com contexto', en: 'Labels with context' }}
          description={{
            pt: 'O segundo item é curto e não mostra botão.',
            en: 'The second item is short and shows no button.',
          }}
          code={CustomLabelsCode}
        >
          <CustomLabels />
        </Example>
        <Example
          title={{ pt: 'Controlado', en: 'Controlled' }}
          description={{ pt: 'expanded + onExpandedChange permitem abrir o texto a partir de outra ação.', en: 'expanded + onExpandedChange let another action open the text.' }}
          code={ControlledCode}
        >
          <Controlled />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'lines', type: 'number', default: '3', description: { pt: 'Linhas visíveis quando recolhido.', en: 'Visible lines when collapsed.' } },
            { name: 'expanded', type: 'boolean', description: { pt: 'Estado expandido (controlado).', en: 'Expanded state (controlled).' } },
            { name: 'defaultExpanded', type: 'boolean', default: 'false', description: { pt: 'Estado inicial.', en: 'Initial state.' } },
            { name: 'onExpandedChange', type: '(expanded: boolean) => void', description: { pt: 'Chamado ao expandir/recolher.', en: 'Called on expand/collapse.' } },
            { name: 'as', type: 'ElementType', default: "'div'", description: { pt: 'Elemento que envolve o texto.', en: 'Element wrapping the text.' } },
            { name: 'showMoreLabel', type: 'string', default: "t('showMore')", description: { pt: 'Rótulo do botão recolhido.', en: 'Collapsed button label.' } },
            { name: 'showLessLabel', type: 'string', default: "t('showLess')", description: { pt: 'Rótulo do botão expandido.', en: 'Expanded button label.' } },
            { name: '...rest', type: 'HTMLAttributes<HTMLDivElement>', description: { pt: 'Atributos do contêiner.', en: 'Container attributes.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                O botão é um <Code>&lt;button&gt;</Code> nativo com <Code>aria-expanded</Code> e <Code>aria-controls</Code> apontando
                para o conteúdo. O texto completo permanece no DOM mesmo recolhido, então leitores de tela sempre têm acesso a ele.
                Os rótulos padrão vêm de <Code>t('showMore')</Code>/<Code>t('showLess')</Code> e seguem o idioma do provider.
              </>
            }
            en={
              <>
                The button is a native <Code>&lt;button&gt;</Code> with <Code>aria-expanded</Code> and <Code>aria-controls</Code>{' '}
                pointing to the content. The full text stays in the DOM even when collapsed, so screen readers always have access
                to it. Default labels come from <Code>t('showMore')</Code>/<Code>t('showLess')</Code> and follow the provider
                language.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Move o foco para o botão.', en: 'Moves focus to the button.' } },
            { keys: ['Enter'], description: { pt: 'Expande ou recolhe o texto.', en: 'Expands or collapses the text.' } },
            { keys: ['Space'], description: { pt: 'Expande ou recolhe o texto.', en: 'Expands or collapses the text.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Relação entre botão e conteúdo exposta com aria-controls.', en: 'Button/content relationship exposed with aria-controls.' } },
            { criterion: '2.4.6', description: { pt: 'Rótulos personalizáveis para dar contexto em listas.', en: 'Customizable labels give context in lists.' } },
            { criterion: '2.5.8', description: { pt: 'Botão com área mínima de 24px de altura.', en: 'Button with a minimum 24px target height.' } },
            { criterion: '4.1.2', description: { pt: 'Estado exposto com aria-expanded.', en: 'State exposed with aria-expanded.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
