import { Bullets, Code, ComponentPage, Example, KeyboardTable, PropsTable, Section, WcagList } from '../../../kit'
import { T } from '../../../i18n'
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import Custom from './examples/Custom'
import CustomCode from './examples/Custom?raw'
import SignUpForm from './examples/SignUpForm'
import SignUpFormCode from './examples/SignUpForm?raw'
import { meta } from './meta'

export default function ErrorSummaryPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Mostre o resumo no topo do formulário depois de uma tentativa de envio — não enquanto a pessoa ainda está preenchendo.',
              en: 'Show the summary at the top of the form after a submit attempt — not while people are still filling it in.',
            },
            {
              pt: 'Use as mesmas mensagens exibidas junto aos campos, na mesma ordem do formulário.',
              en: 'Use the same messages shown next to the fields, in the same order as the form.',
            },
            {
              pt: (
                <>
                  O <Code>id</Code> de cada erro é o <Code>id</Code> do campo. Para grupos (RadioGroup, CheckboxGroup), use o
                  id do grupo: o link foca a opção marcada ou a primeira.
                </>
              ),
              en: (
                <>
                  Each error <Code>id</Code> is the field <Code>id</Code>. For groups (RadioGroup, CheckboxGroup), use the group
                  id: the link focuses the checked or first option.
                </>
              ),
            },
            {
              pt: (
                <>
                  Para focar de novo a cada envio, mude a <Code>key</Code> do componente (ou chame <Code>ref.current.focus()</Code>).
                  O foco não é movido enquanto a lista diminui, para não interromper a correção.
                </>
              ),
              en: (
                <>
                  To refocus on every submit, change the component <Code>key</Code> (or call <Code>ref.current.focus()</Code>).
                  Focus is not moved while the list shrinks, so corrections are not interrupted.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example title={{ pt: 'Básico', en: 'Basic' }} description={{ pt: 'Clique em um erro para ir até o campo.', en: 'Click an error to go to the field.' }} code={BasicCode}>
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Formulário com validação', en: 'Form with validation' }}
          description={{
            pt: 'Envie o formulário vazio: o resumo aparece, recebe o foco e é anunciado.',
            en: 'Submit the empty form: the summary appears, receives focus and is announced.',
          }}
          code={SignUpFormCode}
        >
          <SignUpForm />
        </Example>
        <Example title={{ pt: 'Título e descrição', en: 'Title and description' }} code={CustomCode}>
          <Custom />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'errors', type: '{ id: string; message: ReactNode }[]', required: true, description: { pt: 'Erros; com lista vazia, nada é renderizado.', en: 'Errors; with an empty list, nothing is rendered.' } },
            { name: 'title', type: 'ReactNode', default: "'Corrija os seguintes erros'", description: { pt: 'Título do painel.', en: 'Panel title.' } },
            { name: 'description', type: 'ReactNode', description: { pt: 'Texto entre o título e a lista.', en: 'Text between the title and the list.' } },
            { name: 'autoFocus', type: 'boolean', default: 'true', description: { pt: <>Foca o painel ao aparecer. Com <Code>false</Code>, usa <Code>role="alert"</Code>.</>, en: <>Focuses the panel when it appears. With <Code>false</Code>, uses <Code>role="alert"</Code>.</> } },
            { name: 'headingLevel', type: '2 | 3 | 4 | 5 | 6', default: '2', description: { pt: 'Nível do título.', en: 'Heading level.' } },
            { name: 'onItemClick', type: '(item, event) => void', description: { pt: <>Chamado ao clicar em um erro; <Code>preventDefault()</Code> cancela o foco automático.</>, en: <>Called when an error is clicked; <Code>preventDefault()</Code> cancels the automatic focus.</> } },
            { name: '...rest', type: 'HTMLAttributes', description: { pt: <>Atributos nativos e <Code>ref</Code> vão para o <Code>&lt;section&gt;</Code>.</>, en: <>Native attributes and <Code>ref</Code> go to the <Code>&lt;section&gt;</Code>.</> } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={<>Um <Code>&lt;section&gt;</Code> nomeado pelo título, com <Code>tabIndex=-1</Code>: ao aparecer, recebe o foco e o leitor de tela lê o título e a lista. Cada erro é um link <Code>href="#id"</Code>; ao ativá-lo, a página rola até o rótulo (ou legenda) e o foco vai para o campo, sem depender do comportamento de âncoras do navegador.</>}
            en={<>A <Code>&lt;section&gt;</Code> named by its title, with <Code>tabIndex=-1</Code>: when it appears, it receives focus and screen readers read the title and list. Each error is an <Code>href="#id"</Code> link; activating it scrolls to the label (or legend) and moves focus to the field, without relying on browser anchor behavior.</>}
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Percorre os links de erro.', en: 'Moves through the error links.' } },
            { keys: ['Enter'], description: { pt: 'Vai até o campo do erro e o foca.', en: 'Goes to the error field and focuses it.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '2.4.3', description: { pt: 'Foco movido para o resumo e dele para o campo, em ordem lógica.', en: 'Focus moves to the summary and from it to the field, in a logical order.' } },
            { criterion: '3.3.1', description: { pt: 'Erros identificados e descritos em texto.', en: 'Errors identified and described in text.' } },
            { criterion: '3.3.3', description: { pt: 'Mensagens sugerem como corrigir.', en: 'Messages suggest how to fix the problem.' } },
            { criterion: '4.1.3', description: { pt: <>Sem foco automático, o resumo usa <Code>role="alert"</Code>.</>, en: <>Without autofocus, the summary uses <Code>role="alert"</Code>.</> } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
