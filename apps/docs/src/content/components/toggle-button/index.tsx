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
import { Icon, ToggleButton } from '@orangesys/ui'
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import Controlled from './examples/Controlled'
import ControlledCode from './examples/Controlled?raw'
import GroupMultiple from './examples/GroupMultiple'
import GroupMultipleCode from './examples/GroupMultiple?raw'
import GroupSingle from './examples/GroupSingle'
import GroupSingleCode from './examples/GroupSingle?raw'
import WithIcons from './examples/WithIcons'
import WithIconsCode from './examples/WithIcons?raw'
import { meta } from './meta'

export default function ToggleButtonPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use para opções que o usuário liga e desliga e cujo efeito é imediato: filtros, formatação de texto, seguir uma discussão.',
              en: 'Use it for options the user turns on and off with an immediate effect: filters, text formatting, following a thread.',
            },
            {
              pt: (
                <>
                  O rótulo <strong>não muda</strong> entre os estados — "Negrito" continua "Negrito"; quem comunica o estado é o{' '}
                  <Code>aria-pressed</Code>. Se o rótulo precisa mudar ("Seguir" → "Seguindo"), use um Button comum.
                </>
              ),
              en: (
                <>
                  The label <strong>does not change</strong> between states — "Bold" stays "Bold"; <Code>aria-pressed</Code>{' '}
                  communicates the state. If the label must change ("Follow" → "Following"), use a regular Button.
                </>
              ),
            },
            {
              pt: 'O estado pressionado não depende só da cor: fundo, borda, barra inferior e o indicador (+ vira check) mudam juntos.',
              en: 'The pressed state does not rely on color alone: background, border, bottom bar and the indicator (+ turns into a check) change together.',
            },
            {
              pt: (
                <>
                  Para uma escolha exclusiva e obrigatória (sempre uma opção ativa), prefira o <strong>SegmentedControl</strong>.
                </>
              ),
              en: (
                <>
                  For an exclusive, required choice (always one option active), prefer <strong>SegmentedControl</strong>.
                </>
              ),
            },
          ]}
        />
        <DoDont
          doExample={
            <ToggleButton iconOnly aria-label="Negrito" defaultPressed startIcon={<Icon name="bold" />} />
          }
          dontExample={<ToggleButton defaultPressed>Desativar</ToggleButton>}
          doItems={[{ pt: 'Rótulo fixo que nomeia a opção ("Negrito").', en: 'Fixed label that names the option ("Bold").' }]}
          dontItems={[
            {
              pt: 'Rótulo de ação ("Desativar") — pressionado ou não, fica ambíguo.',
              en: 'An action label ("Turn off") — pressed or not, it is ambiguous.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Quando usar', en: 'When to use' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'ToggleButton', en: 'ToggleButton' }, description: { pt: 'Liga/desliga com efeito imediato, em barras de ferramentas e filtros.', en: 'On/off with immediate effect, in toolbars and filters.' } },
            { term: { pt: 'ToggleButtonGroup', en: 'ToggleButtonGroup' }, description: { pt: <>Vários toggles relacionados. <Code>single</Code>: no máximo um ativo; <Code>multiple</Code>: qualquer combinação.</>, en: <>Several related toggles. <Code>single</Code>: at most one active; <Code>multiple</Code>: any combination.</> } },
            { term: { pt: 'SegmentedControl', en: 'SegmentedControl' }, description: { pt: 'Escolha exclusiva e obrigatória entre 2 a 5 opções (radiogroup).', en: 'Exclusive, required choice among 2 to 5 options (radiogroup).' } },
            { term: { pt: 'Switch / Checkbox', en: 'Switch / Checkbox' }, description: { pt: 'Configurações e campos de formulário que são enviados ou salvos.', en: 'Settings and form fields that are submitted or saved.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Filtros', en: 'Filters' }}
          description={{
            pt: 'Botões com texto mostram um indicador: + solto e check pressionado, num espaço fixo. Variantes: outline (padrão) e ghost.',
            en: 'Text buttons show an indicator: + when released and a check when pressed, in a fixed slot. Variants: outline (default) and ghost.',
          }}
          code={BasicCode}
        >
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Com ícone e somente ícone', en: 'With icon and icon only' }}
          description={{
            pt: <>Com <Code>startIcon</Code> o indicador não aparece. Somente ícone exige <Code>aria-label</Code>.</>,
            en: <>With <Code>startIcon</Code> the indicator is hidden. Icon only requires <Code>aria-label</Code>.</>,
          }}
          code={WithIconsCode}
        >
          <WithIcons />
        </Example>
        <Example
          title={{ pt: 'Controlado', en: 'Controlled' }}
          description={{ pt: <>Use <Code>pressed</Code> e <Code>onPressedChange</Code>.</>, en: <>Use <Code>pressed</Code> and <Code>onPressedChange</Code>.</> }}
          code={ControlledCode}
        >
          <Controlled />
        </Example>
        <Example
          title={{ pt: 'Grupo com múltipla escolha', en: 'Multiple-choice group' }}
          description={{
            pt: <>Com <Code>selectionMode="multiple"</Code>, o valor é um array com os botões pressionados.</>,
            en: <>With <Code>selectionMode="multiple"</Code>, the value is an array of the pressed buttons.</>,
          }}
          code={GroupMultipleCode}
        >
          <GroupMultiple />
        </Example>
        <Example
          title={{ pt: 'Grupo com escolha única', en: 'Single-choice group' }}
          description={{
            pt: (
              <>
                Com <Code>selectionMode="single"</Code>, clicar no botão pressionado o solta (<Code>onChange(null)</Code>). Para manter sempre
                um ativo, ignore o <Code>null</Code> no modo controlado.
              </>
            ),
            en: (
              <>
                With <Code>selectionMode="single"</Code>, clicking the pressed button releases it (<Code>onChange(null)</Code>). To always
                keep one active, ignore <Code>null</Code> in controlled mode.
              </>
            ),
          }}
          code={GroupSingleCode}
        >
          <GroupSingle />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Solto → pressionado', en: 'Released → pressed' }, description: { pt: <>Fundo e borda laranjas em <Code>fast</Code>; a barra inferior cresce de 0 a 2px com <Code>--or-ease-spring</Code> em <Code>medium</Code> (250ms).</>, en: <>Orange background and border in <Code>fast</Code>; the bottom bar grows from 0 to 2px with <Code>--or-ease-spring</Code> in <Code>medium</Code> (250ms).</> } },
            { term: { pt: 'Indicador + → check', en: 'Indicator + → check' }, description: { pt: <>O <Code>+</Code> gira 90° e some (<Code>fast</Code>); o check entra como <Code>or-scale-in</Code> (0.6 → 1) com <Code>--or-ease-bounce</Code> em <Code>medium</Code>. O espaço é fixo: a largura não muda.</>, en: <>The <Code>+</Code> turns 90° and fades (<Code>fast</Code>); the check enters like <Code>or-scale-in</Code> (0.6 → 1) with <Code>--or-ease-bounce</Code> in <Code>medium</Code>. The slot is fixed: the width never changes.</> } },
            { term: { pt: 'Pressionado → solto', en: 'Pressed → released' }, description: { pt: <>Saída mais curta: a barra recolhe e o check some em <Code>fast</Code> com <Code>--or-ease-in-out</Code>; o <Code>+</Code> volta suave (<Code>medium</Code>, <Code>ease-out</Code>).</>, en: <>Shorter exit: the bar retracts and the check fades in <Code>fast</Code> with <Code>--or-ease-in-out</Code>; the <Code>+</Code> eases back in (<Code>medium</Code>, <Code>ease-out</Code>).</> } },
            { term: { pt: 'Ícones', en: 'Icons' }, description: { pt: <>Com <Code>startIcon</Code> ou somente ícone, o ícone ganha a cor de acento em <Code>fast</Code>.</>, en: <>With <Code>startIcon</Code> or icon only, the icon takes the accent color in <Code>fast</Code>.</> } },
            { term: { pt: 'Pressionar', en: 'Press' }, description: { pt: <>Afunda 1px e reduz para 98,5% em <Code>--or-duration-press</Code> (90ms); volta em <Code>fast</Code> com <Code>--or-ease-out</Code>.</>, en: <>Sinks 1px and shrinks to 98.5% in <Code>--or-duration-press</Code> (90ms); returns in <Code>fast</Code> with <Code>--or-ease-out</Code>.</> } },
            { term: { pt: 'Movimento reduzido', en: 'Reduced motion' }, description: { pt: <>Com <Code>prefers-reduced-motion</Code>, os tokens zeram as durações: os estados mudam na hora, sem perder nenhuma pista visual.</>, en: <>With <Code>prefers-reduced-motion</Code>, the tokens zero every duration: states change instantly without losing any visual cue.</> } },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          caption={{ pt: 'ToggleButton', en: 'ToggleButton' }}
          rows={[
            { name: 'pressed', type: 'boolean', description: { pt: 'Estado pressionado (controlado).', en: 'Pressed state (controlled).' } },
            { name: 'defaultPressed', type: 'boolean', default: 'false', description: { pt: 'Estado inicial (não controlado).', en: 'Initial state (uncontrolled).' } },
            { name: 'onPressedChange', type: '(pressed: boolean) => void', description: { pt: 'Chamado ao alternar (fora de um grupo).', en: 'Called when toggled (outside a group).' } },
            { name: 'value', type: 'string', description: { pt: 'Identificador dentro do ToggleButtonGroup.', en: 'Identifier inside ToggleButtonGroup.' } },
            { name: 'variant', type: "'outline' | 'ghost'", default: "'outline'", description: { pt: 'Estilo em repouso.', en: 'Resting style.' } },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: { pt: 'Altura: 32, 40 ou 48px.', en: 'Height: 32, 40 or 48px.' } },
            { name: 'showCheck', type: 'boolean', description: { pt: 'Mostra o indicador antes do rótulo (+ solto, check pressionado). Padrão: true para botões com texto e sem startIcon.', en: 'Shows the indicator before the label (+ released, check pressed). Default: true for text buttons without startIcon.' } },
            { name: 'iconOnly', type: 'boolean', default: 'false', description: { pt: <>Botão quadrado só com ícone. Exige <Code>aria-label</Code>.</>, en: <>Square icon-only button. Requires <Code>aria-label</Code>.</> } },
            { name: 'startIcon', type: 'ReactNode', description: { pt: 'Ícone antes do rótulo.', en: 'Icon before the label.' } },
            { name: '...rest', type: 'ButtonHTMLAttributes', description: { pt: 'Atributos nativos de <button>.', en: 'Native <button> attributes.' } },
          ]}
        />
        <PropsTable
          caption={{ pt: 'ToggleButtonGroup', en: 'ToggleButtonGroup' }}
          rows={[
            { name: 'selectionMode', type: "'single' | 'multiple'", default: "'single'", description: { pt: 'No máximo um pressionado ou qualquer combinação.', en: 'At most one pressed or any combination.' } },
            { name: 'value', type: 'string | null | string[]', description: { pt: 'Valor controlado: string/null em single, array em multiple.', en: 'Controlled value: string/null for single, array for multiple.' } },
            { name: 'defaultValue', type: 'string | null | string[]', description: { pt: 'Valor inicial (não controlado).', en: 'Initial value (uncontrolled).' } },
            { name: 'onChange', type: '(value) => void', description: { pt: 'Chamado com o novo valor.', en: 'Called with the new value.' } },
            { name: 'aria-label', type: 'string', description: { pt: 'Nome do grupo. Recomendado.', en: 'Group name. Recommended.' } },
            { name: 'attached', type: 'boolean', default: 'false', description: { pt: 'Cola os botões.', en: 'Attaches the buttons.' } },
            { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: { pt: 'Direção do grupo.', en: 'Group direction.' } },
            { name: 'size / variant / disabled', type: '—', description: { pt: 'Repassados a todos os ToggleButtons.', en: 'Passed down to every ToggleButton.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                Cada ToggleButton é um <Code>&lt;button&gt;</Code> nativo com <Code>aria-pressed="true|false"</Code>, anunciado
                como "botão de alternância, pressionado". O ToggleButtonGroup é um <Code>role="group"</Code> com nome; cada botão
                continua sendo uma parada de Tab. Dentro de uma <strong>Toolbar</strong>, os botões passam a usar as setas.
              </>
            }
            en={
              <>
                Each ToggleButton is a native <Code>&lt;button&gt;</Code> with <Code>aria-pressed="true|false"</Code>, announced as
                "toggle button, pressed". ToggleButtonGroup is a named <Code>role="group"</Code>; every button stays a Tab stop.
                Inside a <strong>Toolbar</strong>, the buttons switch to arrow-key navigation.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Move o foco para o próximo botão.', en: 'Moves focus to the next button.' } },
            { keys: ['Enter'], description: { pt: 'Alterna o estado pressionado.', en: 'Toggles the pressed state.' } },
            { keys: ['Space'], description: { pt: 'Alterna o estado pressionado.', en: 'Toggles the pressed state.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.4.1', description: { pt: 'O estado pressionado usa fundo, borda, barra e ícone — não só a cor.', en: 'The pressed state uses background, border, bar and icon — not color alone.' } },
            { criterion: '1.4.11', description: { pt: 'Borda e barra laranjas têm contraste de 3:1 com o fundo nos dois temas.', en: 'The orange border and bar have 3:1 contrast against the background in both themes.' } },
            { criterion: '2.4.7', description: { pt: 'Foco visível com contorno laranja de 2px.', en: 'Visible focus with a 2px orange outline.' } },
            { criterion: '4.1.2', description: { pt: <>Estado exposto com <Code>aria-pressed</Code>; o nome não muda entre os estados.</>, en: <>State exposed with <Code>aria-pressed</Code>; the name does not change between states.</> } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
