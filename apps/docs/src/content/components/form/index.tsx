import {
  Bullets,
  Callout,
  Code,
  CodeBlock,
  ComponentPage,
  DefinitionTable,
  Example,
  KeyboardTable,
  PropsTable,
  Section,
  WcagList,
} from '../../../kit'
import { T } from '../../../i18n'
import { ToastProvider } from '@orange/ui'
import Delivery from './examples/Delivery'
import DeliveryCode from './examples/Delivery?raw'
import Schedule from './examples/Schedule'
import ScheduleCode from './examples/Schedule?raw'
import ServerError from './examples/ServerError'
import ServerErrorCode from './examples/ServerError?raw'
import SignUp from './examples/SignUp'
import SignUpCode from './examples/SignUp?raw'
import { meta } from './meta'

const statusCode = `import { Alert, Button, Form, FormActions, TextField, useToast } from '@orange/ui'

// Toast: confirmação curta, a pessoa continua na mesma tela.
function Perfil() {
  const { toast } = useToast() // ToastProvider na raiz da aplicação
  return (
    <Form
      onSubmit={async (values) => {
        await salvarPerfil(values)
        toast({ title: 'Perfil atualizado', tone: 'success' })
      }}
    >
      {({ isSubmitting }) => (
        <>
          <TextField name="nome" label="Nome de exibição" />
          <FormActions>
            <Button type="submit" loading={isSubmitting}>Salvar</Button>
          </FormActions>
        </>
      )}
    </Form>
  )
}

// Alert: mensagem que fica no lugar, ligada ao formulário.
{enviado && (
  <Alert tone="success" live title="Pedido enviado">
    Você vai receber a confirmação por e-mail.
  </Alert>
)}`

