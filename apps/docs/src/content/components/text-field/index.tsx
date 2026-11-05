import {
  Bullets,
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
import { TextField } from '@orangesys/ui'
import Adornments from './examples/Adornments'
import AdornmentsCode from './examples/Adornments?raw'
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import CharacterCount from './examples/CharacterCount'
import CharacterCountCode from './examples/CharacterCount?raw'
import Sizes from './examples/Sizes'
import SizesCode from './examples/Sizes?raw'
import Validation from './examples/Validation'
import ValidationCode from './examples/Validation?raw'
import { meta } from './meta'

export default function TextFieldPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Todo campo tem um rótulo visível e curto. O placeholder é só um exemplo de formato — ele some ao digitar e tem pouco contraste.',
              en: 'Every field has a short, visible label. The placeholder is only a format hint — it disappears while typing and has low contrast.',
            },
            {
              pt: (
                <>
                  Use o <Code>type</Code> certo (<Code>email</Code>, <Code>tel</Code>, <Code>url</Code>) e{' '}
                  <Code>autoComplete</Code>: o teclado do celular e o preenchimento automático ajudam a pessoa.
                </>
              ),
              en: (
                <>
                  Use the right <Code>type</Code> (<Code>email</Code>, <Code>tel</Code>, <Code>url</Code>) and{' '}
                  <Code>autoComplete</Code>: mobile keyboards and autofill help people.
                </>
              ),
            },
            {
              pt: 'A largura do campo sugere o tamanho da resposta: CEP e número curtos, nome e endereço largos.',
              en: 'Field width hints at the expected answer length: short for ZIP code and number, wide for name and address.',
            },
            {
              pt: 'Mensagens de erro dizem como corrigir ("Informe um e-mail no formato nome@empresa.com"), não apenas que algo deu errado.',
              en: 'Error messages say how to fix the problem ("Enter an email like name@company.com"), not just that something is wrong.',
            },
          ]}
        />
        <DoDont
          doExample={<TextField label="CEP" placeholder="00000-000" style={{ maxWidth: 200 }} />}
          dontExample={<TextField label="CEP" hideLabel placeholder="Digite seu CEP" style={{ maxWidth: 200 }} />}
          doItems={[{ pt: 'Rótulo visível e placeholder apenas como exemplo de formato.', en: 'Visible label and placeholder only as a format example.' }]}
          dontItems={[{ pt: 'Usar o placeholder no lugar do rótulo.', en: 'Using the placeholder instead of a label.' }]}
        />
      </Section>

      <Section title={{ pt: 'Anatomia', en: 'Anatomy' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Rótulo', en: 'Label' }, description: { pt: 'Obrigatório. Em Space Grotesk; * para obrigatório ou "(opcional)".', en: 'Required. Set in Space Grotesk; * for required or "(optional)".' } },
            { term: { pt: 'Descrição', en: 'Description' }, description: { pt: 'Ajuda curta sobre o formato ou o uso do dado.', en: 'Short help about format or how the data is used.' } },
            { term: { pt: 'Moldura', en: 'Frame' }, description: { pt: 'Borda de 1px, cantos retos; fica laranja no foco e vermelha no erro.', en: '1px border, square corners; turns orange on focus and red on error.' } },
            { term: { pt: 'Ícones e prefixo/sufixo', en: 'Icons and prefix/suffix' }, description: { pt: 'Ícones decorativos e textos fixos como "https://" ou "kg".', en: 'Decorative icons and fixed text such as "https://" or "kg".' } },
            { term: { pt: 'Contador', en: 'Counter' }, description: { pt: '"x de y caracteres" quando há limite; muda de cor perto do limite.', en: '"x of y characters" when there is a limit; changes color near the limit.' } },
            { term: { pt: 'Erro', en: 'Error' }, description: { pt: 'Mensagem com ícone abaixo do campo, ligada por aria-describedby.', en: 'Message with icon below the field, linked via aria-describedby.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example title={{ pt: 'Básico', en: 'Basic' }} code={BasicCode}>
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Tamanhos', en: 'Sizes' }}
          description={{ pt: 'sm (32px), md (40px, padrão) e lg (48px) — as mesmas alturas dos botões.', en: 'sm (32px), md (40px, default) and lg (48px) — the same heights as buttons.' }}
          code={SizesCode}
        >
          <Sizes />
        </Example>
        <Example
          title={{ pt: 'Ícones, prefixo e sufixo', en: 'Icons, prefix and suffix' }}
          description={{
            pt: 'Clicar em qualquer parte da moldura foca o campo. Prefixo e sufixo de texto também são lidos por leitores de tela.',
            en: 'Clicking anywhere in the frame focuses the input. Text prefix and suffix are also read by screen readers.',
          }}
          code={AdornmentsCode}
        >
          <Adornments />
        </Example>
        <Example
          title={{ pt: 'Contador de caracteres', en: 'Character counter' }}
          description={{
            pt: (
              <>
                Com <Code>maxLength</Code> e <Code>showCount</Code>. O contador é anunciado só quando a pessoa pausa a digitação.
              </>
            ),
            en: (
              <>
                With <Code>maxLength</Code> and <Code>showCount</Code>. The counter is announced only when the person pauses typing.
              </>
            ),
          }}
          code={CharacterCountCode}
        >
          <CharacterCount />
        </Example>
        <Example
          title={{ pt: 'Validação e estados', en: 'Validation and states' }}
          description={{
            pt: 'Campo controlado validado ao sair, somente leitura e desabilitado.',
            en: 'Controlled field validated on blur, read-only and disabled.',
          }}
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
            { name: 'description', type: 'ReactNode', description: { pt: 'Texto de ajuda ligado por aria-describedby.', en: 'Help text linked via aria-describedby.' } },
            { name: 'error', type: 'ReactNode', description: { pt: 'Mensagem de erro; marca o campo como inválido.', en: 'Error message; marks the field as invalid.' } },
            { name: 'invalid', type: 'boolean', default: 'false', description: { pt: 'Estado inválido sem mensagem (erro mostrado em outro lugar).', en: 'Invalid state without a message (error shown elsewhere).' } },
            { name: 'required', type: 'boolean', default: 'false', description: { pt: 'Obrigatório: * no rótulo e required no input.', en: 'Required: * on the label and required on the input.' } },
            { name: 'optional', type: 'boolean', default: 'false', description: { pt: 'Mostra "(opcional)" no rótulo.', en: 'Shows "(optional)" on the label.' } },
            { name: 'labelAside', type: 'ReactNode', description: { pt: 'Conteúdo à direita do rótulo (link, dica).', en: 'Content to the right of the label (link, hint).' } },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: { pt: 'Altura do controle.', en: 'Control height.' } },
            { name: 'type', type: "'text' | 'email' | 'url' | 'tel' | 'search'", default: "'text'", description: { pt: 'Tipo do input. Para senha e número use PasswordField e NumberField.', en: 'Input type. Use PasswordField and NumberField for passwords and numbers.' } },
            { name: 'startIcon / endIcon', type: 'ReactNode', description: { pt: 'Ícones decorativos no início/fim.', en: 'Decorative icons at the start/end.' } },
            { name: 'prefix / suffix', type: 'ReactNode', description: { pt: 'Texto fixo antes/depois do valor.', en: 'Fixed text before/after the value.' } },
            { name: 'maxLength', type: 'number', description: { pt: 'Limite de caracteres (nativo).', en: 'Character limit (native).' } },
            { name: 'showCount', type: 'boolean', default: 'false', description: { pt: <>Mostra o contador. Requer <Code>maxLength</Code>.</>, en: <>Shows the counter. Requires <Code>maxLength</Code>.</> } },
            { name: 'value / defaultValue', type: 'string', description: { pt: 'Valor controlado / inicial.', en: 'Controlled / initial value.' } },
            { name: 'onChange', type: '(event: ChangeEvent) => void', description: { pt: 'Evento nativo de alteração.', en: 'Native change event.' } },
            { name: 'onValueChange', type: '(value: string) => void', description: { pt: 'Atalho que recebe o texto atual.', en: 'Shortcut that receives the current text.' } },
            { name: '...rest', type: 'InputHTMLAttributes', description: { pt: <>Atributos nativos e <Code>ref</Code> vão para o <Code>&lt;input&gt;</Code>; <Code>className</Code> e <Code>style</Code>, para o contêiner.</>, en: <>Native attributes and <Code>ref</Code> go to the <Code>&lt;input&gt;</Code>; <Code>className</Code> and <Code>style</Code> go to the wrapper.</> } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <p>
          <T
            pt={<>Interações rápidas e geométricas, só com tokens de duração e curva. Com <Code>prefers-reduced-motion</Code>, as durações vão a zero e os estados mudam na hora — o movimento nunca é a única pista de estado.</>}
            en={<>Fast, geometric interactions using only duration and easing tokens. With <Code>prefers-reduced-motion</Code>, durations drop to zero and states change instantly — motion is never the only cue.</>}
          />
        </p>
        <DefinitionTable
          rows={[
            { term: { pt: 'Hover e foco', en: 'Hover and focus' }, description: { pt: 'Borda e anel de foco mudam de cor juntos — 160ms (--or-duration-fast), --or-ease-out.', en: 'Border and focus ring change color together — 160ms (--or-duration-fast), --or-ease-out.' } },
            { term: { pt: 'Ícones e prefixo', en: 'Icons and prefix' }, description: { pt: 'Ícones e textos fixos acompanham o foco com transição de cor (160ms).', en: 'Icons and fixed text follow focus with a color transition (160ms).' } },
            { term: { pt: 'Contador', en: 'Counter' }, description: { pt: 'A cor muda suavemente perto do limite (250ms); ao atingir o limite, um toque de escala com --or-ease-bounce.', en: 'Color changes smoothly near the limit (250ms); on reaching the limit, a single scale bump with --or-ease-bounce.' } },
            { term: { pt: 'Erro surge', en: 'Error appears' }, description: { pt: 'A mensagem entra com fade e desliza 4px (250ms, --or-ease-out); o controle treme uma vez (or-shake, 400ms) só na passagem de válido para inválido.', en: 'The message fades in and slides 4px (250ms, --or-ease-out); the control shakes once (or-shake, 400ms) only when going from valid to invalid.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={<>Um <Code>&lt;input&gt;</Code> nativo ligado ao <Code>&lt;label&gt;</Code> por <Code>for</Code>. Descrição, prefixo/sufixo, contador e erro entram em <Code>aria-describedby</Code>; o erro também aplica <Code>aria-invalid</Code>. O contador usa uma região <Code>aria-live="polite"</Code> separada, atualizada só após uma pausa na digitação.</>}
            en={<>A native <Code>&lt;input&gt;</Code> linked to its <Code>&lt;label&gt;</Code> via <Code>for</Code>. Description, prefix/suffix, counter and error go into <Code>aria-describedby</Code>; the error also sets <Code>aria-invalid</Code>. The counter uses a separate <Code>aria-live="polite"</Code> region, updated only after a pause in typing.</>}
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Move o foco para o campo.', en: 'Moves focus to the field.' } },
            { keys: ['Shift', 'Tab'], description: { pt: 'Move o foco para o elemento anterior.', en: 'Moves focus to the previous element.' } },
            { keys: ['Esc'], description: { pt: <>Em <Code>type="search"</Code>, limpa o texto (nativo).</>, en: <>With <Code>type="search"</Code>, clears the text (native).</> } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Rótulo, descrição e erro associados programaticamente.', en: 'Label, description and error programmatically associated.' } },
            { criterion: '1.3.5', description: { pt: <>Suporte a <Code>autoComplete</Code> para identificar o propósito do campo.</>, en: <><Code>autoComplete</Code> support to identify input purpose.</> } },
            { criterion: '2.4.7', description: { pt: 'Foco visível: moldura laranja com 2px.', en: 'Visible focus: 2px orange frame.' } },
            { criterion: '3.3.1', description: { pt: 'Erros identificados em texto, com ícone e aria-invalid.', en: 'Errors identified in text, with an icon and aria-invalid.' } },
            { criterion: '3.3.2', description: { pt: 'Rótulo sempre presente; obrigatoriedade indicada.', en: 'Label always present; required state indicated.' } },
            { criterion: '4.1.3', description: { pt: 'Contador anunciado como mensagem de status, sem roubar o foco.', en: 'Counter announced as a status message, without moving focus.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
