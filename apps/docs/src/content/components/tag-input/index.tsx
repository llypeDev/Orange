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
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import Emails from './examples/Emails'
import EmailsCode from './examples/Emails?raw'
import MaxTags from './examples/MaxTags'
import MaxTagsCode from './examples/MaxTags?raw'
import States from './examples/States'
import StatesCode from './examples/States?raw'
import { meta } from './meta'

export default function TagInputPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: (
                <>
                  Use para valores livres que o usuário digita (palavras-chave, e-mails, códigos).
                  Para escolher de uma lista fechada, use <strong>MultiSelect</strong>.
                </>
              ),
              en: (
                <>
                  Use it for free values the user types (keywords, e-mails, codes). To choose from a
                  closed list, use <strong>MultiSelect</strong>.
                </>
              ),
            },
            {
              pt: 'Diga na descrição como adicionar ("Pressione Enter ou vírgula") — o gesto não é óbvio para todos.',
              en: 'Say in the description how to add items ("Press Enter or comma") — the gesture is not obvious to everyone.',
            },
            {
              pt: (
                <>
                  Valide cada tag com <Code>validate</Code> e devolva uma mensagem específica. O
                  texto recusado fica no campo para correção.
                </>
              ),
              en: (
                <>
                  Validate each tag with <Code>validate</Code> and return a specific message.
                  Rejected text stays in the field for fixing.
                </>
              ),
            },
            {
              pt: (
                <>
                  Em listas coladas (e-mails de uma planilha), inclua espaço e Tab em{' '}
                  <Code>separators</Code> e ative <Code>addOnBlur</Code> para não perder o último
                  item.
                </>
              ),
              en: (
                <>
                  For pasted lists (e-mails from a spreadsheet), add space and Tab to{' '}
                  <Code>separators</Code> and enable <Code>addOnBlur</Code> so the last item is not
                  lost.
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
            pt: 'Enter ou vírgula criam a tag; Backspace com o campo vazio remove a última. Duplicadas são recusadas.',
            en: 'Enter or comma creates a tag; Backspace in the empty field removes the last one. Duplicates are rejected.',
          }}
          code={BasicCode}
        >
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Convite por e-mail', en: 'E-mail invitations' }}
          description={{
            pt: 'Validação por tag, colagem de várias de uma vez e Tab/espaço como separadores. Tente colar “ana@empresa.com, bruno, carla@empresa.com”.',
            en: 'Per-tag validation, pasting several at once and Tab/space as separators. Try pasting “ana@empresa.com, bruno, carla@empresa.com”.',
          }}
          code={EmailsCode}
        >
          <Emails />
        </Example>
        <Example title={{ pt: 'Limite de tags', en: 'Tag limit' }} code={MaxTagsCode}>
          <MaxTags />
        </Example>
        <Example title={{ pt: 'Tamanhos e estados', en: 'Sizes and states' }} code={StatesCode}>
          <States />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            {
              name: 'value / defaultValue',
              type: 'string[]',
              description: {
                pt: 'Tags (controlado / inicial).',
                en: 'Tags (controlled / initial).',
              },
            },
            {
              name: 'onChange',
              type: '(tags: string[]) => void',
              description: {
                pt: 'Chamado ao adicionar ou remover.',
                en: 'Called when adding or removing.',
              },
            },
            {
              name: 'separators',
              type: "Array<'Enter' | ',' | 'Tab' | ';' | ' '>",
              default: "['Enter', ',']",
              description: { pt: 'Teclas que criam a tag.', en: 'Keys that create a tag.' },
            },
            {
              name: 'maxTags',
              type: 'number',
              description: {
                pt: 'Limite de tags; mostra o contador.',
                en: 'Tag limit; shows a counter.',
              },
            },
            {
              name: 'validate',
              type: '(tag: string, tags: string[]) => string | boolean | null | undefined',
              description: {
                pt: 'Retorne uma mensagem para recusar a tag.',
                en: 'Return a message to reject the tag.',
              },
            },
            {
              name: 'allowDuplicates',
              type: 'boolean',
              default: 'false',
              description: {
                pt: 'Permite repetidas (comparação sem caixa).',
                en: 'Allows duplicates (case-insensitive comparison).',
              },
            },
            {
              name: 'addOnBlur',
              type: 'boolean',
              default: 'false',
              description: {
                pt: 'Adiciona o texto pendente ao sair do campo.',
                en: 'Adds the pending text on blur.',
              },
            },
            {
              name: 'label / hideLabel / description / error',
              type: 'ReactNode / boolean',
              description: {
                pt: 'Estrutura de campo; error externo tem precedência sobre o interno.',
                en: 'Field structure; external error takes precedence over internal ones.',
              },
            },
            {
              name: 'size',
              type: "'sm' | 'md' | 'lg'",
              default: "'md'",
              description: { pt: 'Altura mínima do controle.', en: 'Minimum control height.' },
            },
            {
              name: 'name',
              type: 'string',
              description: {
                pt: 'Envia um input oculto por tag.',
                en: 'Submits one hidden input per tag.',
              },
            },
            {
              name: 'required / disabled / invalid',
              type: 'boolean',
              description: { pt: 'Estados do campo.', en: 'Field states.' },
            },
            {
              name: '...rest',
              type: 'InputHTMLAttributes',
              description: {
                pt: 'Atributos do input de texto (a ref aponta para ele).',
                en: 'Text input attributes (the ref points to it).',
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
                As tags ficam em uma lista (<Code>role="list"</Code>) antes do campo, cada uma com
                um botão "Remover …" com nome acessível. Inclusões, remoções e erros de validação
                são anunciados em uma região <Code>role="status"</Code>; o erro também é ligado ao
                campo por <Code>aria-describedby</Code> e marca <Code>aria-invalid</Code>. Ao
                remover uma tag, o foco vai para a próxima ou volta ao campo.
              </>
            }
            en={
              <>
                Tags live in a list (<Code>role="list"</Code>) before the field, each with an
                accessible "Remove …" button. Additions, removals and validation errors are
                announced in a <Code>role="status"</Code> region; the error is also linked to the
                field via <Code>aria-describedby</Code> and sets <Code>aria-invalid</Code>. When a
                tag is removed, focus moves to the next one or back to the field.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            {
              keys: ['Enter'],
              description: {
                pt: 'Cria a tag com o texto digitado (com o campo vazio, envia o formulário).',
                en: 'Creates a tag from the typed text (with an empty field, submits the form).',
              },
            },
            {
              keys: [','],
              description: {
                pt: 'Cria a tag (separador padrão).',
                en: 'Creates a tag (default separator).',
              },
            },
            {
              keys: ['Tab'],
              description: {
                pt: 'Com "Tab" em separators e texto no campo, cria a tag; senão, navega.',
                en: 'With "Tab" in separators and text in the field, creates a tag; otherwise navigates.',
              },
            },
            {
              keys: ['Backspace'],
              description: {
                pt: 'Com o campo vazio, remove a última tag.',
                en: 'With an empty field, removes the last tag.',
              },
            },
            {
              keys: ['Shift', 'Tab'],
              description: {
                pt: 'Volta pelos botões de remover.',
                en: 'Moves back through the remove buttons.',
              },
            },
          ]}
        />
        <WcagList
          items={[
            {
              criterion: '1.3.1',
              description: {
                pt: 'Tags expostas como lista com botões nomeados.',
                en: 'Tags exposed as a list with named buttons.',
              },
            },
            {
              criterion: '2.1.1',
              description: {
                pt: 'Adicionar e remover funcionam pelo teclado.',
                en: 'Adding and removing work from the keyboard.',
              },
            },
            {
              criterion: '3.3.1',
              description: {
                pt: 'Erros de validação identificados em texto e ligados ao campo.',
                en: 'Validation errors identified in text and linked to the field.',
              },
            },
            {
              criterion: '3.3.3',
              description: {
                pt: 'Mensagens sugerem a correção (duplicada, limite, formato).',
                en: 'Messages suggest the fix (duplicate, limit, format).',
              },
            },
            {
              criterion: '4.1.3',
              description: {
                pt: 'Mudanças anunciadas sem mover o foco.',
                en: 'Changes announced without moving focus.',
              },
            },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
