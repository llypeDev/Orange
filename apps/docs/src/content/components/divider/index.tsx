import {
  Bullets,
  Code,
  ComponentPage,
  DoDont,
  Example,
  PropsTable,
  Section,
  WcagList,
} from '../../../kit'
import { T } from '../../../i18n'
import { Divider } from '@orangesys/ui'
import Decorative from './examples/Decorative'
import DecorativeCode from './examples/Decorative?raw'
import Sections from './examples/Sections'
import SectionsCode from './examples/Sections?raw'
import Tones from './examples/Tones'
import TonesCode from './examples/Tones?raw'
import Vertical from './examples/Vertical'
import VerticalCode from './examples/Vertical?raw'
import WithLabel from './examples/WithLabel'
import WithLabelCode from './examples/WithLabel?raw'
import { meta } from './meta'

export default function DividerPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use para separar grupos que mudam de assunto — seções de configurações, blocos de um menu, ações de naturezas diferentes.',
              en: 'Use it to separate groups that change subject — settings sections, menu blocks, actions of different kinds.',
            },
            {
              pt: 'Prefira espaço em branco antes de recorrer a linhas. Divisores demais fragmentam a leitura.',
              en: 'Prefer white space before reaching for lines. Too many dividers fragment reading.',
            },
            {
              pt: (
                <>
                  Marque como <strong>decorative</strong> quando a linha for só estética (ex.: um traço sob um título). Assim
                  leitores de tela não anunciam um separador sem significado.
                </>
              ),
              en: (
                <>
                  Mark it as <strong>decorative</strong> when the line is purely aesthetic (e.g. a stroke under a heading), so
                  screen readers don't announce a meaningless separator.
                </>
              ),
            },
            {
              pt: 'Use o tom accent com moderação: o laranja é acento, não estrutura.',
              en: 'Use the accent tone sparingly: orange is an accent, not structure.',
            },
          ]}
        />
        <DoDont
          doExample={
            <div style={{ width: '100%' }}>
              <span>Perfil</span>
              <Divider spacing={3} />
              <span>Segurança</span>
            </div>
          }
          dontExample={
            <div style={{ width: '100%' }}>
              <span>Nome</span>
              <Divider spacing={1} tone="accent" />
              <span>E-mail</span>
              <Divider spacing={1} tone="accent" />
              <span>Cargo</span>
            </div>
          }
          doItems={[{ pt: 'Um divisor neutro entre seções distintas.', en: 'One neutral divider between distinct sections.' }]}
          dontItems={[{ pt: 'Divisores laranja entre cada campo de um mesmo grupo.', en: 'Orange dividers between every field of the same group.' }]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example title={{ pt: 'Separando seções', en: 'Separating sections' }} code={SectionsCode}>
          <Sections />
        </Example>
        <Example
          title={{ pt: 'Com rótulo', en: 'With label' }}
          description={{
            pt: 'O rótulo vira o nome acessível do separador. Use textos curtos, como "ou" ou "Hoje".',
            en: 'The label becomes the accessible name of the separator. Keep it short, like "or" or "Today".',
          }}
          code={WithLabelCode}
        >
          <WithLabel />
        </Example>
        <Example
          title={{ pt: 'Vertical', en: 'Vertical' }}
          description={{
            pt: 'Em contêineres flex, o divisor vertical ocupa toda a altura disponível.',
            en: 'Inside flex containers, the vertical divider stretches to the available height.',
          }}
          code={VerticalCode}
        >
          <Vertical />
        </Example>
        <Example
          title={{ pt: 'Tons e espessura', en: 'Tones and thickness' }}
          description={{
            pt: 'subtle, default, strong e accent; thickness="thick" dobra a espessura para 2px.',
            en: 'subtle, default, strong and accent; thickness="thick" doubles it to 2px.',
          }}
          code={TonesCode}
        >
          <Tones />
        </Example>
        <Example
          title={{ pt: 'Decorativo', en: 'Decorative' }}
          description={{
            pt: 'Um traço curto em laranja sob o título — oculto de leitores de tela.',
            en: 'A short orange stroke under the heading — hidden from screen readers.',
          }}
          code={DecorativeCode}
        >
          <Decorative />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: { pt: 'Direção da linha.', en: 'Line direction.' } },
            { name: 'tone', type: "'subtle' | 'default' | 'strong' | 'accent'", default: "'default'", description: { pt: 'Intensidade/cor da linha.', en: 'Line intensity/color.' } },
            { name: 'thickness', type: "'thin' | 'thick'", default: "'thin'", description: { pt: '1px ou 2px.', en: '1px or 2px.' } },
            { name: 'spacing', type: '0 | 1 | 2 | 3 | 4 | 6 | 8', default: '4', description: { pt: 'Margem ao redor, na escala de espaço.', en: 'Surrounding margin, on the space scale.' } },
            { name: 'label', type: 'ReactNode', description: { pt: 'Rótulo sobre a linha (só horizontal).', en: 'Label over the line (horizontal only).' } },
            { name: 'labelPosition', type: "'start' | 'center' | 'end'", default: "'center'", description: { pt: 'Posição do rótulo.', en: 'Label position.' } },
            { name: 'decorative', type: 'boolean', default: 'false', description: { pt: <>Oculta o divisor de tecnologias assistivas (<Code>aria-hidden</Code>).</>, en: <>Hides the divider from assistive technology (<Code>aria-hidden</Code>).</> } },
            { name: '...rest', type: 'HTMLAttributes<HTMLElement>', description: { pt: 'Atributos nativos.', en: 'Native attributes.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                Na horizontal, renderiza um <Code>&lt;hr&gt;</Code>, que já tem o papel <Code>separator</Code>. Na vertical, usa{' '}
                <Code>role="separator"</Code> com <Code>aria-orientation="vertical"</Code>. Com rótulo, o separador é nomeado pelo
                texto via <Code>aria-labelledby</Code>. Divisores não são focáveis e não exigem interação por teclado.
              </>
            }
            en={
              <>
                Horizontally it renders an <Code>&lt;hr&gt;</Code>, which already has the <Code>separator</Code> role. Vertically it
                uses <Code>role="separator"</Code> with <Code>aria-orientation="vertical"</Code>. With a label, the separator is
                named by its text through <Code>aria-labelledby</Code>. Dividers are not focusable and need no keyboard interaction.
              </>
            }
          />
        </p>
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'A separação estrutural é exposta como separator; a decorativa fica oculta.', en: 'Structural separation is exposed as a separator; decorative lines are hidden.' } },
            { criterion: '1.4.11', description: { pt: 'A linha não é a única pista de agrupamento (títulos e espaço também separam). Quando ela precisar se destacar, o tom accent passa de 3:1 nos dois temas.', en: 'The line is never the only grouping cue (headings and spacing also separate). When it must stand out, the accent tone exceeds 3:1 in both themes.' } },
            { criterion: '1.4.12', description: { pt: 'O rótulo acompanha mudanças de espaçamento de texto sem cortar.', en: 'The label adapts to text spacing changes without clipping.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
