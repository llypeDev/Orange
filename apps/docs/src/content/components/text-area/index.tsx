import {
  Bullets,
  Code,
  ComponentPage,
  DefinitionTable,
  Example,
  KeyboardTable,
  PropsTable,
  Section,
  WcagList,
} from '../../../kit'
import { T } from '../../../i18n'
import AutoResize from './examples/AutoResize'
import AutoResizeCode from './examples/AutoResize?raw'
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import States from './examples/States'
import StatesCode from './examples/States?raw'
import WithCount from './examples/WithCount'
import WithCountCode from './examples/WithCount?raw'
import { meta } from './meta'

export default function TextAreaPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use TextArea quando a resposta pode ter mais de uma frase. Para nomes, e-mails e códigos, use TextField.',
              en: 'Use TextArea when the answer may be longer than one sentence. For names, emails and codes, use TextField.',
            },
            {
              pt: (
                <>
                  Ajuste <Code>rows</Code> ao tamanho esperado da resposta: a altura do campo indica quanto escrever.
                </>
              ),
              en: (
                <>
                  Set <Code>rows</Code> to the expected answer length: the field height signals how much to write.
                </>
              ),
            },
            {
              pt: (
                <>
                  Com limite de caracteres, mostre o contador (<Code>showCount</Code>) para que a pessoa não seja surpreendida.
                </>
              ),
              en: (
                <>
                  With a character limit, show the counter (<Code>showCount</Code>) so people are not surprised.
                </>
              ),
            },
            {
              pt: (
                <>
                  <Code>autoResize</Code> funciona bem em chats e respostas; defina <Code>maxRows</Code> para não empurrar o resto da tela.
                </>
              ),
              en: (
                <>
                  <Code>autoResize</Code> works well in chats and replies; set <Code>maxRows</Code> so it does not push the rest of the screen.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example title={{ pt: 'Básico', en: 'Basic' }} code={BasicCode}>
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Contador de caracteres', en: 'Character counter' }}
          description={{
            pt: 'O texto "x de y caracteres" é ligado ao campo e anunciado de forma educada após uma pausa na digitação.',
            en: 'The "x of y characters" text is linked to the field and politely announced after a pause in typing.',
          }}
          code={WithCountCode}
        >
          <WithCount />
        </Example>
        <Example
          title={{ pt: 'Crescimento automático', en: 'Auto-resize' }}
          description={{
            pt: 'Começa com 2 linhas, cresce até 8 e então passa a rolar.',
            en: 'Starts at 2 rows, grows up to 8 and then scrolls.',
          }}
          code={AutoResizeCode}
        >
          <AutoResize />
        </Example>
        <Example title={{ pt: 'Estados', en: 'States' }} code={StatesCode}>
          <States />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'label', type: 'ReactNode', description: { pt: 'Rótulo visível do campo.', en: 'Visible field label.' } },
            { name: 'hideLabel', type: 'boolean', default: 'false', description: { pt: 'Oculta o rótulo visualmente.', en: 'Visually hides the label.' } },
            { name: 'description', type: 'ReactNode', description: { pt: 'Texto de ajuda.', en: 'Help text.' } },
            { name: 'error', type: 'ReactNode', description: { pt: 'Mensagem de erro; marca o campo como inválido.', en: 'Error message; marks the field as invalid.' } },
            { name: 'invalid', type: 'boolean', default: 'false', description: { pt: 'Estado inválido sem mensagem.', en: 'Invalid state without a message.' } },
            { name: 'required / optional', type: 'boolean', default: 'false', description: { pt: 'Indicação de obrigatório (*) ou "(opcional)".', en: 'Required (*) or "(optional)" indicator.' } },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: { pt: 'Tamanho do texto e do espaçamento interno.', en: 'Text size and inner spacing.' } },
            { name: 'rows', type: 'number', default: '3', description: { pt: <>Linhas visíveis (altura mínima com <Code>autoResize</Code>).</>, en: <>Visible rows (minimum height with <Code>autoResize</Code>).</> } },
            { name: 'autoResize', type: 'boolean', default: 'false', description: { pt: 'Cresce com o conteúdo e desliga o redimensionamento manual.', en: 'Grows with content and disables manual resizing.' } },
            { name: 'maxRows', type: 'number', description: { pt: <>Limite de crescimento do <Code>autoResize</Code>.</>, en: <>Growth limit for <Code>autoResize</Code>.</> } },
            { name: 'maxLength', type: 'number', description: { pt: 'Limite de caracteres (nativo).', en: 'Character limit (native).' } },
            { name: 'showCount', type: 'boolean', default: 'false', description: { pt: <>Mostra o contador. Requer <Code>maxLength</Code>.</>, en: <>Shows the counter. Requires <Code>maxLength</Code>.</> } },
            { name: 'value / defaultValue', type: 'string', description: { pt: 'Valor controlado / inicial.', en: 'Controlled / initial value.' } },
            { name: 'onChange', type: '(event: ChangeEvent) => void', description: { pt: 'Evento nativo de alteração.', en: 'Native change event.' } },
            { name: 'onValueChange', type: '(value: string) => void', description: { pt: 'Atalho que recebe o texto atual.', en: 'Shortcut that receives the current text.' } },
            { name: '...rest', type: 'TextareaHTMLAttributes', description: { pt: <>Atributos nativos e <Code>ref</Code> vão para o <Code>&lt;textarea&gt;</Code>; <Code>className</Code> e <Code>style</Code>, para o contêiner.</>, en: <>Native attributes and <Code>ref</Code> go to the <Code>&lt;textarea&gt;</Code>; <Code>className</Code> and <Code>style</Code> go to the wrapper.</> } },
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
            { term: { pt: 'Contador', en: 'Counter' }, description: { pt: 'A cor muda suavemente perto do limite (250ms); ao atingir o limite, um toque de escala com --or-ease-bounce.', en: 'Color changes smoothly near the limit (250ms); on reaching the limit, a single scale bump with --or-ease-bounce.' } },
            { term: { pt: 'Crescimento automático', en: 'Auto-resize' }, description: { pt: 'A altura acompanha o texto sem animação, para não atrasar a digitação.', en: 'Height follows the text without animation, so typing never lags.' } },
            { term: { pt: 'Erro surge', en: 'Error appears' }, description: { pt: 'A mensagem entra com fade e desliza 4px (250ms, --or-ease-out); o controle treme uma vez (or-shake, 400ms) só na passagem de válido para inválido.', en: 'The message fades in and slides 4px (250ms, --or-ease-out); the control shakes once (or-shake, 400ms) only when going from valid to invalid.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={<>Um <Code>&lt;textarea&gt;</Code> nativo com <Code>&lt;label&gt;</Code>, descrição, contador e erro em <Code>aria-describedby</Code>. O crescimento automático não muda o foco nem a posição do cursor.</>}
            en={<>A native <Code>&lt;textarea&gt;</Code> with <Code>&lt;label&gt;</Code>, and description, counter and error in <Code>aria-describedby</Code>. Auto-resize never moves focus or the caret.</>}
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Move o foco para o campo (Tab não insere tabulação).', en: 'Moves focus to the field (Tab does not insert a tab character).' } },
            { keys: ['Enter'], description: { pt: 'Insere uma nova linha.', en: 'Inserts a new line.' } },
            { keys: ['Shift', 'Tab'], description: { pt: 'Move o foco para o elemento anterior.', en: 'Moves focus to the previous element.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Rótulo, descrição e erro associados programaticamente.', en: 'Label, description and error programmatically associated.' } },
            { criterion: '1.4.10', description: { pt: 'O texto quebra linha; não há rolagem horizontal.', en: 'Text wraps; no horizontal scrolling.' } },
            { criterion: '2.4.7', description: { pt: 'Foco visível com borda laranja.', en: 'Visible focus with an orange border.' } },
            { criterion: '3.3.1', description: { pt: 'Erros descritos em texto e com aria-invalid.', en: 'Errors described in text and with aria-invalid.' } },
            { criterion: '4.1.3', description: { pt: 'Contador como mensagem de status (aria-live="polite").', en: 'Counter as a status message (aria-live="polite").' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
