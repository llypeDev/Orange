import {
  Bullets,
  Callout,
  Code,
  ComponentPage,
  Example,
  PropsTable,
  Section,
  WcagList,
} from '../../../kit'
import { T } from '../../../i18n'
import CustomFormat from './examples/CustomFormat'
import CustomFormatCode from './examples/CustomFormat?raw'
import Indeterminate from './examples/Indeterminate'
import IndeterminateCode from './examples/Indeterminate?raw'
import TonesSizes from './examples/TonesSizes'
import TonesSizesCode from './examples/TonesSizes?raw'
import Upload from './examples/Upload'
import UploadCode from './examples/Upload?raw'
import { meta } from './meta'

export default function ProgressBarPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use para tarefas com andamento mensurável. Sem como medir, deixe a barra indeterminada (sem value) ou use um Spinner.',
              en: 'Use it for tasks with measurable progress. If you cannot measure it, leave the bar indeterminate (no value) or use a Spinner.',
            },
            {
              pt: 'Sempre dê um rótulo visível que diga o que está acontecendo ("Enviando 3 arquivos").',
              en: 'Always provide a visible label saying what is happening ("Uploading 3 files").',
            },
            {
              pt: (
                <>
                  Quando a unidade importa, formate o valor: "320 de 800 contatos" diz mais que
                  "40%". Use <Code>description</Code> para tempo restante ou tamanho.
                </>
              ),
              en: (
                <>
                  When the unit matters, format the value: "320 of 800 contacts" says more than
                  "40%". Use <Code>description</Code> for time left or size.
                </>
              ),
            },
            {
              pt: 'Para valores que não são progresso (uso de disco, cota), use Meter.',
              en: 'For values that are not progress (disk usage, quota), use Meter.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Upload', en: 'Upload' }}
          description={{
            pt: 'O valor visível e o aria-valuetext usam o mesmo texto formatado no idioma do provider.',
            en: 'The visible value and aria-valuetext use the same text, formatted in the provider locale.',
          }}
          code={UploadCode}
        >
          <Upload />
        </Example>
        <Example
          title={{ pt: 'Indeterminada', en: 'Indeterminate' }}
          description={{
            pt: 'Sem value: sem aria-valuenow. Com movimento reduzido, o segmento deslizante vira uma pulsação.',
            en: 'No value: no aria-valuenow. With reduced motion, the sliding segment becomes a pulse.',
          }}
          code={IndeterminateCode}
        >
          <Indeterminate />
        </Example>
        <Example
          title={{ pt: 'Tons e tamanhos', en: 'Tones and sizes' }}
          description={{
            pt: 'md tem 8px de altura; sm tem 4px.',
            en: 'md is 8px tall; sm is 4px.',
          }}
          code={TonesSizesCode}
        >
          <TonesSizes />
        </Example>
        <Example title={{ pt: 'Valor formatado', en: 'Formatted value' }} code={CustomFormatCode}>
          <CustomFormat />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            {
              name: 'value',
              type: 'number | null',
              description: {
                pt: 'Valor atual. Sem valor, fica indeterminada.',
                en: 'Current value. Without it, the bar is indeterminate.',
              },
            },
            {
              name: 'min',
              type: 'number',
              default: '0',
              description: { pt: 'Valor mínimo.', en: 'Minimum value.' },
            },
            {
              name: 'max',
              type: 'number',
              default: '100',
              description: { pt: 'Valor máximo.', en: 'Maximum value.' },
            },
            {
              name: 'label',
              type: 'ReactNode',
              description: {
                pt: (
                  <>
                    Rótulo visível, ligado por <Code>aria-labelledby</Code>.
                  </>
                ),
                en: (
                  <>
                    Visible label, linked via <Code>aria-labelledby</Code>.
                  </>
                ),
              },
            },
            {
              name: 'description',
              type: 'ReactNode',
              description: {
                pt: (
                  <>
                    Texto de apoio, ligado por <Code>aria-describedby</Code>.
                  </>
                ),
                en: (
                  <>
                    Helper text, linked via <Code>aria-describedby</Code>.
                  </>
                ),
              },
            },
            {
              name: 'showValue',
              type: 'boolean',
              default: 'true',
              description: {
                pt: 'Mostra o valor ao lado do rótulo.',
                en: 'Shows the value next to the label.',
              },
            },
            {
              name: 'formatValue',
              type: '(value, { min, max, percent }) => string',
              description: {
                pt: 'Formata o valor exibido e o aria-valuetext. Padrão: percentual.',
                en: 'Formats the shown value and aria-valuetext. Default: percentage.',
              },
            },
            {
              name: 'tone',
              type: "'accent' | 'neutral' | 'info' | 'success' | 'warning' | 'danger'",
              default: "'accent'",
              description: { pt: 'Cor da barra.', en: 'Bar color.' },
            },
            {
              name: 'size',
              type: "'sm' | 'md'",
              default: "'md'",
              description: { pt: 'Espessura: 4px ou 8px.', en: 'Thickness: 4px or 8px.' },
            },
            {
              name: '...rest',
              type: 'HTMLAttributes<HTMLDivElement>',
              description: {
                pt: (
                  <>
                    Atributos da raiz; <Code>aria-label</Code>/<Code>aria-labelledby</Code> vão para
                    a barra.
                  </>
                ),
                en: (
                  <>
                    Root attributes; <Code>aria-label</Code>/<Code>aria-labelledby</Code> go to the
                    bar.
                  </>
                ),
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
                A trilha é um <Code>role="progressbar"</Code> com <Code>aria-valuemin</Code>,{' '}
                <Code>aria-valuemax</Code>, <Code>aria-valuenow</Code> e <Code>aria-valuetext</Code>
                . O valor visível é <Code>aria-hidden</Code> para não ser lido duas vezes. No modo
                indeterminado, <Code>aria-valuenow</Code> é omitido.
              </>
            }
            en={
              <>
                The track is a <Code>role="progressbar"</Code> with <Code>aria-valuemin</Code>,{' '}
                <Code>aria-valuemax</Code>, <Code>aria-valuenow</Code> and{' '}
                <Code>aria-valuetext</Code>. The visible value is <Code>aria-hidden</Code> so it is
                not read twice. In indeterminate mode, <Code>aria-valuenow</Code> is omitted.
              </>
            }
          />
        </p>
        <Callout tone="info" title={{ pt: 'Anunciar a conclusão', en: 'Announce completion' }}>
          <T
            pt='Leitores de tela não anunciam cada mudança de valor. Ao terminar, avise com um Toast ou uma região role="status" (ex.: “Envio concluído”).'
            en='Screen readers do not announce every value change. When done, notify with a Toast or a role="status" region (e.g. “Upload complete”).'
          />
        </Callout>
        <WcagList
          items={[
            {
              criterion: '1.3.1',
              description: {
                pt: 'Rótulo visível associado programaticamente à barra.',
                en: 'Visible label programmatically associated with the bar.',
              },
            },
            {
              criterion: '1.4.11',
              description: {
                pt: 'Preenchimento com contraste mínimo de 3:1 sobre a trilha.',
                en: 'Fill with at least 3:1 contrast against the track.',
              },
            },
            {
              criterion: '2.3.3',
              description: {
                pt: 'Animação indeterminada substituída por pulsação com movimento reduzido.',
                en: 'Indeterminate animation replaced by a pulse with reduced motion.',
              },
            },
            {
              criterion: '4.1.2',
              description: {
                pt: 'Papel, nome e valores expostos via ARIA.',
                en: 'Role, name and values exposed via ARIA.',
              },
            },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
