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
import { SegmentedControl } from '@orangesys/ui'
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import Disabled from './examples/Disabled'
import DisabledCode from './examples/Disabled?raw'
import IconOnly from './examples/IconOnly'
import IconOnlyCode from './examples/IconOnly?raw'
import Sizes from './examples/Sizes'
import SizesCode from './examples/Sizes?raw'
import WithIcons from './examples/WithIcons'
import WithIconsCode from './examples/WithIcons?raw'
import { meta } from './meta'

export default function SegmentedControlPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use para alternar entre visões ou modos do mesmo conteúdo — período de um gráfico, lista ou grade, unidade de medida.',
              en: 'Use it to switch between views or modes of the same content — chart period, list or grid, unit of measure.',
            },
            {
              pt: 'De 2 a 5 opções, com rótulos curtos (uma ou duas palavras) e de tamanho parecido. Para mais opções, use Select ou RadioGroup.',
              en: 'From 2 to 5 options, with short labels (one or two words) of similar length. For more options, use Select or RadioGroup.',
            },
            {
              pt: (
                <>
                  Sempre há uma opção selecionada — sem <Code>defaultValue</Code>, a primeira opção habilitada é escolhida. Para
                  permitir "nenhuma", use <strong>ToggleButtonGroup</strong>.
                </>
              ),
              en: (
                <>
                  An option is always selected — without <Code>defaultValue</Code>, the first enabled option is chosen. To allow
                  "none", use <strong>ToggleButtonGroup</strong>.
                </>
              ),
            },
            {
              pt: (
                <>
                  O <Code>label</Code> do grupo é obrigatório. Se o contexto já deixa claro, esconda-o com <Code>hideLabel</Code> —
                  ele continua sendo lido por leitores de tela.
                </>
              ),
              en: (
                <>
                  The group <Code>label</Code> is required. If the context already makes it clear, hide it with{' '}
                  <Code>hideLabel</Code> — screen readers still read it.
                </>
              ),
            },
          ]}
        />
        <DoDont
          doExample={
            <SegmentedControl
              label="Unidade"
              hideLabel
              size="sm"
              options={[
                { value: 'c', label: '°C' },
                { value: 'f', label: '°F' },
              ]}
            />
          }
          dontExample={
            <SegmentedControl
              label="Status"
              hideLabel
              size="sm"
              options={[
                { value: 'a', label: 'Rascunho' },
                { value: 'b', label: 'Em revisão pelo jurídico' },
                { value: 'c', label: 'Publicado' },
                { value: 'd', label: 'Arquivado' },
                { value: 'e', label: 'Excluído' },
              ]}
            />
          }
          doItems={[{ pt: 'Poucas opções curtas e equivalentes.', en: 'A few short, equivalent options.' }]}
          dontItems={[
            {
              pt: 'Muitas opções com rótulos longos — use um Select. E não use para disparar ações.',
              en: 'Many options with long labels — use a Select. And do not use it to trigger actions.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Anatomia', en: 'Anatomy' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Rótulo', en: 'Label' }, description: { pt: 'Nome do grupo (obrigatório), visível ou oculto.', en: 'Group name (required), visible or hidden.' } },
            { term: { pt: 'Trilho', en: 'Track' }, description: { pt: <>O <Code>role="radiogroup"</Code> com borda de 1px; as opções dividem a largura igualmente.</>, en: <>The <Code>role="radiogroup"</Code> with a 1px border; options share the width equally.</> } },
            { term: { pt: 'Indicador', en: 'Indicator' }, description: { pt: 'Realce com barra laranja que desliza até a opção selecionada.', en: 'Highlight with an orange bar that slides to the selected option.' } },
            { term: { pt: 'Opção', en: 'Option' }, description: { pt: 'Um radio nativo visualmente oculto + rótulo (e ícone opcional).', en: 'A visually hidden native radio + label (and optional icon).' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Período de um relatório', en: 'Report period' }}
          description={{ pt: 'Controlado com value e onChange.', en: 'Controlled with value and onChange.' }}
          code={BasicCode}
        >
          <Basic />
        </Example>
        <Example title={{ pt: 'Com ícones', en: 'With icons' }} code={WithIconsCode}>
          <WithIcons />
        </Example>
        <Example
          title={{ pt: 'Somente ícones', en: 'Icons only' }}
          description={{
            pt: <>Com <Code>iconOnly</Code>, os rótulos ficam visualmente ocultos mas continuam sendo o nome de cada radio.</>,
            en: <>With <Code>iconOnly</Code>, labels are visually hidden but remain each radio's name.</>,
          }}
          code={IconOnlyCode}
        >
          <IconOnly />
        </Example>
        <Example
          title={{ pt: 'Tamanhos e largura total', en: 'Sizes and full width' }}
          description={{
            pt: <>sm (32px), md (40px) e lg (48px). <Code>block</Code> ocupa a largura do contêiner.</>,
            en: <>sm (32px), md (40px) and lg (48px). <Code>block</Code> fills the container width.</>,
          }}
          code={SizesCode}
        >
          <Sizes />
        </Example>
        <Example
          title={{ pt: 'Opção e grupo desabilitados', en: 'Disabled option and group' }}
          description={{
            pt: 'As setas pulam opções desabilitadas. Explique perto do controle por que uma opção está indisponível.',
            en: 'Arrow keys skip disabled options. Explain near the control why an option is unavailable.',
          }}
          code={DisabledCode}
        >
          <Disabled />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Mudar a seleção', en: 'Change selection' }, description: { pt: <>O indicador desliza até a opção com <Code>--or-ease-spring</Code> em <Code>medium</Code> (250ms) — por clique ou pelas setas do teclado. Só o <Code>transform</Code> anima.</>, en: <>The indicator slides to the option with <Code>--or-ease-spring</Code> in <Code>medium</Code> (250ms) — by click or arrow keys. Only <Code>transform</Code> animates.</> } },
            { term: { pt: 'Montagem', en: 'Mount' }, description: { pt: 'Sem animação: a transição só é ligada depois da primeira medição, então o indicador não desliza a partir da borda ao carregar.', en: 'No animation: the transition is only enabled after the first measurement, so the indicator never slides in from the edge on load.' } },
            { term: { pt: 'Pressionar uma opção', en: 'Press an option' }, description: { pt: <>O conteúdo afunda 1px em <Code>--or-duration-press</Code> (90ms); o trilho fica parado.</>, en: <>The content sinks 1px in <Code>--or-duration-press</Code> (90ms); the track stays still.</> } },
            { term: { pt: 'Hover', en: 'Hover' }, description: { pt: <>Fundo e cor do texto em <Code>fast</Code>; o ícone da opção escolhida ganha a cor de acento.</>, en: <>Background and text color in <Code>fast</Code>; the selected option icon takes the accent color.</> } },
            { term: { pt: 'Movimento reduzido', en: 'Reduced motion' }, description: { pt: <>Com <Code>prefers-reduced-motion</Code>, os tokens zeram as durações: os estados mudam na hora, sem perder nenhuma pista visual.</>, en: <>With <Code>prefers-reduced-motion</Code>, the tokens zero every duration: states change instantly without losing any visual cue.</> } },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'label', type: 'ReactNode', required: true, description: { pt: 'Rótulo do grupo.', en: 'Group label.' } },
            { name: 'options', type: 'SegmentedControlOption[]', required: true, description: { pt: <>De 2 a 5 opções: <Code>{'{ value, label, icon?, disabled? }'}</Code>.</>, en: <>2 to 5 options: <Code>{'{ value, label, icon?, disabled? }'}</Code>.</> } },
            { name: 'value', type: 'string', description: { pt: 'Valor selecionado (controlado).', en: 'Selected value (controlled).' } },
            { name: 'defaultValue', type: 'string', description: { pt: 'Valor inicial. Padrão: a primeira opção habilitada.', en: 'Initial value. Default: the first enabled option.' } },
            { name: 'onChange', type: '(value: string) => void', description: { pt: 'Chamado quando a seleção muda.', en: 'Called when the selection changes.' } },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: { pt: 'Altura do controle.', en: 'Control height.' } },
            { name: 'block', type: 'boolean', default: 'false', description: { pt: 'Ocupa toda a largura disponível; as opções dividem o espaço igualmente.', en: 'Fills the available width; options share the space equally.' } },
            { name: 'iconOnly', type: 'boolean', default: 'false', description: { pt: 'Mostra só os ícones; os rótulos ficam ocultos visualmente.', en: 'Shows only icons; labels are visually hidden.' } },
            { name: 'hideLabel', type: 'boolean', default: 'false', description: { pt: 'Esconde o rótulo do grupo visualmente.', en: 'Visually hides the group label.' } },
            { name: 'description', type: 'ReactNode', description: { pt: 'Texto de ajuda, vinculado por aria-describedby.', en: 'Help text, linked via aria-describedby.' } },
            { name: 'disabled', type: 'boolean', default: 'false', description: { pt: 'Desabilita todas as opções.', en: 'Disables every option.' } },
            { name: 'name', type: 'string', description: { pt: 'Atributo name dos radios (para formulários). Gerado se omitido.', en: 'The radios name attribute (for forms). Generated if omitted.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                É um <Code>role="radiogroup"</Code> rotulado por <Code>aria-labelledby</Code>, com radios nativos de mesmo{' '}
                <Code>name</Code> visualmente ocultos. A navegação por teclado é a do próprio navegador: o grupo é uma única
                parada de Tab e as setas mudam a seleção.
              </>
            }
            en={
              <>
                It is a <Code>role="radiogroup"</Code> labelled by <Code>aria-labelledby</Code>, with visually hidden native
                radios sharing a <Code>name</Code>. Keyboard navigation comes from the browser: the group is a single Tab stop
                and arrow keys change the selection.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Move o foco para a opção selecionada.', en: 'Moves focus to the selected option.' } },
            { keys: ['→'], description: { pt: 'Seleciona a próxima opção habilitada.', en: 'Selects the next enabled option.' } },
            { keys: ['↓'], description: { pt: 'Seleciona a próxima opção habilitada.', en: 'Selects the next enabled option.' } },
            { keys: ['←'], description: { pt: 'Seleciona a opção anterior habilitada.', en: 'Selects the previous enabled option.' } },
            { keys: ['↑'], description: { pt: 'Seleciona a opção anterior habilitada.', en: 'Selects the previous enabled option.' } },
            { keys: ['Space'], description: { pt: 'Seleciona a opção focada, se ainda não estiver selecionada.', en: 'Selects the focused option if it is not selected yet.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Grupo e opções expostos como radiogroup e radios nativos.', en: 'Group and options exposed as a radiogroup and native radios.' } },
            { criterion: '1.4.1', description: { pt: 'A seleção usa fundo, barra inferior e cor do texto — não só a cor.', en: 'The selection uses background, bottom bar and text color — not color alone.' } },
            { criterion: '2.4.7', description: { pt: 'Contorno de foco de 2px ao redor da opção focada pelo teclado.', en: '2px focus outline around the keyboard-focused option.' } },
            { criterion: '2.3.3', description: { pt: 'A animação do indicador é desligada com prefers-reduced-motion.', en: 'The indicator animation is turned off with prefers-reduced-motion.' } },
            { criterion: '3.3.2', description: { pt: 'Rótulo do grupo obrigatório e descrição opcional vinculada.', en: 'Required group label and optional linked description.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
