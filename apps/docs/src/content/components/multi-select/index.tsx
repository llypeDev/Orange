import { Bullets, Code, ComponentPage, Example, KeyboardTable, PropsTable, Section, WcagList } from '../../../kit'
import { T } from '../../../i18n'
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import Controlled from './examples/Controlled'
import ControlledCode from './examples/Controlled?raw'
import MaxSelected from './examples/MaxSelected'
import MaxSelectedCode from './examples/MaxSelected?raw'
import States from './examples/States'
import StatesCode from './examples/States?raw'
import { meta } from './meta'

export default function MultiSelectPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use para escolher vários itens de uma lista conhecida (habilidades, filtros, destinatários). Com poucas opções sempre visíveis, prefira um grupo de checkboxes.',
              en: 'Use it to choose several items from a known list (skills, filters, recipients). With few always-visible options, prefer a checkbox group.',
            },
            {
              pt: <>Para valores livres digitados pelo usuário (palavras-chave, e-mails), use <strong>TagInput</strong>.</>,
              en: <>For free values typed by the user (keywords, e-mails), use <strong>TagInput</strong>.</>,
            },
            {
              pt: <>Se houver limite, informe-o na descrição e use <Code>maxSelected</Code>: as demais opções ficam indisponíveis e o motivo é exibido na lista.</>,
              en: <>If there is a limit, state it in the description and use <Code>maxSelected</Code>: the remaining options become unavailable and the reason is shown in the list.</>,
            },
            {
              pt: 'Mantenha os rótulos curtos — eles viram chips. Use a descrição da opção para detalhes.',
              en: 'Keep labels short — they become chips. Use the option description for details.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Básico', en: 'Basic' }}
          description={{ pt: 'A lista continua aberta enquanto você escolhe. Backspace com o campo vazio remove o último chip.', en: 'The list stays open while you choose. Backspace in the empty field removes the last chip.' }}
          code={BasicCode}
          minHeight={440}
        >
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Limite de seleção', en: 'Selection limit' }}
          description={{ pt: <>Com <Code>maxSelected</Code>, ao atingir o limite as outras opções ficam indisponíveis.</>, en: <>With <Code>maxSelected</Code>, the other options become unavailable once the limit is reached.</> }}
          code={MaxSelectedCode}
          minHeight={380}
        >
          <MaxSelected />
        </Example>
        <Example
          title={{ pt: 'Controlado: filtro de pedidos', en: 'Controlled: order filter' }}
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
            { name: 'options', type: 'MultiSelectOption[]', required: true, description: { pt: <>Opções <Code>{'{ value, label, description?, disabled? }'}</Code>.</>, en: <>Options <Code>{'{ value, label, description?, disabled? }'}</Code>.</> } },
            { name: 'value / defaultValue', type: 'string[]', description: { pt: 'Valores selecionados (controlado / inicial).', en: 'Selected values (controlled / initial).' } },
            { name: 'onChange', type: '(value: string[], options: MultiSelectOption[]) => void', description: { pt: 'Chamado a cada seleção ou remoção.', en: 'Called on every selection or removal.' } },
            { name: 'maxSelected', type: 'number', description: { pt: 'Limite de itens.', en: 'Item limit.' } },
            { name: 'onInputChange', type: '(text: string) => void', description: { pt: 'Chamado a cada digitação na busca.', en: 'Called on every search keystroke.' } },
            { name: 'filter', type: '((option, query) => boolean) | false', description: { pt: 'Filtro das opções (padrão sem acentos). false desliga.', en: 'Option filter (accent-insensitive by default). false disables it.' } },
            { name: 'loading', type: 'boolean', default: 'false', description: { pt: 'Mostra "Carregando…" na lista.', en: 'Shows "Loading…" in the list.' } },
            { name: 'emptyMessage', type: 'ReactNode', description: { pt: 'Mensagem sem resultados.', en: 'Message when there are no results.' } },
            { name: 'clearable', type: 'boolean', default: 'true', description: { pt: 'Mostra o botão "Limpar tudo".', en: 'Shows the "Clear all" button.' } },
            { name: 'open / defaultOpen / onOpenChange', type: 'boolean / (open) => void', description: { pt: 'Controle do estado aberto da lista.', en: 'Controls the open state of the list.' } },
            { name: 'label / hideLabel / description / error', type: 'ReactNode / boolean', description: { pt: 'Estrutura de campo (Field).', en: 'Field structure.' } },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: { pt: 'Altura mínima do controle.', en: 'Minimum control height.' } },
            { name: 'name', type: 'string', description: { pt: 'Envia um input oculto por valor.', en: 'Submits one hidden input per value.' } },
            { name: 'required / disabled / invalid', type: 'boolean', description: { pt: 'Estados do campo.', en: 'Field states.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={<>Mesmo padrão do Combobox (APG), com a lista marcada como <Code>aria-multiselectable="true"</Code> e cada opção com <Code>aria-selected</Code>. Os itens escolhidos ficam em uma lista "Itens selecionados" com botões "Remover …" acessíveis; inclusões e remoções são anunciadas em uma região <Code>role="status"</Code>. Ao remover um chip, o foco vai para o próximo chip ou volta ao campo.</>}
            en={<>Same pattern as Combobox (APG), with the list marked <Code>aria-multiselectable="true"</Code> and each option exposing <Code>aria-selected</Code>. Chosen items live in a "Selected items" list with accessible "Remove …" buttons; additions and removals are announced in a <Code>role="status"</Code> region. When a chip is removed, focus moves to the next chip or back to the field.</>}
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['↓', '↑'], description: { pt: 'Abre a lista ou move entre as opções.', en: 'Opens the list or moves between options.' } },
            { keys: ['Alt', '↓'], description: { pt: 'Abre a lista sem mover o foco visual.', en: 'Opens the list without moving visual focus.' } },
            { keys: ['Home', 'End'], description: { pt: 'Primeira/última opção (com uma opção ativa).', en: 'First/last option (with an active option).' } },
            { keys: ['Enter'], description: { pt: 'Marca ou desmarca a opção ativa; a lista continua aberta.', en: 'Toggles the active option; the list stays open.' } },
            { keys: ['Backspace'], description: { pt: 'Com o campo vazio, remove o último item.', en: 'With an empty field, removes the last item.' } },
            { keys: ['Esc'], description: { pt: 'Fecha a lista; depois, limpa a busca.', en: 'Closes the list; then clears the search.' } },
            { keys: ['Tab'], description: { pt: 'Percorre os botões de remover, o campo e "Limpar tudo".', en: 'Moves through remove buttons, the field and "Clear all".' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Itens selecionados expostos como lista; seleção nas opções com aria-selected.', en: 'Selected items exposed as a list; option selection via aria-selected.' } },
            { criterion: '2.1.1', description: { pt: 'Escolher, remover e limpar funcionam pelo teclado.', en: 'Choosing, removing and clearing work from the keyboard.' } },
            { criterion: '2.4.3', description: { pt: 'Ordem de foco previsível após remover itens.', en: 'Predictable focus order after removing items.' } },
            { criterion: '2.5.8', description: { pt: 'Botões de remover com área mínima de 24×24px.', en: 'Remove buttons with a minimum 24×24px target.' } },
            { criterion: '4.1.3', description: { pt: 'Inclusões, remoções, limite e contagem de resultados anunciados.', en: 'Additions, removals, limit and result count announced.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
