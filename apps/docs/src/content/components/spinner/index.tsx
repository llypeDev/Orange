import {
  Bullets,
  Code,
  ComponentPage,
  DefinitionTable,
  Example,
  PropsTable,
  Section,
  WcagList,
} from '../../../kit'
import { T } from '../../../i18n'
import Panel from './examples/Panel'
import PanelCode from './examples/Panel?raw'
import Sizes from './examples/Sizes'
import SizesCode from './examples/Sizes?raw'
import Tones from './examples/Tones'
import TonesCode from './examples/Tones?raw'
import WithText from './examples/WithText'
import WithTextCode from './examples/WithText?raw'
import { meta } from './meta'

export default function SpinnerPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use para esperas curtas (até alguns segundos) cuja duração não dá para medir. Se der para medir, prefira ProgressBar ou ProgressCircle.',
              en: 'Use it for short waits (up to a few seconds) whose duration cannot be measured. If it can be measured, prefer ProgressBar or ProgressCircle.',
            },
            {
              pt: 'Para telas ou listas inteiras carregando, Skeleton mostra a forma do conteúdo e reduz a sensação de espera.',
              en: 'For whole screens or lists loading, Skeleton shows the shape of the content and reduces perceived wait.',
            },
            {
              pt: (
                <>
                  Dê um rótulo específico com <Code>label</Code> ("Carregando comentários"), em vez
                  do genérico "Carregando…".
                </>
              ),
              en: (
                <>
                  Give it a specific <Code>label</Code> ("Loading comments") instead of the generic
                  "Loading…".
                </>
              ),
            },
            {
              pt: (
                <>
                  Botões que disparam a espera já têm <Code>loading</Code> — não coloque um Spinner
                  solto ao lado deles.
                </>
              ),
              en: (
                <>
                  Buttons that trigger the wait already have <Code>loading</Code> — don't place a
                  loose Spinner next to them.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Tons', en: 'Tones' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: <Code>accent</Code>, en: <Code>accent</Code> },
              description: {
                pt: 'Laranja. Padrão, para esperas em destaque.',
                en: 'Orange. Default, for prominent waits.',
              },
            },
            {
              term: { pt: <Code>neutral</Code>, en: <Code>neutral</Code> },
              description: {
                pt: 'Cor do texto, para áreas discretas.',
                en: 'Text color, for low-key areas.',
              },
            },
            {
              term: { pt: <Code>current</Code>, en: <Code>current</Code> },
              description: {
                pt: 'Herda currentColor — dentro de botões, links e textos coloridos.',
                en: 'Inherits currentColor — inside buttons, links and colored text.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Tamanhos', en: 'Sizes' }}
          description={{
            pt: 'sm (16px), md (24px, padrão) e lg (40px).',
            en: 'sm (16px), md (24px, default) and lg (40px).',
          }}
          code={SizesCode}
          align="center"
        >
          <Sizes />
        </Example>
        <Example title={{ pt: 'Tons', en: 'Tones' }} code={TonesCode} align="center">
          <Tones />
        </Example>
        <Example
          title={{ pt: 'Com texto visível', en: 'With visible text' }}
          description={{
            pt: 'Quando há texto ao lado, ele vira o anúncio e o Spinner fica decorativo.',
            en: 'When there is text next to it, the text becomes the announcement and the Spinner is decorative.',
          }}
          code={WithTextCode}
        >
          <WithText />
        </Example>
        <Example
          title={{ pt: 'Em um painel', en: 'In a panel' }}
          description={{
            pt: 'Clique em Recarregar: o Spinner ocupa o lugar do conteúdo e anuncia o rótulo.',
            en: 'Click Reload: the Spinner takes the place of the content and announces its label.',
          }}
          code={PanelCode}
        >
          <Panel />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            {
              name: 'size',
              type: "'sm' | 'md' | 'lg'",
              default: "'md'",
              description: { pt: 'Diâmetro: 16, 24 ou 40px.', en: 'Diameter: 16, 24 or 40px.' },
            },
            {
              name: 'tone',
              type: "'accent' | 'neutral' | 'current'",
              default: "'accent'",
              description: { pt: 'Cor do arco.', en: 'Arc color.' },
            },
            {
              name: 'label',
              type: 'string',
              default: "t('loading')",
              description: {
                pt: 'Texto anunciado (visualmente oculto).',
                en: 'Announced text (visually hidden).',
              },
            },
            {
              name: 'decorative',
              type: 'boolean',
              default: 'false',
              description: {
                pt: (
                  <>
                    Oculta de tecnologias assistivas (<Code>aria-hidden</Code>).
                  </>
                ),
                en: (
                  <>
                    Hides it from assistive technology (<Code>aria-hidden</Code>).
                  </>
                ),
              },
            },
            {
              name: '...rest',
              type: 'HTMLAttributes<HTMLSpanElement>',
              description: {
                pt: 'Atributos nativos do <span> raiz.',
                en: 'Native attributes of the root <span>.',
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
                O Spinner é um <Code>role="status"</Code> com o rótulo em texto visualmente oculto,
                traduzido pelo <Code>OrangeProvider</Code>. Não recebe foco. Com movimento reduzido,
                a rotação é trocada por uma pulsação lenta de opacidade.
              </>
            }
            en={
              <>
                Spinner is a <Code>role="status"</Code> with its label as visually hidden text,
                translated by <Code>OrangeProvider</Code>. It does not receive focus. With reduced
                motion, the rotation is replaced by a slow opacity pulse.
              </>
            }
          />
        </p>
        <WcagList
          items={[
            {
              criterion: '1.4.11',
              description: {
                pt: 'Arco com contraste mínimo de 3:1 sobre o fundo.',
                en: 'Arc with at least 3:1 contrast against the background.',
              },
            },
            {
              criterion: '2.3.3',
              description: {
                pt: 'Sem rotação contínua quando o sistema pede movimento reduzido.',
                en: 'No continuous rotation when the system requests reduced motion.',
              },
            },
            {
              criterion: '4.1.3',
              description: {
                pt: (
                  <>
                    Estado anunciado via <Code>role="status"</Code>, sem mover o foco.
                  </>
                ),
                en: (
                  <>
                    State announced via <Code>role="status"</Code>, without moving focus.
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
