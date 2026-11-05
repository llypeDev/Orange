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
import { CopyButton } from '@orangesys/ui'
import Command from './examples/Command'
import CommandCode from './examples/Command?raw'
import OnCopy from './examples/OnCopy'
import OnCopyCode from './examples/OnCopy?raw'
import Variants from './examples/Variants'
import VariantsCode from './examples/Variants?raw'
import WithLabel from './examples/WithLabel'
import WithLabelCode from './examples/WithLabel?raw'
import { meta } from './meta'

export default function CopyButtonPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Coloque o botão junto do valor que ele copia — à direita de um comando, link ou código — e mostre o valor na tela.',
              en: 'Place the button next to the value it copies — to the right of a command, link or code — and show the value on screen.',
            },
            {
              pt: 'Somente ícone funciona em blocos de código e campos compactos. Em fluxos de compartilhamento, use rótulo ("Copiar link").',
              en: 'Icon only works in code blocks and compact fields. In sharing flows, use a label ("Copy link").',
            },
            {
              pt: (
                <>
                  Personalize a confirmação com <Code>copiedLabel</Code> quando houver mais de um botão de copiar na tela ("Link
                  copiado", "Cupom copiado").
                </>
              ),
              en: (
                <>
                  Customize the confirmation with <Code>copiedLabel</Code> when there is more than one copy button on screen
                  ("Link copied", "Coupon copied").
                </>
              ),
            },
            {
              pt: 'Não copie dados sensíveis sem que o usuário veja o que está sendo copiado.',
              en: 'Do not copy sensitive data without letting the user see what is being copied.',
            },
          ]}
        />
        <DoDont
          doExample={
            <CopyButton value="https://app.orange.dev/convite/equipe-produto" copiedLabel="Link copiado">
              Copiar link
            </CopyButton>
          }
          dontExample={<CopyButton value="https://app.orange.dev/convite/equipe-produto">Clique aqui</CopyButton>}
          doItems={[{ pt: 'Rótulo diz o que será copiado.', en: 'The label says what will be copied.' }]}
          dontItems={[{ pt: 'Rótulo genérico que não descreve a ação.', en: 'Generic label that does not describe the action.' }]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Comando de instalação', en: 'Install command' }}
          description={{
            pt: 'Somente ícone, variante ghost por padrão. O ícone vira um check por 2 segundos.',
            en: 'Icon only, ghost variant by default. The icon turns into a check for 2 seconds.',
          }}
          code={CommandCode}
        >
          <Command />
        </Example>
        <Example
          title={{ pt: 'Com rótulo', en: 'With label' }}
          description={{
            pt: 'Com children, o rótulo troca para a confirmação sem mudar a largura do botão.',
            en: 'With children, the label swaps to the confirmation without changing the button width.',
          }}
          code={WithLabelCode}
        >
          <WithLabel />
        </Example>
        <Example
          title={{ pt: 'onCopy e tempo de confirmação', en: 'onCopy and confirmation time' }}
          description={{
            pt: <><Code>onCopy</Code> é chamado depois de copiar com sucesso; <Code>timeout</Code> define quanto tempo o check fica visível.</>,
            en: <><Code>onCopy</Code> is called after a successful copy; <Code>timeout</Code> sets how long the check stays visible.</>,
          }}
          code={OnCopyCode}
        >
          <OnCopy />
        </Example>
        <Example title={{ pt: 'Variantes e tamanhos', en: 'Variants and sizes' }} code={VariantsCode}>
          <Variants />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Pressionar', en: 'Press' }, description: { pt: <>Afunda 1px e reduz para 98,5% em <Code>--or-duration-press</Code> (90ms); volta em <Code>fast</Code> com <Code>--or-ease-out</Code>.</>, en: <>Sinks 1px and shrinks to 98.5% in <Code>--or-duration-press</Code> (90ms); returns in <Code>fast</Code> with <Code>--or-ease-out</Code>.</> } },
            { term: { pt: 'Copiar', en: 'Copy' }, description: { pt: <>O ícone de cópia sai em <Code>fast</Code> (<Code>ease-in-out</Code>) e o check entra girando de -45° e crescendo de 0.6 a 1 com <Code>--or-ease-bounce</Code> em <Code>medium</Code>.</>, en: <>The copy icon leaves in <Code>fast</Code> (<Code>ease-in-out</Code>) and the check enters rotating from -45° and scaling from 0.6 to 1 with <Code>--or-ease-bounce</Code> in <Code>medium</Code>.</> } },
            { term: { pt: 'Rótulo', en: 'Label' }, description: { pt: 'O texto atual sobe 4px e some; a confirmação sobe de baixo. Os dois ocupam o mesmo espaço: a largura não muda.', en: 'The current text moves up 4px and fades; the confirmation rises from below. Both share the same space: the width never changes.' } },
            { term: { pt: 'Voltar', en: 'Return' }, description: { pt: <>Depois do <Code>timeout</Code>, o check sai rápido e o ícone de cópia volta suave (<Code>medium</Code>, <Code>ease-out</Code>); os textos fazem o caminho inverso.</>, en: <>After the <Code>timeout</Code>, the check leaves quickly and the copy icon eases back (<Code>medium</Code>, <Code>ease-out</Code>); the texts reverse their path.</> } },
            { term: { pt: 'Movimento reduzido', en: 'Reduced motion' }, description: { pt: <>Com <Code>prefers-reduced-motion</Code>, os tokens zeram as durações: os estados mudam na hora, sem perder nenhuma pista visual.</>, en: <>With <Code>prefers-reduced-motion</Code>, the tokens zero every duration: states change instantly without losing any visual cue.</> } },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'value', type: 'string', required: true, description: { pt: 'Texto copiado para a área de transferência.', en: 'Text copied to the clipboard.' } },
            { name: 'children', type: 'ReactNode', description: { pt: <>Rótulo visível. Sem ele, o botão é só ícone com o nome <Code>t('copyToClipboard')</Code>.</>, en: <>Visible label. Without it, the button is icon-only named <Code>t('copyToClipboard')</Code>.</> } },
            { name: 'copiedLabel', type: 'string', default: "t('copied')", description: { pt: 'Texto exibido e anunciado após copiar.', en: 'Text shown and announced after copying.' } },
            { name: 'timeout', type: 'number', default: '2000', description: { pt: 'Tempo (ms) do estado "copiado".', en: 'Duration (ms) of the "copied" state.' } },
            { name: 'onCopy', type: '(value: string) => void', description: { pt: 'Chamado após copiar com sucesso.', en: 'Called after a successful copy.' } },
            { name: 'variant', type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'", default: "'ghost' | 'outline'", description: { pt: 'ghost quando só ícone; outline com rótulo.', en: 'ghost when icon only; outline with a label.' } },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: { pt: 'Altura do botão.', en: 'Button height.' } },
            { name: '...rest', type: 'ButtonHTMLAttributes', description: { pt: 'Atributos nativos de <button>.', en: 'Native <button> attributes.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                É um <Code>&lt;button&gt;</Code> nativo. Depois de copiar, a confirmação é anunciada numa região{' '}
                <Code>role="status"</Code> com <Code>aria-live="polite"</Code>, que já existe na página antes do clique — por isso o
                anúncio é confiável em todos os leitores de tela. O foco não sai do botão.
              </>
            }
            en={
              <>
                It is a native <Code>&lt;button&gt;</Code>. After copying, the confirmation is announced in a{' '}
                <Code>role="status"</Code> region with <Code>aria-live="polite"</Code> that is already on the page before the click
                — so the announcement is reliable in every screen reader. Focus stays on the button.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Move o foco para o botão.', en: 'Moves focus to the button.' } },
            { keys: ['Enter'], description: { pt: 'Copia o valor.', en: 'Copies the value.' } },
            { keys: ['Space'], description: { pt: 'Copia o valor.', en: 'Copies the value.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.4.1', description: { pt: 'A confirmação troca o ícone (cópia → check) e o texto, não só a cor.', en: 'The confirmation swaps the icon (copy → check) and the text, not just the color.' } },
            { criterion: '2.4.7', description: { pt: 'Foco visível com contorno laranja de 2px.', en: 'Visible focus with a 2px orange outline.' } },
            { criterion: '4.1.2', description: { pt: <>Somente ícone recebe o nome "Copiar para a área de transferência" via <Code>aria-label</Code>.</>, en: <>Icon only gets the name "Copy to clipboard" via <Code>aria-label</Code>.</> } },
            { criterion: '4.1.3', description: { pt: <>"Copiado!" é anunciado por uma região <Code>aria-live="polite"</Code>, sem mover o foco.</>, en: <>"Copied!" is announced by an <Code>aria-live="polite"</Code> region without moving focus.</> } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
