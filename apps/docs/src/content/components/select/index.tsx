import { Bullets, Code, ComponentPage, DoDont, Example, KeyboardTable, PropsTable, Section, WcagList } from '../../../kit'
import { T } from '../../../i18n'
import { Select } from '@orange/ui'
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import Groups from './examples/Groups'
import GroupsCode from './examples/Groups?raw'
import Sizes from './examples/Sizes'
import SizesCode from './examples/Sizes?raw'
import Validation from './examples/Validation'
import ValidationCode from './examples/Validation?raw'
import { meta } from './meta'

const frequencias = [
  { value: 'diario', label: 'Diário' },
  { value: 'semanal', label: 'Semanal' },
  { value: 'mensal', label: 'Mensal' },
]

export default function SelectPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: <>Use para escolher <strong>uma</strong> opção entre poucas (até ~15). Para listas longas ou com busca, use <strong>Combobox</strong>; para várias opções, <strong>MultiSelect</strong>.</>,
              en: <>Use it to pick <strong>one</strong> option from a short list (up to ~15). For long or searchable lists, use <strong>Combobox</strong>; for several options, <strong>MultiSelect</strong>.</>,
            },
            {
              pt: 'Com 2 a 4 opções que cabem na tela, prefira botões de rádio: todas ficam visíveis sem clique extra.',
              en: 'With 2 to 4 options that fit on screen, prefer radio buttons: everything is visible without an extra click.',
            },
            {
              pt: <>Ordene as opções de forma previsível (alfabética, cronológica ou por frequência de uso) e use <Code>placeholder</Code> quando não houver um padrão sensato.</>,
              en: <>Order options predictably (alphabetical, chronological or by frequency) and use <Code>placeholder</Code> when there is no sensible default.</>,
            },
            {
              pt: 'Não use o Select para navegar entre páginas ou disparar ações — ele só escolhe um valor.',
              en: 'Do not use Select to navigate between pages or trigger actions — it only picks a value.',
            },
          ]}
        />
        <DoDont
          doExample={<Select label="Frequência do relatório" options={frequencias} defaultValue="semanal" />}
          dontExample={<Select aria-label="Frequência" placeholder="Frequência do relatório" options={frequencias} />}
          doItems={[{ pt: 'Rótulo visível e um padrão sensato.', en: 'Visible label and a sensible default.' }]}
          dontItems={[{ pt: 'Usar o placeholder como único rótulo — ele some depois da escolha.', en: 'Using the placeholder as the only label — it disappears after choosing.' }]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Básico', en: 'Basic' }}
          description={{ pt: 'Rótulo, descrição e placeholder. O texto de ajuda é ligado ao campo por aria-describedby.', en: 'Label, description and placeholder. The help text is linked to the field via aria-describedby.' }}
          code={BasicCode}
        >
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Grupos de opções', en: 'Option groups' }}
          description={{ pt: <>Passe objetos <Code>{'{ label, options }'}</Code> para gerar <Code>&lt;optgroup&gt;</Code>. Opções podem ser desabilitadas.</>, en: <>Pass <Code>{'{ label, options }'}</Code> objects to render <Code>&lt;optgroup&gt;</Code>. Options can be disabled.</> }}
          code={GroupsCode}
        >
          <Groups />
        </Example>
        <Example title={{ pt: 'Tamanhos', en: 'Sizes' }} description={{ pt: 'sm (32px), md (40px, padrão) e lg (48px).', en: 'sm (32px), md (40px, default) and lg (48px).' }} code={SizesCode}>
          <Sizes />
        </Example>
        <Example
          title={{ pt: 'Validação e desabilitado', en: 'Validation and disabled' }}
          description={{ pt: 'Com required, o placeholder vira uma opção desabilitada. A mensagem de erro aparece após o envio.', en: 'With required, the placeholder becomes a disabled option. The error message shows after submitting.' }}
          code={ValidationCode}
        >
          <Validation />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'label', type: 'ReactNode', description: { pt: 'Rótulo visível do campo.', en: 'Visible field label.' } },
            { name: 'hideLabel', type: 'boolean', default: 'false', description: { pt: 'Oculta o rótulo visualmente (continua acessível).', en: 'Visually hides the label (still accessible).' } },
            { name: 'description', type: 'ReactNode', description: { pt: 'Texto de ajuda abaixo do rótulo.', en: 'Help text below the label.' } },
            { name: 'error', type: 'ReactNode', description: { pt: 'Mensagem de erro; marca o campo como inválido.', en: 'Error message; marks the field as invalid.' } },
            { name: 'invalid', type: 'boolean', description: { pt: 'Inválido sem mensagem.', en: 'Invalid without a message.' } },
            { name: 'options', type: 'Array<SelectOption | SelectOptionGroup>', description: { pt: <>Opções <Code>{'{ value, label, disabled? }'}</Code> ou grupos <Code>{'{ label, options }'}</Code>. Alternativa a children.</>, en: <>Options <Code>{'{ value, label, disabled? }'}</Code> or groups <Code>{'{ label, options }'}</Code>. Alternative to children.</> } },
            { name: 'children', type: 'ReactNode', description: { pt: <>Elementos <Code>&lt;option&gt;</Code>/<Code>&lt;optgroup&gt;</Code> nativos.</>, en: <>Native <Code>&lt;option&gt;</Code>/<Code>&lt;optgroup&gt;</Code> elements.</> } },
            { name: 'placeholder', type: 'string', description: { pt: 'Opção de valor vazio exibida enquanto nada foi escolhido.', en: 'Empty-value option shown while nothing is chosen.' } },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: { pt: 'Altura do controle.', en: 'Control height.' } },
            { name: 'value / defaultValue', type: 'string', description: { pt: 'Valor controlado / inicial.', en: 'Controlled / initial value.' } },
            { name: 'onChange', type: '(event: ChangeEvent<HTMLSelectElement>) => void', description: { pt: 'Evento nativo de mudança.', en: 'Native change event.' } },
            { name: 'required', type: 'boolean', default: 'false', description: { pt: 'Obrigatório: mostra * e desabilita o placeholder.', en: 'Required: shows * and disables the placeholder.' } },
            { name: 'disabled', type: 'boolean', default: 'false', description: { pt: 'Desabilita o campo.', en: 'Disables the field.' } },
            { name: '...rest', type: 'SelectHTMLAttributes', description: { pt: <>Atributos nativos do <Code>&lt;select&gt;</Code> (name, autoComplete…). A ref aponta para o select.</>, en: <>Native <Code>&lt;select&gt;</Code> attributes (name, autoComplete…). The ref points to the select.</> } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={<>Renderiza um <Code>&lt;select&gt;</Code> nativo: leitores de tela anunciam rótulo, valor e posição da opção, e no celular abre o seletor do sistema. Só a aparência é personalizada — o chevron é decorativo (<Code>aria-hidden</Code>).</>}
            en={<>Renders a native <Code>&lt;select&gt;</Code>: screen readers announce label, value and option position, and on mobile the system picker opens. Only the appearance is customized — the chevron is decorative (<Code>aria-hidden</Code>).</>}
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Move o foco para o campo.', en: 'Moves focus to the field.' } },
            { keys: ['↑', '↓'], description: { pt: 'Muda a opção selecionada (ou navega na lista aberta).', en: 'Changes the selected option (or moves in the open list).' } },
            { keys: ['Alt', '↓'], description: { pt: 'Abre a lista de opções (Windows/Linux).', en: 'Opens the option list (Windows/Linux).' } },
            { keys: ['Space'], description: { pt: 'Abre a lista de opções.', en: 'Opens the option list.' } },
            { keys: ['A–Z'], description: { pt: 'Vai para a opção que começa com a letra digitada.', en: 'Jumps to the option starting with the typed letter.' } },
            { keys: ['Esc'], description: { pt: 'Fecha a lista sem mudar o valor.', en: 'Closes the list without changing the value.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: <>Rótulo ligado por <Code>for</Code>/<Code>id</Code>; ajuda e erro por <Code>aria-describedby</Code>.</>, en: <>Label linked via <Code>for</Code>/<Code>id</Code>; help and error via <Code>aria-describedby</Code>.</> } },
            { criterion: '2.1.1', description: { pt: 'Teclado completo do controle nativo.', en: 'Full keyboard support from the native control.' } },
            { criterion: '2.4.7', description: { pt: 'Foco visível com borda e anel laranja.', en: 'Visible focus with an orange border and ring.' } },
            { criterion: '3.3.1', description: { pt: <>Erro exposto com <Code>aria-invalid</Code> e mensagem em texto.</>, en: <>Error exposed with <Code>aria-invalid</Code> and a text message.</> } },
            { criterion: '3.3.2', description: { pt: 'Rótulo sempre visível (ou oculto, mas presente para leitores de tela).', en: 'Label always visible (or hidden but present for screen readers).' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
