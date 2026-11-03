import {
  Bullets,
  Code,
  ComponentPage,
  Example,
  KeyboardTable,
  PropsTable,
  Section,
  WcagList,
} from '../../../kit'
import { T } from '../../../i18n'
import AsyncSave from './examples/AsyncSave'
import AsyncSaveCode from './examples/AsyncSave?raw'
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import Profile from './examples/Profile'
import ProfileCode from './examples/Profile?raw'
import Sizes from './examples/Sizes'
import SizesCode from './examples/Sizes?raw'
import WithButtons from './examples/WithButtons'
import WithButtonsCode from './examples/WithButtons?raw'
import { meta } from './meta'

export default function InlineEditPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use para ajustes pontuais em telas de leitura (nome de um projeto, um campo de perfil). Para formulários com vários campos obrigatórios, use um formulário normal com botão Salvar.',
              en: 'Use it for one-off tweaks on read screens (a project name, a profile field). For forms with several required fields, use a regular form with a Save button.',
            },
            {
              pt: (
                <>
                  Sempre passe <Code>label</Code>, mesmo sem mostrá-lo: ele forma o nome acessível
                  "Editar Nome do projeto: Checkout 2.0".
                </>
              ),
              en: (
                <>
                  Always pass <Code>label</Code>, even when hidden: it forms the accessible name
                  "Edit Project name: Checkout 2.0".
                </>
              ),
            },
            {
              pt: (
                <>
                  Se salvar envolve a rede, retorne uma Promise em <Code>onSave</Code>: o campo
                  mostra o carregamento e, se der erro, continua em edição com a mensagem.
                </>
              ),
              en: (
                <>
                  If saving involves the network, return a Promise from <Code>onSave</Code>: the
                  field shows a loading state and, on failure, stays in edit mode with the message.
                </>
              ),
            },
            {
              pt: (
                <>
                  Em campos sensíveis (e-mail, valores), use <Code>showButtons</Code> e{' '}
                  <Code>saveOnBlur={'{false}'}</Code> para que a pessoa confirme a alteração
                  explicitamente.
                </>
              ),
              en: (
                <>
                  For sensitive fields (email, amounts), use <Code>showButtons</Code> and{' '}
                  <Code>saveOnBlur={'{false}'}</Code> so people confirm the change explicitly.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Básico', en: 'Basic' }}
          description={{
            pt: 'Clique no valor (ou Enter com foco) para editar. Enter ou sair do campo salva; Escape cancela.',
            en: 'Click the value (or press Enter while focused) to edit. Enter or blur saves; Escape cancels.',
          }}
          code={BasicCode}
        >
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Salvamento assíncrono', en: 'Async save' }}
          description={{
            pt: 'onSave retorna uma Promise. Tente "Financeiro" para ver o erro do servidor, ou deixe vazio para ver a validação.',
            en: 'onSave returns a Promise. Try "Financeiro" to see the server error, or leave it empty to see validation.',
          }}
          code={AsyncSaveCode}
        >
          <AsyncSave />
        </Example>
        <Example
          title={{ pt: 'Com botões e validação', en: 'With buttons and validation' }}
          description={{
            pt: 'Salvar e Cancelar explícitos; sair do campo não salva.',
            en: 'Explicit Save and Cancel; leaving the field does not save.',
          }}
          code={WithButtonsCode}
        >
          <WithButtons />
        </Example>
        <Example
          title={{ pt: 'Perfil editável', en: 'Editable profile' }}
          description={{
            pt: 'Vários campos em uma lista de definição, com placeholder para valores vazios.',
            en: 'Several fields in a description list, with a placeholder for empty values.',
          }}
          code={ProfileCode}
        >
          <Profile />
        </Example>
        <Example title={{ pt: 'Tamanhos e estados', en: 'Sizes and states' }} code={SizesCode}>
          <Sizes />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            {
              name: 'label',
              type: 'string',
              required: true,
              description: {
                pt: 'Nome do campo para os nomes acessíveis.',
                en: 'Field name for accessible names.',
              },
            },
            {
              name: 'showLabel',
              type: 'boolean',
              default: 'false',
              description: {
                pt: 'Mostra o rótulo acima do valor.',
                en: 'Shows the label above the value.',
              },
            },
            {
              name: 'value / defaultValue',
              type: 'string',
              default: "''",
              description: {
                pt: 'Valor salvo (controlado / inicial).',
                en: 'Saved value (controlled / initial).',
              },
            },
            {
              name: 'onSave',
              type: '(value: string) => void | Promise<void>',
              description: {
                pt: 'Salva o novo valor; Promise rejeitada mantém a edição com erro.',
                en: 'Saves the new value; a rejected Promise keeps editing with an error.',
              },
            },
            {
              name: 'onCancel',
              type: '() => void',
              description: { pt: 'Edição cancelada.', en: 'Editing cancelled.' },
            },
            {
              name: 'validate',
              type: '(value: string) => string | null | undefined',
              description: {
                pt: 'Mensagem de erro que impede salvar.',
                en: 'Error message that prevents saving.',
              },
            },
            {
              name: 'placeholder',
              type: 'string',
              description: { pt: 'Texto quando não há valor.', en: 'Text when there is no value.' },
            },
            {
              name: 'showButtons',
              type: 'boolean',
              default: 'false',
              description: { pt: 'Botões Salvar/Cancelar.', en: 'Save/Cancel buttons.' },
            },
            {
              name: 'saveOnBlur',
              type: 'boolean',
              default: 'true',
              description: { pt: 'Salva ao sair do campo.', en: 'Saves on blur.' },
            },
            {
              name: 'size',
              type: "'sm' | 'md' | 'lg'",
              default: "'md'",
              description: { pt: 'Altura e tamanho do texto.', en: 'Height and text size.' },
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: { pt: 'Impede a edição.', en: 'Prevents editing.' },
            },
            {
              name: 'inputProps',
              type: 'InputHTMLAttributes',
              description: {
                pt: 'Atributos do <input> (type, maxLength…).',
                en: '<input> attributes (type, maxLength…).',
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
                Em leitura, o valor é um <Code>&lt;button&gt;</Code> com nome "Editar
                &lt;rótulo&gt;: &lt;valor&gt;" (o texto visível faz parte do nome). Ao ativar, o
                campo recebe foco com o texto selecionado; ao salvar com Enter ou cancelar com
                Escape, o foco volta ao botão. Durante o salvamento o campo fica{' '}
                <Code>aria-busy</Code> e "Salvando…" é anunciado; erros ficam ligados por{' '}
                <Code>aria-describedby</Code>.
              </>
            }
            en={
              <>
                In read mode, the value is a <Code>&lt;button&gt;</Code> named "Edit &lt;label&gt;:
                &lt;value&gt;" (the visible text is part of the name). On activation the field gets
                focus with its text selected; after saving with Enter or cancelling with Escape,
                focus returns to the button. While saving the field is <Code>aria-busy</Code> and
                "Saving…" is announced; errors are linked via <Code>aria-describedby</Code>.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            {
              keys: ['Enter'],
              description: {
                pt: 'No botão: entra em edição. No campo: salva.',
                en: 'On the button: starts editing. In the field: saves.',
              },
            },
            {
              keys: ['Space'],
              description: {
                pt: 'No botão: entra em edição.',
                en: 'On the button: starts editing.',
              },
            },
            {
              keys: ['Escape'],
              description: {
                pt: 'Cancela, restaura o valor e devolve o foco.',
                en: 'Cancels, restores the value and returns focus.',
              },
            },
            {
              keys: ['Tab'],
              description: {
                pt: 'Sai do campo e salva (ou vai para Salvar/Cancelar com showButtons).',
                en: 'Leaves the field and saves (or moves to Save/Cancel with showButtons).',
              },
            },
          ]}
        />
        <WcagList
          items={[
            {
              criterion: '2.4.3',
              description: {
                pt: 'Foco previsível: entra no campo ao editar e volta ao botão ao concluir.',
                en: 'Predictable focus: moves into the field on edit and back to the button when done.',
              },
            },
            {
              criterion: '2.5.3',
              description: {
                pt: 'O nome acessível contém o texto visível do valor.',
                en: 'The accessible name contains the visible value text.',
              },
            },
            {
              criterion: '3.3.1',
              description: {
                pt: 'Erros de validação e de salvamento descritos em texto.',
                en: 'Validation and save errors described in text.',
              },
            },
            {
              criterion: '4.1.3',
              description: {
                pt: (
                  <>
                    Estado de salvamento anunciado via <Code>role="status"</Code>.
                  </>
                ),
                en: (
                  <>
                    Saving state announced via <Code>role="status"</Code>.
                  </>
                ),
              },
            },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
