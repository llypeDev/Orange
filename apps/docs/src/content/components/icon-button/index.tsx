import {
  Bullets,
  Code,
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
import { IconButton } from '@orange/ui'
import Comparison from './examples/Comparison'
import ComparisonCode from './examples/Comparison?raw'
import RowActions from './examples/RowActions'
import RowActionsCode from './examples/RowActions?raw'
import Sizes from './examples/Sizes'
import SizesCode from './examples/Sizes?raw'
import States from './examples/States'
import StatesCode from './examples/States?raw'
import Variants from './examples/Variants'
import VariantsCode from './examples/Variants?raw'
import { meta } from './meta'

export default function IconButtonPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use só com ícones reconhecidos sem legenda — buscar, fechar, editar, excluir, baixar. Na dúvida, use um Button com texto.',
              en: 'Only use icons that are recognizable without a caption — search, close, edit, delete, download. When in doubt, use a Button with text.',
            },
            {
              pt: (
                <>
                  O <Code>label</Code> descreve a ação, não o desenho: <strong>Excluir arquivo</strong>, não "Lixeira".
                </>
              ),
              en: (
                <>
                  The <Code>label</Code> describes the action, not the drawing: <strong>Delete file</strong>, not "Trash can".
                </>
              ),
            },
            {
              pt: 'Quando a mesma ação se repete por linha, inclua o objeto no rótulo ("Excluir Proposta v3.pdf") para que cada botão seja único.',
              en: 'When the same action repeats on every row, include the object in the label ("Delete Proposal v3.pdf") so every button is unique.',
            },
            {
              pt: 'Combine com um Tooltip para mostrar o rótulo a quem enxerga a tela — o IconButton não depende dele para ser acessível.',
              en: 'Pair it with a Tooltip to show the label to sighted users — IconButton does not depend on it to be accessible.',
            },
          ]}
        />
        <DoDont
          doExample={<IconButton icon="trash" label="Excluir projeto" variant="outline" />}
          dontExample={<IconButton icon="zap" label="Ação" variant="outline" />}
          doItems={[{ pt: 'Ícone conhecido e rótulo com verbo e objeto.', en: 'Familiar icon and a label with verb and object.' }]}
          dontItems={[
            {
              pt: 'Ícone ambíguo com rótulo genérico — ninguém sabe o que acontece no clique.',
              en: 'Ambiguous icon with a generic label — nobody knows what happens on click.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'IconButton ou Button iconOnly?', en: 'IconButton or Button iconOnly?' }}>
        <p>
          <T
            pt={
              <>
                Os dois renderizam o mesmo <Code>&lt;button&gt;</Code> quadrado. O IconButton é um atalho com garantias extras:
              </>
            }
            en={<>Both render the same square <Code>&lt;button&gt;</Code>. IconButton is a shortcut with extra guarantees:</>}
          />
        </p>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Nome acessível', en: 'Accessible name' },
              description: {
                pt: <>IconButton exige <Code>label</Code> no tipo (erro de compilação se faltar). Em Button, <Code>aria-label</Code> é opcional e só gera um aviso em desenvolvimento.</>,
                en: <>IconButton requires <Code>label</Code> in its type (compile error if missing). On Button, <Code>aria-label</Code> is optional and only triggers a development warning.</>,
              },
            },
            {
              term: { pt: 'Ícone', en: 'Icon' },
              description: {
                pt: <>Pelo nome: <Code>icon="search"</Code>. Em Button: <Code>startIcon=&#123;&lt;Icon name="search" /&gt;&#125;</Code>.</>,
                en: <>By name: <Code>icon="search"</Code>. On Button: <Code>startIcon=&#123;&lt;Icon name="search" /&gt;&#125;</Code>.</>,
              },
            },
            {
              term: { pt: 'Variante padrão', en: 'Default variant' },
              description: { pt: <><Code>ghost</Code> (Button usa <Code>primary</Code>).</>, en: <><Code>ghost</Code> (Button uses <Code>primary</Code>).</> },
            },
            {
              term: { pt: 'Grupos', en: 'Groups' },
              description: {
                pt: 'Herda size, variant e disabled de ButtonGroup e Toolbar em qualquer nível e se marca como item da Toolbar automaticamente.',
                en: 'Inherits size, variant and disabled from ButtonGroup and Toolbar at any depth and marks itself as a Toolbar item automatically.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example title={{ pt: 'Variantes', en: 'Variants' }} code={VariantsCode}>
          <Variants />
        </Example>
        <Example
          title={{ pt: 'Tamanhos', en: 'Sizes' }}
          description={{
            pt: 'lg (48px), md (40px, padrão) e sm (32px). Em telas de toque, o alvo do sm cresce sem mudar o visual.',
            en: 'lg (48px), md (40px, default) and sm (32px). On touch screens, the sm target grows without changing the visuals.',
          }}
          code={SizesCode}
        >
          <Sizes />
        </Example>
        <Example
          title={{ pt: 'Ações por linha', en: 'Row actions' }}
          description={{
            pt: 'Cada rótulo inclui o nome do arquivo, então a lista de botões faz sentido fora de contexto.',
            en: 'Each label includes the file name, so the list of buttons makes sense out of context.',
          }}
          code={RowActionsCode}
        >
          <RowActions />
        </Example>
        <Example
          title={{ pt: 'Comparação com Button iconOnly', en: 'Compared with Button iconOnly' }}
          description={{ pt: 'Resultado idêntico; o IconButton é mais curto e não deixa o nome acessível de fora.', en: 'Identical output; IconButton is shorter and never leaves out the accessible name.' }}
          code={ComparisonCode}
        >
          <Comparison />
        </Example>
        <Example
          title={{ pt: 'Carregando e desabilitado', en: 'Loading and disabled' }}
          description={{
            pt: 'Em loading, o botão continua focável e anuncia o loadingText.',
            en: 'While loading, the button stays focusable and announces the loadingText.',
          }}
          code={StatesCode}
        >
          <States />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Pressionar', en: 'Press' }, description: { pt: <>Afunda 1px e reduz para 98,5% em <Code>--or-duration-press</Code> (90ms); volta em <Code>fast</Code> com <Code>--or-ease-out</Code>.</>, en: <>Sinks 1px and shrinks to 98.5% in <Code>--or-duration-press</Code> (90ms); returns in <Code>fast</Code> with <Code>--or-ease-out</Code>.</> } },
            { term: { pt: 'Hover e foco', en: 'Hover and focus' }, description: { pt: <>Fundo, borda e cor em <Code>--or-duration-fast</Code> (160ms) com <Code>--or-ease-out</Code>. Hover e foco visível têm a mesma resposta.</>, en: <>Background, border and color in <Code>--or-duration-fast</Code> (160ms) with <Code>--or-ease-out</Code>. Hover and visible focus respond the same way.</> } },
            { term: { pt: 'Em grupos', en: 'In groups' }, description: { pt: 'Em ButtonGroup colado ou ToolbarGroup colado, a moldura fica parada e só o ícone afunda, para a borda compartilhada não pular.', en: 'In an attached ButtonGroup or ToolbarGroup, the frame stays put and only the icon sinks, so the shared border never jumps.' } },
            { term: { pt: 'Carregando', en: 'Loading' }, description: { pt: 'O indicador gira em loop enquanto loading for verdadeiro (único movimento contínuo).', en: 'The indicator spins in a loop while loading is true (the only continuous motion).' } },
            { term: { pt: 'Movimento reduzido', en: 'Reduced motion' }, description: { pt: <>Com <Code>prefers-reduced-motion</Code>, os tokens zeram as durações: os estados mudam na hora, sem perder nenhuma pista visual.</>, en: <>With <Code>prefers-reduced-motion</Code>, the tokens zero every duration: states change instantly without losing any visual cue.</> } },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'icon', type: 'IconName | ReactElement', required: true, description: { pt: 'Nome de um ícone do Orange ou um SVG próprio.', en: 'Name of an Orange icon or a custom SVG.' } },
            { name: 'label', type: 'string', required: true, description: { pt: <>Nome acessível (vira <Code>aria-label</Code>). Descreva a ação.</>, en: <>Accessible name (becomes <Code>aria-label</Code>). Describe the action.</> } },
            { name: 'variant', type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'", default: "'ghost'", description: { pt: 'Estilo visual. Herda do ButtonGroup/Toolbar quando omitido.', en: 'Visual style. Inherited from ButtonGroup/Toolbar when omitted.' } },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: { pt: 'Lado do quadrado: 32, 40 ou 48px.', en: 'Square side: 32, 40 or 48px.' } },
            { name: 'loading', type: 'boolean', default: 'false', description: { pt: 'Mostra o indicador e bloqueia cliques.', en: 'Shows the indicator and blocks clicks.' } },
            { name: 'loadingText', type: 'string', description: { pt: 'Texto anunciado durante o carregamento.', en: 'Text announced while loading.' } },
            { name: '...rest', type: 'ButtonHTMLAttributes', description: { pt: 'Atributos nativos de <button> (exceto aria-label, que vem de label).', en: 'Native <button> attributes (except aria-label, which comes from label).' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                Renderiza um <Code>&lt;button type="button"&gt;</Code> nativo com <Code>aria-label</Code>; o ícone é decorativo (
                <Code>aria-hidden</Code>). O nome não deve mudar com o estado — para alternar, use <strong>ToggleButton</strong>.
              </>
            }
            en={
              <>
                Renders a native <Code>&lt;button type="button"&gt;</Code> with <Code>aria-label</Code>; the icon is decorative (
                <Code>aria-hidden</Code>). The name should not change with state — to toggle, use <strong>ToggleButton</strong>.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Move o foco para o botão.', en: 'Moves focus to the button.' } },
            { keys: ['Enter'], description: { pt: 'Ativa o botão.', en: 'Activates the button.' } },
            { keys: ['Space'], description: { pt: 'Ativa o botão.', en: 'Activates the button.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.1.1', description: { pt: 'O ícone é decorativo e o botão tem um nome em texto obrigatório.', en: 'The icon is decorative and the button has a required text name.' } },
            { criterion: '2.4.7', description: { pt: 'Foco visível com contorno laranja de 2px.', en: 'Visible focus with a 2px orange outline.' } },
            { criterion: '2.5.8', description: { pt: 'Alvo mínimo de 32×32px; em telas de toque o sm ganha uma área extra de toque.', en: 'Minimum 32×32px target; on touch screens the sm size gets an extra hit area.' } },
            { criterion: '4.1.2', description: { pt: <>Nome via <Code>aria-label</Code> e papel nativo de botão.</>, en: <>Name via <Code>aria-label</Code> and native button role.</> } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
