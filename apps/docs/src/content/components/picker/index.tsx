import {
  Bullets,
  Callout,
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
import { Picker } from '@orangesys/ui'
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import Controlled from './examples/Controlled'
import ControlledCode from './examples/Controlled?raw'
import Groups from './examples/Groups'
import GroupsCode from './examples/Groups?raw'
import States from './examples/States'
import StatesCode from './examples/States?raw'
import WithForm from './examples/WithForm'
import WithFormCode from './examples/WithForm?raw'
import { meta } from './meta'

const canais = [
  { value: 'email', label: 'E-mail', icon: 'mail', description: 'Resumo diário às 9h' },
  { value: 'app', label: 'Aplicativo', icon: 'bell', description: 'Na hora, no celular' },
]

const canaisSemDescricao = [
  { value: 'email', label: 'E-mail' },
  { value: 'app', label: 'Aplicativo' },
]

export default function PickerPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: (
                <>
                  Use quando as opções precisam de mais que texto: um <strong>ícone</strong> que
                  ajuda a reconhecer, uma <strong>descrição</strong> que explica a consequência ou
                  grupos com título. Para opções só de texto, o <strong>Select</strong> nativo é
                  mais simples e mais leve.
                </>
              ),
              en: (
                <>
                  Use it when options need more than text: an <strong>icon</strong> that aids
                  recognition, a <strong>description</strong> that explains the consequence, or
                  titled groups. For text-only options, the native <strong>Select</strong> is
                  simpler and lighter.
                </>
              ),
            },
            {
              pt: (
                <>
                  Até ~15 opções. Para listas longas em que a pessoa sabe o que procura, use{' '}
                  <strong>Combobox</strong> (com busca); para várias escolhas,{' '}
                  <strong>MultiSelect</strong>; para 2 a 4 opções que cabem na tela,{' '}
                  <strong>RadioGroup</strong>.
                </>
              ),
              en: (
                <>
                  Up to ~15 options. For long lists where people know what they are looking for, use{' '}
                  <strong>Combobox</strong> (searchable); for several choices,{' '}
                  <strong>MultiSelect</strong>; for 2 to 4 options that fit on screen,{' '}
                  <strong>RadioGroup</strong>.
                </>
              ),
            },
            {
              pt: (
                <>
                  Rótulos curtos e escaneáveis: o rótulo também aparece no campo fechado e é usado
                  na busca por digitação. Detalhes (prazo, preço, impacto) vão na{' '}
                  <Code>description</Code>, que só aparece na lista aberta.
                </>
              ),
              en: (
                <>
                  Short, scannable labels: the label also shows in the closed field and drives
                  type-ahead. Details (lead time, price, impact) go in the <Code>description</Code>,
                  which only shows in the open list.
                </>
              ),
            },
            {
              pt: 'Explique na descrição por que uma opção está desabilitada ("Disponível no plano Empresarial"). Desabilitadas continuam visíveis, mas o teclado as pula.',
              en: 'Explain in the description why an option is disabled ("Available on the Enterprise plan"). Disabled options stay visible, but the keyboard skips them.',
            },
            {
              pt: 'Ícones são decorativos e reforçam o rótulo — nunca o substituem. Use ícones em todas as opções ou em nenhuma.',
              en: 'Icons are decorative and reinforce the label — they never replace it. Use icons on all options or none.',
            },
          ]}
        />
        <DoDont
          doExample={
            <Picker label="Notificações de comentários" options={canais} defaultValue="email" />
          }
          dontExample={
            <Picker
              label="Notificações de comentários"
              options={canaisSemDescricao}
              defaultValue="email"
            />
          }
          doItems={[
            {
              pt: 'Ícone e descrição ajudam a decidir — é para isso que o Picker existe.',
              en: 'Icon and description help people decide — that is what Picker is for.',
            },
          ]}
          dontItems={[
            {
              pt: (
                <>
                  Só texto: aqui um <Code>Select</Code> resolve, com teclado e leitores de tela
                  nativos.
                </>
              ),
              en: (
                <>
                  Text only: a <Code>Select</Code> does the job here, with native keyboard and
                  screen reader support.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Anatomia', en: 'Anatomy' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Gatilho', en: 'Trigger' },
              description: {
                pt: 'Elemento role="combobox" com a mesma borda, altura e foco dos outros campos. Mostra o ícone e o rótulo da opção escolhida — ou o placeholder — e um chevron.',
                en: 'role="combobox" element with the same border, height and focus as other fields. Shows the chosen option’s icon and label — or the placeholder — and a chevron.',
              },
            },
            {
              term: { pt: 'Lista', en: 'List' },
              description: {
                pt: 'Popup role="listbox" na largura do campo, com borda de 1px e sombra de sobreposição. Abre embaixo (ou em cima, sem espaço) e rola por dentro em listas longas.',
                en: 'role="listbox" popup as wide as the field, with a 1px border and overlay shadow. Opens below (or above, when there is no room) and scrolls internally for long lists.',
              },
            },
            {
              term: { pt: 'Opção', en: 'Option' },
              description: {
                pt: 'Ícone opcional, rótulo e descrição. A ativa ganha fundo e uma barra laranja à esquerda; a escolhida, rótulo em negrito e check à direita.',
                en: 'Optional icon, label and description. The active one gets a background and an orange bar on the left; the chosen one, a bold label and a check on the right.',
              },
            },
            {
              term: { pt: 'Grupo', en: 'Group' },
              description: {
                pt: 'Título em caixa alta (eyebrow) que nomeia um role="group"; grupos são separados por uma linha de 1px.',
                en: 'Uppercase title (eyebrow) naming a role="group"; groups are separated by a 1px rule.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Ícones e descrições', en: 'Icons and descriptions' }}
          description={{
            pt: (
              <>
                O campo fechado mostra o ícone e o rótulo da escolha; a descrição aparece só na
                lista. <Code>icon</Code> aceita o nome de um ícone do Orange ou um elemento.
              </>
            ),
            en: (
              <>
                The closed field shows the chosen icon and label; the description only appears in
                the list. <Code>icon</Code> takes an Orange icon name or an element.
              </>
            ),
          }}
          code={BasicCode}
          minHeight={380}
        >
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Grupos e opções desabilitadas', en: 'Groups and disabled options' }}
          description={{
            pt: (
              <>
                Passe <Code>{'{ label, options }'}</Code> em <Code>options</Code> para agrupar. A
                lista rola por dentro e mantém a opção ativa visível; experimente digitar “fr” com o
                campo focado.
              </>
            ),
            en: (
              <>
                Pass <Code>{'{ label, options }'}</Code> in <Code>options</Code> to group. The list
                scrolls internally and keeps the active option in view; try typing “fr” with the
                field focused.
              </>
            ),
          }}
          code={GroupsCode}
          minHeight={420}
        >
          <Groups />
        </Example>
        <Example
          title={{ pt: 'Controlado', en: 'Controlled' }}
          description={{
            pt: (
              <>
                Valor com <Code>value</Code> / <Code>onChange</Code> e lista com <Code>open</Code> /{' '}
                <Code>onOpenChange</Code>. <Code>onChange</Code> recebe o valor (ou{' '}
                <Code>null</Code>).
              </>
            ),
            en: (
              <>
                Value with <Code>value</Code> / <Code>onChange</Code> and list with{' '}
                <Code>open</Code> / <Code>onOpenChange</Code>. <Code>onChange</Code> receives the
                value (or <Code>null</Code>).
              </>
            ),
          }}
          code={ControlledCode}
          minHeight={340}
        >
          <Controlled />
        </Example>
        <Example
          title={{ pt: 'Integração com Form', en: 'Form integration' }}
          description={{
            pt: (
              <>
                Com <Code>name</Code>, o valor vai num <Code>&lt;input type="hidden"&gt;</Code>{' '}
                (vazio sem escolha) que o <Code>Form</Code> e formulários nativos leem. Envie vazio
                para ver o erro: o resumo leva o foco ao campo e o erro some ao escolher. “Limpar”
                (reset) volta ao <Code>defaultValue</Code>.
              </>
            ),
            en: (
              <>
                With <Code>name</Code>, the value goes in an{' '}
                <Code>&lt;input type="hidden"&gt;</Code> (empty with no choice) that{' '}
                <Code>Form</Code> and native forms read. Submit it empty to see the error: the
                summary moves focus to the field and the error clears once you choose. “Limpar”
                (reset) restores the <Code>defaultValue</Code>.
              </>
            ),
          }}
          code={WithFormCode}
          minHeight={460}
        >
          <WithForm />
        </Example>
        <Example title={{ pt: 'Tamanhos e estados', en: 'Sizes and states' }} code={StatesCode}>
          <States />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Abrir a lista', en: 'Opening the list' },
              description: {
                pt: 'Opacidade + 6px a partir do campo (desce quando abre embaixo, sobe quando abre em cima) — 160ms, ease-out.',
                en: 'Opacity + 6px from the field (slides down when opening below, up when above) — 160ms, ease-out.',
              },
            },
            {
              term: { pt: 'Fechar a lista', en: 'Closing the list' },
              description: {
                pt: 'Fade + recuo de 4px em direção ao campo — 120ms, ease-in-out. O conteúdo fica congelado durante a saída.',
                en: 'Fade + 4px retreat toward the field — 120ms, ease-in-out. Content is frozen during the exit.',
              },
            },
            {
              term: { pt: 'Opção ativa', en: 'Active option' },
              description: {
                pt: 'Fundo em 160ms (ease-out); a barra laranja lateral cresce do centro (scaleY) em 250ms, spring.',
                en: 'Background in 160ms (ease-out); the orange side bar grows from the center (scaleY) in 250ms, spring.',
              },
            },
            {
              term: { pt: 'Chevron', en: 'Chevron' },
              description: {
                pt: 'Escurece e desce 2px no hover/foco (como no Select), afunda no clique (90ms) e gira 180° ao abrir — 250ms, spring.',
                en: 'Darkens and moves down 2px on hover/focus (like Select), sinks on click (90ms) and rotates 180° when opening — 250ms, spring.',
              },
            },
            {
              term: { pt: 'Erro', en: 'Error' },
              description: {
                pt: 'Quando o erro surge, o campo treme uma vez (or-shake, 400ms) e a mensagem entra com fade + 4px, como nos outros campos.',
                en: 'When the error appears, the field shakes once (or-shake, 400ms) and the message enters with a fade + 4px, like other fields.',
              },
            },
            {
              term: { pt: 'Movimento reduzido', en: 'Reduced motion' },
              description: {
                pt: 'Durações e distâncias zeram pelos tokens; o estado continua indicado por cor, borda, check e texto.',
                en: 'Durations and distances drop to zero via tokens; state is still conveyed by color, border, check and text.',
              },
            },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            {
              name: 'options',
              type: 'Array<PickerOption | PickerGroup>',
              required: true,
              description: {
                pt: (
                  <>
                    Opções <Code>{'{ value, label, description?, icon?, disabled? }'}</Code> ou
                    grupos <Code>{'{ label, options }'}</Code>. <Code>icon</Code> é o nome de um
                    ícone do Orange ou um elemento.
                  </>
                ),
                en: (
                  <>
                    Options <Code>{'{ value, label, description?, icon?, disabled? }'}</Code> or
                    groups <Code>{'{ label, options }'}</Code>. <Code>icon</Code> is an Orange icon
                    name or an element.
                  </>
                ),
              },
            },
            {
              name: 'value / defaultValue',
              type: 'string | null',
              default: 'null',
              description: {
                pt: 'Valor escolhido (controlado / inicial). null = nenhum.',
                en: 'Chosen value (controlled / initial). null = none.',
              },
            },
            {
              name: 'onChange',
              type: '(value: string | null) => void',
              description: {
                pt: 'Chamado quando a pessoa escolhe outra opção (ou o formulário é reiniciado).',
                en: 'Called when a different option is chosen (or the form is reset).',
              },
            },
            {
              name: 'open / defaultOpen / onOpenChange',
              type: 'boolean / (open: boolean) => void',
              default: 'false',
              description: {
                pt: 'Estado aberto da lista (controlado / inicial).',
                en: 'Open state of the list (controlled / initial).',
              },
            },
            {
              name: 'placeholder',
              type: 'string',
              default: "'Selecione…'",
              description: {
                pt: 'Texto do campo enquanto nada foi escolhido (o padrão vem do idioma).',
                en: 'Field text while nothing is chosen (the default comes from the locale).',
              },
            },
            {
              name: 'name',
              type: 'string',
              description: {
                pt: 'Envia o valor num input oculto (vazio sem escolha) para Form e formulários nativos.',
                en: 'Submits the value in a hidden input (empty with no choice) for Form and native forms.',
              },
            },
            {
              name: 'label / hideLabel / description / error',
              type: 'ReactNode / boolean',
              description: {
                pt: 'Estrutura de campo (Field) e vínculos ARIA.',
                en: 'Field structure and ARIA links.',
              },
            },
            {
              name: 'required / optional / disabled / invalid',
              type: 'boolean',
              default: 'false',
              description: {
                pt: (
                  <>
                    Estados do campo. <Code>disabled</Code> tira o campo da ordem de Tab e não envia
                    o valor.
                  </>
                ),
                en: (
                  <>
                    Field states. <Code>disabled</Code> removes the field from the Tab order and
                    submits nothing.
                  </>
                ),
              },
            },
            {
              name: 'size',
              type: "'sm' | 'md' | 'lg'",
              default: "'md'",
              description: { pt: 'Altura do controle.', en: 'Control height.' },
            },
            {
              name: 'id',
              type: 'string',
              description: {
                pt: 'Id do gatilho (gerado se omitido); o rótulo aponta para ele.',
                en: 'Trigger id (generated if omitted); the label points to it.',
              },
            },
            {
              name: '...rest',
              type: 'HTMLAttributes<HTMLDivElement>',
              description: {
                pt: (
                  <>
                    Vão para o gatilho <Code>role="combobox"</Code> (que recebe a ref);{' '}
                    <Code>className</Code> vai para o contêiner do campo.
                  </>
                ),
                en: (
                  <>
                    Go to the <Code>role="combobox"</Code> trigger (which receives the ref);{' '}
                    <Code>className</Code> goes to the field container.
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
                Segue o padrão <strong>Select-Only Combobox</strong> do WAI-ARIA APG. O gatilho tem{' '}
                <Code>role="combobox"</Code>, <Code>aria-haspopup="listbox"</Code>,{' '}
                <Code>aria-expanded</Code> e é nomeado pelo rótulo do campo; aberto, ganha{' '}
                <Code>aria-controls</Code> e <Code>aria-activedescendant</Code>. O foco fica sempre
                no gatilho: a lista (<Code>role="listbox"</Code>) não recebe foco, e a opção ativa é
                indicada por <Code>aria-activedescendant</Code>. Cada opção expõe{' '}
                <Code>aria-selected</Code>, a descrição chega por <Code>aria-describedby</Code> e os
                grupos são <Code>role="group"</Code> nomeados pelo título. Clicar no rótulo foca o
                gatilho.
              </>
            }
            en={
              <>
                Follows the WAI-ARIA APG <strong>Select-Only Combobox</strong> pattern. The trigger
                has <Code>role="combobox"</Code>, <Code>aria-haspopup="listbox"</Code>,{' '}
                <Code>aria-expanded</Code> and is named by the field label; when open, it gets{' '}
                <Code>aria-controls</Code> and <Code>aria-activedescendant</Code>. Focus always
                stays on the trigger: the list (<Code>role="listbox"</Code>) never receives focus,
                and the active option is conveyed with <Code>aria-activedescendant</Code>. Each
                option exposes <Code>aria-selected</Code>, its description comes through{' '}
                <Code>aria-describedby</Code> and groups are <Code>role="group"</Code> named by
                their title. Clicking the label focuses the trigger.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            {
              keys: ['Enter / Space / ↓ / ↑'],
              description: {
                pt: 'Fechada: abre a lista na opção escolhida (sem escolha, ↓ vai à primeira e ↑ à última).',
                en: 'Closed: opens the list on the chosen option (with no choice, ↓ goes to the first and ↑ to the last).',
              },
            },
            {
              keys: ['Alt', '↓'],
              description: {
                pt: 'Abre a lista sem mudar a escolha.',
                en: 'Opens the list without changing the choice.',
              },
            },
            {
              keys: ['↓ / ↑'],
              description: {
                pt: 'Aberta: próxima / anterior opção, pulando as desabilitadas. Não dá a volta.',
                en: 'Open: next / previous option, skipping disabled ones. Does not wrap.',
              },
            },
            {
              keys: ['Home / End'],
              description: {
                pt: 'Primeira / última opção (abre a lista se estiver fechada).',
                en: 'First / last option (opens the list if closed).',
              },
            },
            {
              keys: ['PageUp / PageDown'],
              description: {
                pt: 'Aberta: sobe / desce 10 opções.',
                en: 'Open: moves up / down 10 options.',
              },
            },
            {
              keys: ['a–z'],
              description: {
                pt: 'Busca por digitação (sem acentos; até 500ms entre as letras; repetir a letra percorre as opções). Aberta, move a opção ativa; fechada, escolhe direto, como o select nativo.',
                en: 'Type-ahead (accent-insensitive; up to 500ms between letters; repeating a letter cycles through options). When open, moves the active option; when closed, picks it directly, like a native select.',
              },
            },
            {
              keys: ['Enter / Space'],
              description: {
                pt: 'Aberta: escolhe a opção ativa e fecha.',
                en: 'Open: picks the active option and closes.',
              },
            },
            {
              keys: ['Alt', '↑'],
              description: {
                pt: 'Escolhe a opção ativa e fecha.',
                en: 'Picks the active option and closes.',
              },
            },
            {
              keys: ['Esc'],
              description: {
                pt: 'Fecha sem mudar a escolha.',
                en: 'Closes without changing the choice.',
              },
            },
            {
              keys: ['Tab'],
              description: {
                pt: 'Escolhe a opção ativa, fecha e segue para o próximo campo.',
                en: 'Picks the active option, closes and moves to the next field.',
              },
            },
          ]}
        />
        <Callout tone="info" title={{ pt: 'Quando usar o Select', en: 'When to use Select' }}>
          <T
            pt={
              <>
                O <Code>Select</Code> nativo tem teclado, leitores de tela e o seletor do sistema
                (no celular) prontos. Prefira-o sempre que as opções forem só texto — o Picker
                existe para o que o <Code>&lt;select&gt;</Code> não consegue mostrar.
              </>
            }
            en={
              <>
                The native <Code>Select</Code> comes with keyboard, screen reader and the system
                picker (on mobile) out of the box. Prefer it whenever options are text only — Picker
                exists for what a <Code>&lt;select&gt;</Code> cannot show.
              </>
            }
          />
        </Callout>
        <WcagList
          items={[
            {
              criterion: '1.3.1',
              description: {
                pt: 'Papéis combobox, listbox, option e group; rótulo, descrição e erro ligados por aria-labelledby e aria-describedby.',
                en: 'combobox, listbox, option and group roles; label, description and error linked with aria-labelledby and aria-describedby.',
              },
            },
            {
              criterion: '1.4.1',
              description: {
                pt: 'Escolha indicada por check e peso do texto, não só por cor; opção ativa com barra lateral.',
                en: 'Choice shown by a check and text weight, not color alone; active option with a side bar.',
              },
            },
            {
              criterion: '2.1.1',
              description: {
                pt: 'Abrir, navegar, buscar e escolher pelo teclado, conforme o APG.',
                en: 'Open, navigate, search and choose from the keyboard, per the APG.',
              },
            },
            {
              criterion: '2.4.7',
              description: {
                pt: 'Foco visível no campo (borda e anel laranja) e opção ativa destacada.',
                en: 'Visible focus on the field (orange border and ring) and a highlighted active option.',
              },
            },
            {
              criterion: '3.3.1',
              description: {
                pt: 'Erro exposto com aria-invalid, texto ligado ao campo e borda vermelha.',
                en: 'Error exposed with aria-invalid, text linked to the field and a red border.',
              },
            },
            {
              criterion: '4.1.2',
              description: {
                pt: 'aria-expanded, aria-selected, aria-disabled e aria-activedescendant sempre atualizados.',
                en: 'aria-expanded, aria-selected, aria-disabled and aria-activedescendant always up to date.',
              },
            },
            {
              criterion: '4.1.3',
              description: {
                pt: 'A escolha feita por digitação com a lista fechada é anunciada numa região role="status".',
                en: 'A choice made by typing with the list closed is announced in a role="status" region.',
              },
            },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
