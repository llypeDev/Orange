import { Bullets, Code, ComponentPage, DoDont, Example, KeyboardTable, PropsTable, Section, WcagList } from '../../../kit'
import { T } from '../../../i18n'
import { Search } from '@orange/ui'
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import Debounced from './examples/Debounced'
import DebouncedCode from './examples/Debounced?raw'
import Loading from './examples/Loading'
import LoadingCode from './examples/Loading?raw'
import Sizes from './examples/Sizes'
import SizesCode from './examples/Sizes?raw'
import { meta } from './meta'

export default function SearchPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: <>Sempre informe <Code>label</Code>, mesmo com o rótulo oculto (padrão): é ele que leitores de tela anunciam e que nomeia o landmark de busca.</>,
              en: <>Always provide <Code>label</Code>, even with the label hidden (default): it is what screen readers announce and what names the search landmark.</>,
            },
            {
              pt: 'Diga no placeholder o que pode ser buscado ("Nome, e-mail ou CNPJ"), não apenas "Buscar".',
              en: 'Use the placeholder to say what can be searched ("Name, e-mail or tax ID"), not just "Search".',
            },
            {
              pt: <>Para filtrar enquanto digita, use <Code>debounce</Code> (200–400 ms) e anuncie a quantidade de resultados em uma região <Code>role="status"</Code>.</>,
              en: <>To filter as you type, use <Code>debounce</Code> (200–400 ms) and announce the result count in a <Code>role="status"</Code> region.</>,
            },
            {
              pt: <>Para escolher um valor de uma lista (e não buscar conteúdo), use <strong>Combobox</strong>.</>,
              en: <>To pick a value from a list (rather than searching content), use <strong>Combobox</strong>.</>,
            },
          ]}
        />
        <DoDont
          doExample={<Search label="Buscar pedidos" placeholder="Número do pedido ou cliente" />}
          dontExample={<Search label="Buscar" placeholder="Buscar" />}
          doItems={[{ pt: 'Rótulo e placeholder específicos.', en: 'Specific label and placeholder.' }]}
          dontItems={[{ pt: 'Rótulo genérico que não diz o que é buscado.', en: 'Generic label that does not say what is searched.' }]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Básico', en: 'Basic' }}
          description={{ pt: 'Enter envia a busca. O botão de limpar aparece quando há texto e devolve o foco ao campo; Escape também limpa.', en: 'Enter submits the search. The clear button appears when there is text and returns focus to the field; Escape clears too.' }}
          code={BasicCode}
        >
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Filtrar enquanto digita', en: 'Filter as you type' }}
          description={{ pt: <>Com <Code>debounce</Code>, <Code>onChange</Code> só é chamado após uma pausa na digitação. Aqui o rótulo está visível.</>, en: <>With <Code>debounce</Code>, <Code>onChange</Code> is only called after a typing pause. Here the label is visible.</> }}
          code={DebouncedCode}
        >
          <Debounced />
        </Example>
        <Example
          title={{ pt: 'Carregando', en: 'Loading' }}
          description={{ pt: 'Durante buscas no servidor, a lupa vira um indicador de carregamento.', en: 'During server searches, the magnifier turns into a loading indicator.' }}
          code={LoadingCode}
        >
          <Loading />
        </Example>
        <Example title={{ pt: 'Tamanhos e desabilitado', en: 'Sizes and disabled' }} code={SizesCode}>
          <Sizes />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'label', type: 'ReactNode', required: true, description: { pt: 'Rótulo do campo (oculto por padrão). Também nomeia o formulário de busca.', en: 'Field label (hidden by default). Also names the search form.' } },
            { name: 'hideLabel', type: 'boolean', default: 'true', description: { pt: 'Oculta o rótulo visualmente.', en: 'Visually hides the label.' } },
            { name: 'description', type: 'ReactNode', description: { pt: 'Texto de ajuda.', en: 'Help text.' } },
            { name: 'value / defaultValue', type: 'string', description: { pt: 'Texto (controlado / inicial).', en: 'Text (controlled / initial).' } },
            { name: 'onChange', type: '(value: string) => void', description: { pt: 'Texto alterado (com atraso se houver debounce).', en: 'Text changed (delayed when debounce is set).' } },
            { name: 'onSearch', type: '(value: string) => void', description: { pt: 'Enter ou envio do formulário.', en: 'Enter or form submit.' } },
            { name: 'onClear', type: '() => void', description: { pt: 'Campo limpo pelo botão ou Escape.', en: 'Field cleared by the button or Escape.' } },
            { name: 'debounce', type: 'number', description: { pt: 'Atraso em ms para chamar onChange.', en: 'Delay in ms before calling onChange.' } },
            { name: 'loading', type: 'boolean', default: 'false', description: { pt: 'Indicador de carregamento no lugar da lupa.', en: 'Loading indicator in place of the magnifier.' } },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: { pt: 'Altura do controle.', en: 'Control height.' } },
            { name: 'formProps', type: 'FormHTMLAttributes', description: { pt: <>Atributos do <Code>&lt;form role="search"&gt;</Code> (ex.: <Code>action</Code>).</>, en: <>Attributes for the <Code>&lt;form role="search"&gt;</Code> (e.g. <Code>action</Code>).</> } },
            { name: '...rest', type: 'InputHTMLAttributes', description: { pt: 'Atributos do input (a ref aponta para ele).', en: 'Input attributes (the ref points to it).' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={<>Renderiza <Code>&lt;form role="search"&gt;</Code> — um landmark que leitores de tela listam para navegação rápida — com um <Code>&lt;input type="search"&gt;</Code> rotulado. A lupa é decorativa; o botão de limpar tem nome acessível ("Limpar") e devolve o foco ao campo.</>}
            en={<>Renders <Code>&lt;form role="search"&gt;</Code> — a landmark screen readers list for quick navigation — with a labelled <Code>&lt;input type="search"&gt;</Code>. The magnifier is decorative; the clear button has an accessible name ("Clear") and returns focus to the field.</>}
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Enter'], description: { pt: 'Envia a busca (onSearch).', en: 'Submits the search (onSearch).' } },
            { keys: ['Esc'], description: { pt: 'Limpa o texto. Com o campo vazio, o evento segue (ex.: fecha um modal).', en: 'Clears the text. With an empty field, the event propagates (e.g. closes a modal).' } },
            { keys: ['Tab'], description: { pt: 'Vai do campo para o botão de limpar.', en: 'Moves from the field to the clear button.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Landmark de busca e rótulo associado ao campo.', en: 'Search landmark and a label tied to the field.' } },
            { criterion: '2.4.1', description: { pt: 'O landmark permite pular direto para a busca.', en: 'The landmark lets users jump straight to search.' } },
            { criterion: '2.4.7', description: { pt: 'Foco visível no campo e no botão de limpar.', en: 'Visible focus on the field and the clear button.' } },
            { criterion: '3.3.2', description: { pt: 'Rótulo sempre presente, mesmo quando oculto.', en: 'Label always present, even when hidden.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