export default function FormPage() {
  return (
    // Um ToastProvider para os exemplos da página, como na raiz de uma aplicação.
    <ToastProvider>
      <ComponentPage meta={meta}>
        <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
          <Bullets
            items={[
              {
                pt: 'Valide no envio, não enquanto a pessoa digita. Depois de um envio com erros, os erros somem assim que são corrigidos — e erros novos só aparecem no próximo envio.',
                en: 'Validate on submit, not while people type. After a submit with errors, errors disappear as soon as they are fixed — and new errors only show up on the next submit.',
              },
              {
                pt: (
                  <>
                    Todo campo precisa de <Code>name</Code>: é a chave dos valores, dos erros e do link no resumo. Passe o erro
                    para o campo com <Code>error={'{errors.email}'}</Code> (render-prop) ou <Code>getError('email')</Code>{' '}
                    (<Code>useForm()</Code>).
                  </>
                ),
                en: (
                  <>
                    Every field needs a <Code>name</Code>: it keys the values, the errors and the summary link. Pass the error to
                    the field with <Code>error={'{errors.email}'}</Code> (render prop) or <Code>getError('email')</Code>{' '}
                    (<Code>useForm()</Code>).
                  </>
                ),
              },
              {
                pt: 'Escreva mensagens que digam como corrigir ("Informe um e-mail no formato nome@empresa.com"), não só o que está errado ("E-mail inválido").',
                en: 'Write messages that say how to fix the problem ("Enter an email like name@company.com"), not just what is wrong ("Invalid email").',
              },
              {
                pt: (
                  <>
                    Erros do servidor vão em <Code>errors</Code>, somados aos de validação. Limpe-os no início do próximo envio.
                  </>
                ),
                en: (
                  <>
                    Server errors go in <Code>errors</Code>, merged with validation errors. Clear them at the start of the next
                    submit.
                  </>
                ),
              },
              {
                pt: (
                  <>
                    Não desabilite o botão de envio enquanto há erros — a pessoa precisa enviar para descobrir o que falta. Durante o
                    envio, use <Code>loading={'{isSubmitting}'}</Code> no <Code>Button</Code>.
                  </>
                ),
                en: (
                  <>
                    Do not disable the submit button while there are errors — people need to submit to find out what is missing.
                    While submitting, use <Code>loading={'{isSubmitting}'}</Code> on the <Code>Button</Code>.
                  </>
                ),
              },
            ]}
          />
        </Section>

        <Section title={{ pt: 'Como funciona', en: 'How it works' }}>
          <DefinitionTable
            rows={[
              {
                term: { pt: 'Antes do primeiro envio', en: 'Before the first submit' },
                description: {
                  pt: 'Nada é validado nem exibido. O formulário usa noValidate: o navegador não mostra os balões nativos.',
                  en: 'Nothing is validated or shown. The form uses noValidate: the browser does not show its native bubbles.',
                },
              },
              {
                term: { pt: 'Envio com erros', en: 'Submit with errors' },
                description: {
                  pt: (
                    <>
                      <Code>validate(values)</Code> roda com os valores lidos por <Code>FormData</Code>. Com erros, o envio é
                      cancelado, o <Code>ErrorSummary</Code> aparece no topo (na ordem dos campos) e recebe o foco, e cada campo mostra
                      sua mensagem. A cada novo envio com erros, o foco volta ao resumo.
                    </>
                  ),
                  en: (
                    <>
                      <Code>validate(values)</Code> runs with the values read through <Code>FormData</Code>. With errors, submission is
                      cancelled, the <Code>ErrorSummary</Code> appears at the top (in field order) and receives focus, and each field
                      shows its message. On every new submit with errors, focus returns to the summary.
                    </>
                  ),
                },
              },
              {
                term: { pt: 'Corrigindo', en: 'Fixing' },
                description: {
                  pt: 'Depois de um envio com erros, o formulário valida de novo a cada alteração (digitar, escolher uma opção, sair do campo) e tira os erros corrigidos do campo e do resumo. Um campo que estava válido e ficou inválido só ganha erro no próximo envio ("recompense cedo, puna tarde").',
                  en: 'After a submit with errors, the form validates again on every change (typing, choosing an option, leaving the field) and removes fixed errors from the field and the summary. A field that was valid and became invalid only gets an error on the next submit ("reward early, punish late").',
                },
              },
              {
                term: { pt: 'Erros externos', en: 'External errors' },
                description: {
                  pt: (
                    <>
                      <Code>errors</Code> (ex.: da API) aparece junto com a validação e move o foco para o resumo quando chega um erro
                      novo. Cada erro externo some quando o valor do campo muda e volta se <Code>errors</Code> mudar. Erros externos
                      não bloqueiam o envio: o servidor decide de novo.
                    </>
                  ),
                  en: (
                    <>
                      <Code>errors</Code> (e.g. from the API) shows up together with validation and moves focus to the summary when a
                      new error arrives. Each external error disappears when the field value changes and comes back if{' '}
                      <Code>errors</Code> changes. External errors do not block submission: the server decides again.
                    </>
                  ),
                },
              },
              {
                term: { pt: 'Envio assíncrono', en: 'Async submit' },
                description: {
                  pt: (
                    <>
                      Se <Code>onSubmit</Code> retorna uma promessa, o formulário fica com <Code>aria-busy="true"</Code>,{' '}
                      <Code>isSubmitting</Code> vale <Code>true</Code> e novos envios (clique ou Enter) são ignorados até ela terminar.
                      Trate falhas dentro do <Code>onSubmit</Code> (try/catch) e devolva-as em <Code>errors</Code>.
                    </>
                  ),
                  en: (
                    <>
                      If <Code>onSubmit</Code> returns a promise, the form gets <Code>aria-busy="true"</Code>,{' '}
                      <Code>isSubmitting</Code> is <Code>true</Code> and new submits (click or Enter) are ignored until it settles. Handle
                      failures inside <Code>onSubmit</Code> (try/catch) and return them through <Code>errors</Code>.
                    </>
                  ),
                },
              },
              {
                term: { pt: 'Envio válido', en: 'Valid submit' },
                description: {
                  pt: (
                    <>
                      <Code>onSubmit(values, event)</Code> é chamado e nada é exibido por padrão (veja "Depois do envio"). Sem{' '}
                      <Code>onSubmit</Code>, o envio nativo segue para <Code>action</Code>. Um botão <Code>type="reset"</Code> limpa os
                      erros e o contador de envios.
                    </>
                  ),
                  en: (
                    <>
                      <Code>onSubmit(values, event)</Code> is called and nothing is shown by default (see "After submitting"). Without{' '}
                      <Code>onSubmit</Code>, native submission proceeds to <Code>action</Code>. A <Code>type="reset"</Code> button clears
                      the errors and the submit count.
                    </>
                  ),
                },
              },
            ]}
          />
        </Section>

        <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
          <Example
            title={{ pt: 'Cadastro', en: 'Sign-up' }}
            description={{
              pt: 'Envie vazio: o resumo aparece e recebe o foco; clique em um erro para ir ao campo. Os erros somem conforme você corrige.',
              en: 'Submit it empty: the summary appears and receives focus; click an error to go to the field. Errors disappear as you fix them.',
            }}
            code={SignUpCode}
          >
            <SignUp />
          </Example>
          <Example
            title={{ pt: 'Endereço de entrega', en: 'Delivery address' }}
            description={{
              pt: 'Fieldset, Select e RadioGroup no mesmo formulário. O link de um grupo de opções foca a opção marcada ou a primeira.',
              en: 'Fieldset, Select and RadioGroup in the same form. A link to an option group focuses the checked or first option.',
            }}
            code={DeliveryCode}
          >
            <Delivery />
          </Example>
          <Example
            title={{ pt: 'Envio assíncrono com erro do servidor', en: 'Async submit with a server error' }}
            description={{
              pt: 'Durante o envio, o botão mostra o carregamento e o formulário ignora novos envios. O erro "e-mail já cadastrado" vem da API por errors.',
              en: 'While submitting, the button shows loading and the form ignores new submits. The "email already registered" error comes from the API through errors.',
            }}
            code={ServerErrorCode}
          >
            <ServerError />
          </Example>
          <Example
            title={{ pt: 'Select, DatePicker e useForm()', en: 'Select, DatePicker and useForm()' }}
            description={{
              pt: 'Campos em um componente próprio leem os erros com useForm(). O DatePicker envia a data como AAAA-MM-DD.',
              en: 'Fields in their own component read errors with useForm(). DatePicker submits the date as YYYY-MM-DD.',
            }}
            code={ScheduleCode}
          >
            <Schedule />
          </Example>
        </Section>

        <Section title={{ pt: 'Campos e valores', en: 'Fields and values' }}>
          <p>
            <T
              pt={
                <>
                  Os valores vêm de <Code>new FormData(form)</Code>: cada controle com <Code>name</Code> vira uma chave. Vários
                  controles com o mesmo <Code>name</Code> viram uma lista (só quando há dois ou mais valores). Caixas desmarcadas e
                  campos de arquivo vazios ficam de fora. O botão que enviou entra se tiver <Code>name</Code>.
                </>
              }
              en={
                <>
                  Values come from <Code>new FormData(form)</Code>: every control with a <Code>name</Code> becomes a key. Several
                  controls with the same <Code>name</Code> become a list (only when there are two or more values). Unchecked boxes and
                  empty file fields are left out. The submit button is included when it has a <Code>name</Code>.
                </>
              }
            />
          </p>
          <DefinitionTable
            rows={[
              {
                term: { pt: 'name no controle nativo', en: 'name on the native control' },
                description: {
                  pt: 'TextField, TextArea, PasswordField, Search, TimeField, ColorField, Select, Checkbox, CheckboxGroup, RadioGroup, SegmentedControl, Rating, Slider (com range, dois valores → lista) e FileUploader (File).',
                  en: 'TextField, TextArea, PasswordField, Search, TimeField, ColorField, Select, Checkbox, CheckboxGroup, RadioGroup, SegmentedControl, Rating, Slider (with range, two values → list) and FileUploader (File).',
                },
              },
              {
                term: { pt: 'name em input oculto', en: 'name on a hidden input' },
                description: {
                  pt: 'Combobox (valor da opção), MultiSelect e TagInput (um por item → lista), DatePicker (AAAA-MM-DD), NumberField (número sem formatação), CurrencyField, PinInput e Switch (value quando ligado). O link do resumo foca o controle visível do campo.',
                  en: 'Combobox (option value), MultiSelect and TagInput (one per item → list), DatePicker (YYYY-MM-DD), NumberField (unformatted number), CurrencyField, PinInput and Switch (value when on). The summary link focuses the visible control of the field.',
                },
              },
              {
                term: { pt: 'Sem input quando vazio', en: 'No input when empty' },
                description: {
                  pt: (
                    <>
                      MultiSelect e TagInput sem itens e Switch desligado não renderizam o input oculto. Para que o link do resumo
                      encontre o campo, dê ao componente um <Code>id</Code> igual ao <Code>name</Code>.
                    </>
                  ),
                  en: (
                    <>
                      MultiSelect and TagInput with no items and a Switch that is off do not render the hidden input. So that the
                      summary link finds the field, give the component an <Code>id</Code> equal to its <Code>name</Code>.
                    </>
                  ),
                },
              },
              {
                term: { pt: 'RadioGroup', en: 'RadioGroup' },
                description: {
                  pt: (
                    <>
                      Sem <Code>name</Code>, o grupo gera um nome automático — sempre informe o <Code>name</Code> para ler o valor.
                    </>
                  ),
                  en: (
                    <>
                      Without <Code>name</Code>, the group generates one automatically — always set <Code>name</Code> to read the value.
                    </>
                  ),
                },
              },
            ]}
          />
        </Section>

        <Section title={{ pt: 'Depois do envio', en: 'After submitting' }}>
          <p>
            <T
              pt={
                <>
                  O <Code>Form</Code> não mostra mensagem de sucesso: quem decide é a tela. Para uma confirmação curta, chame{' '}
                  <Code>toast()</Code> no fim do <Code>onSubmit</Code>; para uma mensagem que fica no lugar, mostre um{' '}
                  <Code>Alert</Code> com <Code>live</Code> no topo do formulário (anunciado por <Code>role="status"</Code>). Se a
                  tela muda depois do envio, mova o foco para o título da próxima tela.
                </>
              }
              en={
                <>
                  <Code>Form</Code> does not show a success message: the screen decides. For a short confirmation, call{' '}
                  <Code>toast()</Code> at the end of <Code>onSubmit</Code>; for a message that stays in place, show an{' '}
                  <Code>Alert</Code> with <Code>live</Code> at the top of the form (announced by <Code>role="status"</Code>). If the
                  screen changes after submitting, move focus to the next screen's heading.
                </>
              }
            />
          </p>
          <CodeBlock code={statusCode} language="tsx" />
          <Callout tone="info" title={{ pt: 'Erros não vão em toasts', en: 'Errors do not go in toasts' }}>
            <T
              pt="Toasts somem sozinhos e ficam longe do campo. Erros de formulário vão no resumo e junto do campo (errors)."
              en="Toasts disappear on their own and sit far from the field. Form errors go in the summary and next to the field (errors)."
            />
          </Callout>
        </Section>

        <Section title={{ pt: 'Movimento', en: 'Motion' }}>
          <p>
            <T
              pt={<>O <Code>Form</Code> não anima nada por conta própria: reaproveita o movimento do <Code>ErrorSummary</Code> e dos campos, para que nada se mova duas vezes. Com <Code>prefers-reduced-motion</Code>, as durações vão a zero e os estados mudam na hora.</>}
              en={<><Code>Form</Code> does not animate anything itself: it reuses the motion of <Code>ErrorSummary</Code> and the fields, so nothing moves twice. With <Code>prefers-reduced-motion</Code>, durations drop to zero and states change instantly.</>}
            />
          </p>
          <DefinitionTable
            rows={[
              {
                term: { pt: 'Resumo aparece', en: 'Summary appears' },
                description: {
                  pt: 'Desce deslizando (or-slide-down-in, 250ms, --or-ease-out) e os erros entram em sequência, 40ms entre itens. Em envios seguintes com erros, o resumo continua montado e só recebe o foco — sem repetir a entrada.',
                  en: 'Slides down (or-slide-down-in, 250ms, --or-ease-out) and errors enter in sequence, 40ms apart. On later submits with errors, the summary stays mounted and only receives focus — the entrance does not replay.',
                },
              },
              {
                term: { pt: 'Erro no campo', en: 'Field error' },
                description: {
                  pt: 'A mensagem entra com fade e 4px de deslocamento (250ms). TextField, TextArea, Checkbox, RadioGroup e CheckboxGroup tremem uma vez (or-shake, 400ms) quando passam a ficar inválidos — não de novo enquanto o erro continua.',
                  en: 'The message fades in with a 4px offset (250ms). TextField, TextArea, Checkbox, RadioGroup and CheckboxGroup shake once (or-shake, 400ms) when they become invalid — not again while the error remains.',
                },
              },
              {
                term: { pt: 'Erros corrigidos', en: 'Fixed errors' },
                description: {
                  pt: 'O item sai da lista e a mensagem do campo some; quando não sobra nenhum erro, o resumo sai com fade de 160ms (--or-ease-in-out).',
                  en: 'The item leaves the list and the field message goes away; when no error is left, the summary fades out in 160ms (--or-ease-in-out).',
                },
              },
              {
                term: { pt: 'Enviando', en: 'Submitting' },
                description: {
                  pt: 'O spinner do Button (loading) gira em loop enquanto a promessa está pendente; o cursor vira "progress" sobre o formulário.',
                  en: 'The Button spinner (loading) loops while the promise is pending; the cursor becomes "progress" over the form.',
                },
              },
            ]}
          />
        </Section>

        <Section title="Props" id="props">
          <PropsTable
            caption={{ pt: 'Form', en: 'Form' }}
            rows={[
              { name: 'validate', type: '(values: FormValues) => FormErrors', description: { pt: <>Validação síncrona; retorne uma mensagem por <Code>name</Code> inválido.</>, en: <>Synchronous validation; return one message per invalid <Code>name</Code>.</> } },
              { name: 'onSubmit', type: '(values, event) => void | Promise<void>', description: { pt: 'Chamado só sem erros de validação. Uma promessa liga isSubmitting e aria-busy e bloqueia envio duplo.', en: 'Called only without validation errors. A promise turns on isSubmitting and aria-busy and blocks double submission.' } },
              { name: 'errors', type: 'Record<string, string | undefined>', description: { pt: 'Erros externos (servidor), somados aos de validação.', en: 'External (server) errors, merged with validation errors.' } },
              { name: 'errorSummary', type: 'boolean', default: 'true', description: { pt: 'Mostra o ErrorSummary no topo. Com false, o foco vai para o primeiro campo inválido.', en: 'Shows the ErrorSummary at the top. With false, focus goes to the first invalid field.' } },
              { name: 'errorSummaryTitle', type: 'ReactNode', default: "'Corrija os seguintes erros'", description: { pt: 'Título do resumo.', en: 'Summary title.' } },
              { name: 'gap', type: "'sm' | 'md' | 'lg'", default: "'md'", description: { pt: 'Espaço entre os filhos: 12, 20 ou 32px.', en: 'Space between children: 12, 20 or 32px.' } },
              { name: 'children', type: 'ReactNode | ((state: FormState) => ReactNode)', description: { pt: 'Conteúdo, ou função que recebe o estado.', en: 'Content, or a function that receives the state.' } },
              { name: '...rest', type: 'FormHTMLAttributes', description: { pt: <>Atributos nativos e <Code>ref</Code> vão para o <Code>&lt;form noValidate&gt;</Code>.</>, en: <>Native attributes and <Code>ref</Code> go to the <Code>&lt;form noValidate&gt;</Code>.</> } },
            ]}
          />
          <PropsTable
            caption={{ pt: 'FormState (render-prop e useForm())', en: 'FormState (render prop and useForm())' }}
            rows={[
              { name: 'errors', type: 'Record<string, string>', description: { pt: 'Erros visíveis agora, por name.', en: 'Errors visible right now, by name.' } },
              { name: 'getError', type: '(name: string) => string | undefined', description: { pt: 'Erro visível de um campo.', en: 'Visible error of a field.' } },
              { name: 'isSubmitting', type: 'boolean', description: { pt: 'true enquanto a promessa do onSubmit está pendente.', en: 'true while the onSubmit promise is pending.' } },
              { name: 'submitCount', type: 'number', description: { pt: 'Tentativas de envio, válidas ou não.', en: 'Submit attempts, valid or not.' } },
              { name: 'isValid', type: 'boolean', description: { pt: 'true quando não há erros visíveis (sempre true antes do primeiro envio).', en: 'true when there are no visible errors (always true before the first submit).' } },
            ]}
          />
          <PropsTable
            caption={{ pt: 'FormActions', en: 'FormActions' }}
            rows={[
              { name: 'align', type: "'start' | 'end' | 'between'", default: "'start'", description: { pt: 'Alinhamento da linha de botões; quebra linha em telas estreitas.', en: 'Alignment of the button row; wraps on narrow screens.' } },
              { name: '...rest', type: 'HTMLAttributes<HTMLDivElement>', description: { pt: 'Atributos nativos do <div>.', en: 'Native <div> attributes.' } },
            ]}
          />
        </Section>

        <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
          <p>
            <T
              pt={
                <>
                  Segue o padrão de erros do GOV.UK. Ao enviar com erros, o foco vai para o resumo, que é lido pelo leitor de tela
                  (título e lista). Cada link leva ao campo: a página rola até o rótulo (ou a legenda do grupo) e o foco vai para o
                  controle. Os campos recebem <Code>aria-invalid</Code> e a mensagem por <Code>aria-describedby</Code>, via{' '}
                  <Code>Field</Code>. Durante o envio, o formulário fica com <Code>aria-busy="true"</Code> e o{' '}
                  <Code>Button</Code> em <Code>loading</Code> anuncia o status.
                </>
              }
              en={
                <>
                  Follows the GOV.UK error pattern. On a submit with errors, focus moves to the summary, which screen readers read
                  (title and list). Each link goes to the field: the page scrolls to the label (or the group legend) and focus moves
                  to the control. Fields get <Code>aria-invalid</Code> and the message through <Code>aria-describedby</Code>, via{' '}
                  <Code>Field</Code>. While submitting, the form has <Code>aria-busy="true"</Code> and a <Code>loading</Code>{' '}
                  <Code>Button</Code> announces the status.
                </>
              }
            />
          </p>
          <KeyboardTable
            rows={[
              { keys: ['Enter'], description: { pt: 'Num campo de texto, envia o formulário (envio implícito); ignorado durante um envio.', en: 'In a text field, submits the form (implicit submission); ignored during a submit.' } },
              { keys: ['Tab'], description: { pt: 'A partir do resumo focado, percorre os links de erro e depois os campos.', en: 'From the focused summary, moves through the error links and then the fields.' } },
              { keys: ['Enter'], description: { pt: 'Num link do resumo, foca o campo do erro.', en: 'On a summary link, focuses the field with the error.' } },
            ]}
          />
          <WcagList
            items={[
              { criterion: '2.4.3', description: { pt: 'Foco vai para o resumo após o envio e dele para cada campo, na ordem do formulário.', en: 'Focus goes to the summary after submitting and from it to each field, in form order.' } },
              { criterion: '3.3.1', description: { pt: 'Erros identificados em texto no resumo e junto de cada campo.', en: 'Errors identified in text in the summary and next to each field.' } },
              { criterion: '3.3.3', description: { pt: 'As mensagens sugerem como corrigir; erros corrigidos somem na hora.', en: 'Messages suggest how to fix the problem; fixed errors go away immediately.' } },
              { criterion: '4.1.3', description: { pt: <>O resumo é anunciado ao receber o foco; o envio em andamento é exposto com <Code>aria-busy</Code> e o status do Button.</>, en: <>The summary is announced when it receives focus; an ongoing submit is exposed with <Code>aria-busy</Code> and the Button status.</> } },
            ]}
          />
        </Section>
      </ComponentPage>
    </ToastProvider>
  )
}
