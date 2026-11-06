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
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import Preview from './examples/Preview'
import PreviewCode from './examples/Preview?raw'
import States from './examples/States'
import StatesCode from './examples/States?raw'
import Swatches from './examples/Swatches'
import SwatchesCode from './examples/Swatches?raw'
import { meta } from './meta'

export default function ColorFieldPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: (
                <>
                  Dê nomes às cores da paleta (
                  <Code>{"{ value: '#f58549', label: 'Laranja' }"}</Code>): leitores de tela
                  anunciam o nome, não o código.
                </>
              ),
              en: (
                <>
                  Name the palette colors (<Code>{"{ value: '#f58549', label: 'Orange' }"}</Code>):
                  screen readers announce the name, not the code.
                </>
              ),
            },
            {
              pt: 'Ofereça uma paleta quando a marca tem cores definidas; deixe o hexadecimal para quem precisa de precisão.',
              en: 'Offer a palette when the brand has defined colors; leave the hex field for those who need precision.',
            },
            {
              pt: 'Mostre o resultado ao lado (prévia do botão, do e-mail) e valide o contraste quando a cor for usada em texto.',
              en: 'Show the result alongside (button or email preview) and validate contrast when the color is used for text.',
            },
            {
              pt: (
                <>
                  O campo aceita <Code>#rgb</Code>, <Code>rrggbb</Code> e maiúsculas; o valor
                  emitido é sempre <Code>#rrggbb</Code> em minúsculas.
                </>
              ),
              en: (
                <>
                  The field accepts <Code>#rgb</Code>, <Code>rrggbb</Code> and uppercase; the
                  emitted value is always lowercase <Code>#rrggbb</Code>.
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
            pt: 'A amostra quadrada abre o seletor nativo; o campo de texto aceita o código hexadecimal.',
            en: 'The square swatch opens the native picker; the text field accepts the hex code.',
          }}
          code={BasicCode}
        >
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Com paleta', en: 'With palette' }}
          description={{
            pt: 'As cores sugeridas formam um radiogroup: setas mudam a seleção.',
            en: 'Suggested colors form a radiogroup: arrow keys change the selection.',
          }}
          code={SwatchesCode}
        >
          <Swatches />
        </Example>
        <Example
          title={{ pt: 'Com prévia (controlado)', en: 'With preview (controlled)' }}
          code={PreviewCode}
        >
          <Preview />
        </Example>
        <Example
          title={{ pt: 'Estados', en: 'States' }}
          description={{
            pt: 'Sem cor (amostra riscada), com erro e desabilitado. Saia do campo com um código inválido para ver a validação interna.',
            en: 'No color (struck-through swatch), with error and disabled. Leave the field with an invalid code to see built-in validation.',
          }}
          code={StatesCode}
        >
          <States />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Trocar a cor', en: 'Changing the color' },
              description: {
                pt: 'A amostra principal faz crossfade entre as cores (camada sobre o seletor nativo) · medium (250ms), ease-out.',
                en: 'The main swatch crossfades between colors (a layer over the native picker) · medium (250ms), ease-out.',
              },
            },
            {
              term: { pt: 'Hover e foco na paleta', en: 'Palette hover and focus' },
              description: {
                pt: 'A amostra sobe 4px com sombra deslocada na própria cor · medium, ease-out.',
                en: 'The swatch lifts 4px with an offset shadow in its own color · medium, ease-out.',
              },
            },
            {
              term: { pt: 'Pressionar', en: 'Pressing' },
              description: {
                pt: 'Amostras afundam 1px (translateY(1px) scale(0.985)) · press (90ms).',
                en: 'Swatches sink 1px (translateY(1px) scale(0.985)) · press (90ms).',
              },
            },
            {
              term: { pt: 'Escolher na paleta', en: 'Choosing from the palette' },
              description: {
                pt: 'A amostra faz pop (0,85 → 1) e o check entra em escala · medium, ease-bounce.',
                en: 'The swatch pops (0.85 → 1) and the check scales in · medium, ease-bounce.',
              },
            },
            {
              term: { pt: 'Movimento reduzido', en: 'Reduced motion' },
              description: {
                pt: 'Os tokens de duração e distância viram 0: tudo muda na hora e as saídas não esperam animação.',
                en: 'Duration and distance tokens become 0: everything changes instantly and exits do not wait for animation.',
              },
            },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            {
              name: 'label',
              type: 'ReactNode',
              description: { pt: 'Rótulo visível.', en: 'Visible label.' },
            },
            {
              name: 'value',
              type: 'string',
              description: {
                pt: "Cor #rrggbb (controlado). '' = sem cor.",
                en: "#rrggbb color (controlled). '' = no color.",
              },
            },
            {
              name: 'defaultValue',
              type: 'string',
              default: "''",
              description: {
                pt: 'Cor inicial (não controlado).',
                en: 'Initial color (uncontrolled).',
              },
            },
            {
              name: 'onChange',
              type: '(value: string) => void',
              description: {
                pt: 'Cor normalizada sempre que válida.',
                en: 'Normalized color whenever valid.',
              },
            },
            {
              name: 'swatches',
              type: '(string | { value: string; label?: string })[]',
              description: { pt: 'Paleta sugerida.', en: 'Suggested palette.' },
            },
            {
              name: 'description',
              type: 'ReactNode',
              description: { pt: 'Texto de ajuda.', en: 'Help text.' },
            },
            {
              name: 'error',
              type: 'ReactNode',
              description: {
                pt: 'Erro; substitui a validação de formato.',
                en: 'Error; overrides format validation.',
              },
            },
            {
              name: 'invalid',
              type: 'boolean',
              default: 'false',
              description: {
                pt: 'Estado inválido sem mensagem (erro mostrado em outro lugar).',
                en: 'Invalid state without a message (error shown elsewhere).',
              },
            },
            {
              name: 'required / optional / disabled / readOnly',
              type: 'boolean',
              default: 'false',
              description: { pt: 'Estados do campo.', en: 'Field states.' },
            },
            {
              name: 'size',
              type: "'sm' | 'md' | 'lg'",
              default: "'md'",
              description: { pt: 'Altura do campo.', en: 'Field height.' },
            },
            {
              name: '...rest',
              type: 'InputHTMLAttributes',
              description: {
                pt: 'Atributos do campo de texto.',
                en: 'Attributes of the text input.',
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
                O campo hexadecimal é o controle principal, ligado ao rótulo, à descrição e ao erro.
                O <Code>&lt;input type="color"&gt;</Code> recebe o nome "rótulo + Seletor de cor". A
                paleta é um <Code>role="radiogroup"</Code> com um único ponto de tabulação; cada cor
                é um botão <Code>role="radio"</Code> com <Code>aria-checked</Code> e o nome da cor.
              </>
            }
            en={
              <>
                The hex field is the main control, linked to the label, description and error. The{' '}
                <Code>&lt;input type="color"&gt;</Code> is named "label + Color picker". The palette
                is a <Code>role="radiogroup"</Code> with a single tab stop; each color is a{' '}
                <Code>role="radio"</Code> button with <Code>aria-checked</Code> and the color name.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            {
              keys: ['Tab'],
              description: {
                pt: 'Seletor de cor → campo hexadecimal → paleta.',
                en: 'Color picker → hex field → palette.',
              },
            },
            {
              keys: ['Enter'],
              description: {
                pt: 'No seletor: abre o seletor de cor do sistema.',
                en: 'On the picker: opens the system color picker.',
              },
            },
            {
              keys: ['←', '→'],
              description: {
                pt: 'Na paleta: cor anterior / próxima (seleciona).',
                en: 'In the palette: previous / next color (selects).',
              },
            },
            {
              keys: ['↑', '↓'],
              description: {
                pt: 'Na paleta: mesmo que ← / →.',
                en: 'In the palette: same as ← / →.',
              },
            },
            {
              keys: ['Home', 'End'],
              description: {
                pt: 'Na paleta: primeira / última cor.',
                en: 'In the palette: first / last color.',
              },
            },
            {
              keys: ['Space'],
              description: {
                pt: 'Na paleta: seleciona a cor focada.',
                en: 'In the palette: selects the focused color.',
              },
            },
          ]}
        />
        <WcagList
          items={[
            {
              criterion: '1.4.1',
              description: {
                pt: 'Cores da paleta têm nome em texto, não só a amostra visual.',
                en: 'Palette colors have a text name, not just the visual swatch.',
              },
            },
            {
              criterion: '1.4.11',
              description: {
                pt: 'Amostras com borda de 1px e seleção indicada por contorno e ícone.',
                en: 'Swatches with a 1px border; selection shown by outline and icon.',
              },
            },
            {
              criterion: '3.3.1',
              description: {
                pt: 'Código inválido gera mensagem de erro com o formato esperado.',
                en: 'Invalid code produces an error message with the expected format.',
              },
            },
            {
              criterion: '4.1.2',
              description: {
                pt: (
                  <>
                    Estado das cores exposto com <Code>aria-checked</Code>.
                  </>
                ),
                en: (
                  <>
                    Color state exposed with <Code>aria-checked</Code>.
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
