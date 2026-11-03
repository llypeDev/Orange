import { Bullets, Callout, Code, ComponentPage, Example, KeyboardTable, PropsTable, Section, WcagList } from '../../../kit'
import { T } from '../../../i18n'
import Async from './examples/Async'
import AsyncCode from './examples/Async?raw'
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import Controlled from './examples/Controlled'
import ControlledCode from './examples/Controlled?raw'
import States from './examples/States'
import StatesCode from './examples/States?raw'
import { meta } from './meta'

export default function ComboboxPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: <>Use quando houver muitas opções (cidades, clientes, bancos) e o usuário souber o que procura. Para até ~15 opções, o <strong>Select</strong> nativo é mais simples.</>,
              en: <>Use it when there are many options (cities, customers, banks) and the user knows what to look for. For up to ~15 options, the native <strong>Select</strong> is simpler.</>,
            },
            {
              pt: 'O valor sempre vem da lista: texto que não corresponde a nenhuma opção é descartado ao sair do campo. Para texto livre com sugestões, use um campo de texto comum.',
              en: 'The value always comes from the list: text that matches no option is discarded on blur. For free text with suggestions, use a regular text field.',
            },
            {
              pt: <>Use <Code>description</Code> nas opções para desambiguar (estado de uma cidade, e-mail de um cliente) — ela também entra na busca.</>,
              en: <>Use option <Code>description</Code> to disambiguate (a city's state, a customer's e-mail) — it is searchable too.</>,
            },
            {
              pt: <>Em buscas no servidor, passe <Code>filter={'{false}'}</Code>, atualize <Code>options</Code> em <Code>onInputChange</Code> e indique <Code>loading</Code>.</>,
              en: <>For server-side search, pass <Code>filter={'{false}'}</Code>, update <Code>options</Code> in <Code>onInputChange</Code> and set <Code>loading</Code>.</>,
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Básico', en: 'Basic' }}
          description={{ pt: 'A busca ignora acentos e caixa, destaca o trecho encontrado e já marca o primeiro resultado — Enter escolhe.', en: 'Search ignores accents and case, highlights the match and pre-selects the first result — Enter picks it.' }}
          code={BasicCode}
          minHeight={420}
        >
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Busca assíncrona', en: 'Async search' }}
          description={{ pt: 'Resultados vindos de uma API simulada. A contagem de resultados é anunciada para leitores de tela.', en: 'Results from a simulated API. The result count is announced to screen readers.' }}
          code={AsyncCode}
          minHeight={340}
        >
          <Async />
        </Example>
        <Example
          title={{ pt: 'Controlado', en: 'Controlled' }}
          description={{ pt: <>Com <Code>value</Code> e <Code>onChange</Code>, o valor pode ser alterado de fora. Opções podem ser desabilitadas.</>, en: <>With <Code>value</Code> and <Code>onChange</Code>, the value can be changed externally. Options can be disabled.</> }}
          code={ControlledCode}
        >
          <Controlled />
        </Example>
        <Example title={{ pt: 'Tamanhos e estados', en: 'Sizes and states' }} code={StatesCode}>
          <States />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'options', type: 'ComboboxOption[]', required: true, description: { pt: <>Opções <Code>{'{ value, label, description?, disabled? }'}</Code>.</>, en: <>Options <Code>{'{ value, label, description?, disabled? }'}</Code>.</> } },
            { name: 'value / defaultValue', type: 'string | null', description: { pt: 'Valor escolhido (controlado / inicial).', en: 'Chosen value (controlled / initial).' } },
            { name: 'onChange', type: '(value: string | null, option: ComboboxOption | null) => void', description: { pt: 'Chamado ao escolher ou limpar.', en: 'Called when choosing or clearing.' } },
            { name: 'onInputChange', type: '(text: string) => void', description: { pt: 'Chamado a cada digitação — use para buscar no servidor.', en: 'Called on every keystroke — use it for server-side search.' } },
            { name: 'filter', type: '((option, query) => boolean) | false', description: { pt: <>Filtro das opções. Padrão: contém o texto, sem acentos. <Code>false</Code> desliga o filtro.</>, en: <>Option filter. Default: contains the text, accent-insensitive. <Code>false</Code> disables it.</> } },
            { name: 'loading', type: 'boolean', default: 'false', description: { pt: 'Mostra "Carregando…" na lista.', en: 'Shows "Loading…" in the list.' } },
            { name: 'emptyMessage', type: 'ReactNode', description: { pt: 'Mensagem sem resultados.', en: 'Message when there are no results.' } },
            { name: 'clearable', type: 'boolean', default: 'true', description: { pt: 'Mostra o botão de limpar.', en: 'Shows the clear button.' } },
            { name: 'open / defaultOpen / onOpenChange', type: 'boolean / (open) => void', description: { pt: 'Controle do estado aberto da lista.', en: 'Controls the open state of the list.' } },
            { name: 'label / hideLabel / description / error', type: 'ReactNode / boolean', description: { pt: 'Estrutura de campo (Field).', en: 'Field structure.' } },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: { pt: 'Altura do controle.', en: 'Control height.' } },
            { name: 'name', type: 'string', description: { pt: 'Envia o valor em um input oculto.', en: 'Submits the value in a hidden input.' } },
            { name: 'required / disabled / invalid', type: 'boolean', description: { pt: 'Estados do campo.', en: 'Field states.' } },
            { name: '...rest', type: 'InputHTMLAttributes', description: { pt: 'Atributos do campo de texto (a ref aponta para ele).', en: 'Text input attributes (the ref points to it).' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={<>Segue o padrão <strong>combobox com listbox</strong> do WAI-ARIA APG: o campo tem <Code>role="combobox"</Code>, <Code>aria-expanded</Code>, <Code>aria-controls</Code> e <Code>aria-autocomplete="list"</Code>; o foco permanece no campo e a opção ativa é indicada por <Code>aria-activedescendant</Code>. A opção escolhida tem <Code>aria-selected="true"</Code> e a quantidade de resultados é anunciada em uma região <Code>role="status"</Code>.</>}
            en={<>Follows the WAI-ARIA APG <strong>combobox with listbox</strong> pattern: the field has <Code>role="combobox"</Code>, <Code>aria-expanded</Code>, <Code>aria-controls</Code> and <Code>aria-autocomplete="list"</Code>; focus stays in the field and the active option is conveyed with <Code>aria-activedescendant</Code>. The chosen option has <Code>aria-selected="true"</Code> and the result count is announced in a <Code>role="status"</Code> region.</>}
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['↓'], description: { pt: 'Abre a lista (na opção escolhida ou na primeira) ou vai para a próxima opção.', en: 'Opens the list (on the chosen or first option) or moves to the next option.' } },
            { keys: ['↑'], description: { pt: 'Abre a lista na última opção ou vai para a anterior.', en: 'Opens the list on the last option or moves to the previous one.' } },
            { keys: ['Alt', '↓'], description: { pt: 'Abre a lista sem mover o foco visual.', en: 'Opens the list without moving visual focus.' } },
            { keys: ['Alt', '↑'], description: { pt: 'Fecha a lista.', en: 'Closes the list.' } },
            { keys: ['Home', 'End'], description: { pt: 'Com uma opção ativa, vai para a primeira/última; senão, move o cursor no texto.', en: 'With an active option, moves to the first/last; otherwise moves the text cursor.' } },
            { keys: ['Enter'], description: { pt: 'Escolhe a opção ativa e fecha a lista.', en: 'Picks the active option and closes the list.' } },
            { keys: ['Esc'], description: { pt: 'Fecha a lista; com ela fechada, limpa o campo.', en: 'Closes the list; when closed, clears the field.' } },
            { keys: ['←', '→'], description: { pt: 'Devolve o foco visual ao texto para edição.', en: 'Returns visual focus to the text for editing.' } },
            { keys: ['Tab'], description: { pt: 'Fecha a lista e segue para o próximo campo.', en: 'Closes the list and moves to the next field.' } },
          ]}
        />
        <Callout tone="info" title={{ pt: 'Botões internos', en: 'Inner buttons' }}>
          <T
            pt={<>Os botões de abrir e de limpar ficam fora da ordem de Tab (<Code>tabIndex=-1</Code>), como no exemplo do APG: pelo teclado, use ↓ e Esc.</>}
            en={<>The open and clear buttons are out of the Tab order (<Code>tabIndex=-1</Code>), as in the APG example: from the keyboard, use ↓ and Esc.</>}
          />
        </Callout>
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Rótulo, lista e opções com papéis e relações ARIA explícitas.', en: 'Label, list and options with explicit ARIA roles and relationships.' } },
            { criterion: '2.1.1', description: { pt: 'Todas as funções disponíveis pelo teclado.', en: 'All functionality available from the keyboard.' } },
            { criterion: '2.4.7', description: { pt: 'Foco visível no campo e marca laranja na opção ativa.', en: 'Visible focus on the field and an orange marker on the active option.' } },
            { criterion: '4.1.2', description: { pt: <>Estado aberto/fechado em <Code>aria-expanded</Code>; seleção em <Code>aria-selected</Code>.</>, en: <>Open state in <Code>aria-expanded</Code>; selection in <Code>aria-selected</Code>.</> } },
            { criterion: '4.1.3', description: { pt: 'Contagem de resultados e "nenhum resultado" anunciados sem mover o foco.', en: 'Result count and "no results" announced without moving focus.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
