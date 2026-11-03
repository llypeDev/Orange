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
import Alphanumeric from './examples/Alphanumeric'
import AlphanumericCode from './examples/Alphanumeric?raw'
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import Masked from './examples/Masked'
import MaskedCode from './examples/Masked?raw'
import Validation from './examples/Validation'
import ValidationCode from './examples/Validation?raw'
import { meta } from './meta'

export default function PinInputPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use apenas para códigos curtos e de tamanho fixo (4 a 8 caracteres): verificação por SMS/e-mail, autenticador, PIN.',
              en: 'Use it only for short, fixed-length codes (4 to 8 characters): SMS/e-mail verification, authenticator, PIN.',
            },
            {
              pt: 'Diga na descrição para onde o código foi enviado e quantos caracteres ele tem; ofereça "Reenviar código".',
              en: 'Say in the description where the code was sent and how many characters it has; offer "Resend code".',
            },
            {
              pt: (
                <>
                  Verifique em <Code>onComplete</Code> — não exija um botão "Confirmar" extra — e
                  mostre o erro com <Code>error</Code>.
                </>
              ),
              en: (
                <>
                  Verify in <Code>onComplete</Code> — don't require an extra "Confirm" button — and
                  show errors with <Code>error</Code>.
                </>
              ),
            },
            {
              pt: (
                <>
                  Não bloqueie colar nem o preenchimento automático: o primeiro campo usa{' '}
                  <Code>autocomplete="one-time-code"</Code> para o celular sugerir o código do SMS.
                </>
              ),
              en: (
                <>
                  Don't block paste or autofill: the first field uses{' '}
                  <Code>autocomplete="one-time-code"</Code> so phones can suggest the SMS code.
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
            pt: 'O foco avança sozinho; colar o código inteiro em qualquer campo distribui os dígitos.',
            en: 'Focus advances automatically; pasting the whole code in any field spreads the digits.',
          }}
          code={BasicCode}
        >
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Mascarado e agrupado', en: 'Masked and grouped' }}
          description={{
            pt: (
              <>
                <Code>mask</Code> oculta os caracteres; <Code>groupSize</Code> separa visualmente em
                blocos.
              </>
            ),
            en: (
              <>
                <Code>mask</Code> hides the characters; <Code>groupSize</Code> visually splits them
                into blocks.
              </>
            ),
          }}
          code={MaskedCode}
        >
          <Masked />
        </Example>
        <Example
          title={{ pt: 'Alfanumérico', en: 'Alphanumeric' }}
          description={{
            pt: (
              <>
                Com <Code>type="alphanumeric"</Code>, aceita letras e números e cada campo é
                anunciado como "Caractere N de 8".
              </>
            ),
            en: (
              <>
                With <Code>type="alphanumeric"</Code>, letters and digits are accepted and each
                field is announced as "Character N of 8".
              </>
            ),
          }}
          code={AlphanumericCode}
        >
          <Alphanumeric />
        </Example>
        <Example
          title={{ pt: 'Validação e tentativas', en: 'Validation and attempts' }}
          code={ValidationCode}
        >
          <Validation />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            {
              name: 'length',
              type: 'number',
              default: '6',
              description: { pt: 'Quantidade de caracteres.', en: 'Number of characters.' },
            },
            {
              name: 'type',
              type: "'numeric' | 'alphanumeric'",
              default: "'numeric'",
              description: {
                pt: 'Caracteres aceitos e teclado no celular.',
                en: 'Accepted characters and mobile keyboard.',
              },
            },
            {
              name: 'value / defaultValue',
              type: 'string',
              description: {
                pt: 'Código (controlado / inicial).',
                en: 'Code (controlled / initial).',
              },
            },
            {
              name: 'onChange',
              type: '(value: string) => void',
              description: { pt: 'Chamado a cada alteração.', en: 'Called on every change.' },
            },
            {
              name: 'onComplete',
              type: '(value: string) => void',
              description: {
                pt: 'Chamado quando todos os campos estão preenchidos.',
                en: 'Called when every field is filled.',
              },
            },
            {
              name: 'mask',
              type: 'boolean',
              default: 'false',
              description: { pt: 'Oculta os caracteres.', en: 'Hides the characters.' },
            },
            {
              name: 'groupSize',
              type: 'number',
              description: {
                pt: 'Agrupa visualmente os campos.',
                en: 'Visually groups the fields.',
              },
            },
            {
              name: 'placeholder',
              type: 'string',
              description: { pt: 'Texto em cada campo vazio.', en: 'Text in each empty field.' },
            },
            {
              name: 'label / hideLabel / description / error',
              type: 'ReactNode / boolean',
              description: {
                pt: 'Estrutura de campo; o rótulo nomeia o grupo.',
                en: 'Field structure; the label names the group.',
              },
            },
            {
              name: 'size',
              type: "'sm' | 'md' | 'lg'",
              default: "'md'",
              description: {
                pt: 'Lado de cada campo (32/40/48px).',
                en: 'Side of each field (32/40/48px).',
              },
            },
            {
              name: 'name',
              type: 'string',
              description: {
                pt: 'Envia o código completo em um input oculto.',
                en: 'Submits the full code in a hidden input.',
              },
            },
            {
              name: 'autoFocus',
              type: 'boolean',
              default: 'false',
              description: {
                pt: 'Foca o primeiro campo ao montar.',
                en: 'Focuses the first field on mount.',
              },
            },
            {
              name: 'required / disabled / invalid',
              type: 'boolean',
              description: { pt: 'Estados do campo.', en: 'Field states.' },
            },
            {
              name: '...rest',
              type: 'HTMLAttributes<HTMLDivElement>',
              description: {
                pt: 'Atributos do grupo (a ref aponta para ele).',
                en: 'Group attributes (the ref points to it).',
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
                Os campos ficam em um <Code>role="group"</Code> nomeado pelo rótulo e descrito pela
                ajuda/erro. Cada campo tem um nome próprio — "Dígito 1 de 6" — vindo das mensagens
                do <Code>OrangeProvider</Code>. O primeiro campo usa{' '}
                <Code>autocomplete="one-time-code"</Code> e todos usam o <Code>inputMode</Code>{' '}
                adequado.
              </>
            }
            en={
              <>
                The fields live in a <Code>role="group"</Code> named by the label and described by
                help/error. Each field has its own name — "Digit 1 of 6" — from the{' '}
                <Code>OrangeProvider</Code> messages. The first field uses{' '}
                <Code>autocomplete="one-time-code"</Code> and all use the appropriate{' '}
                <Code>inputMode</Code>.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            {
              keys: ['0–9'],
              description: {
                pt: 'Preenche o campo e avança para o próximo.',
                en: 'Fills the field and moves to the next one.',
              },
            },
            {
              keys: ['Backspace'],
              description: {
                pt: 'Apaga o caractere; em um campo vazio, volta e apaga o anterior.',
                en: 'Deletes the character; in an empty field, moves back and deletes the previous one.',
              },
            },
            {
              keys: ['Delete'],
              description: {
                pt: 'Apaga o caractere sem mover o foco.',
                en: 'Deletes the character without moving focus.',
              },
            },
            {
              keys: ['← / →'],
              description: { pt: 'Move entre os campos.', en: 'Moves between fields.' },
            },
            {
              keys: ['Home / End'],
              description: { pt: 'Primeiro/último campo.', en: 'First/last field.' },
            },
            {
              keys: ['Ctrl', 'V'],
              description: { pt: 'Cola e distribui o código.', en: 'Pastes and spreads the code.' },
            },
          ]}
        />
        <WcagList
          items={[
            {
              criterion: '1.3.1',
              description: {
                pt: 'Grupo nomeado e campos com posição anunciada.',
                en: 'Named group and fields with announced position.',
              },
            },
            {
              criterion: '1.3.5',
              description: {
                pt: (
                  <>
                    Finalidade identificada com <Code>autocomplete="one-time-code"</Code>.
                  </>
                ),
                en: (
                  <>
                    Purpose identified with <Code>autocomplete="one-time-code"</Code>.
                  </>
                ),
              },
            },
            {
              criterion: '2.4.7',
              description: {
                pt: 'Campo em foco com borda e fundo laranja.',
                en: 'Focused field with an orange border and fill.',
              },
            },
            {
              criterion: '3.3.1',
              description: {
                pt: 'Erro em texto, ligado ao grupo e marcado com aria-invalid.',
                en: 'Text error tied to the group and marked with aria-invalid.',
              },
            },
            {
              criterion: '3.3.8',
              description: {
                pt: 'Colar e preenchimento automático permitidos (autenticação acessível).',
                en: 'Paste and autofill allowed (accessible authentication).',
              },
            },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
