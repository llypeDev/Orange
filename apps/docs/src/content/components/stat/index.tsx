import { Bullets, Code, ComponentPage, DefinitionTable, Example, PropsTable, Section, WcagList } from '../../../kit'
import { T } from '../../../i18n'
import Dashboard from './examples/Dashboard'
import DashboardCode from './examples/Dashboard?raw'
import InCards from './examples/InCards'
import InCardsCode from './examples/InCards?raw'
import InvertedTone from './examples/InvertedTone'
import InvertedToneCode from './examples/InvertedTone?raw'
import Single from './examples/Single'
import SingleCode from './examples/Single?raw'
import { meta } from './meta'

export default function StatPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Mostre poucas métricas — as que levam a uma decisão. Quatro por linha é o máximo confortável.',
              en: 'Show few metrics — the ones that lead to a decision. Four per row is the comfortable maximum.',
            },
            {
              pt: (
                <>
                  Formate o valor antes de passá-lo (<Code>Intl.NumberFormat</Code>): moeda, separadores e unidades do
                  idioma do usuário.
                </>
              ),
              en: (
                <>
                  Format the value before passing it (<Code>Intl.NumberFormat</Code>): currency, separators and units in
                  the user's locale.
                </>
              ),
            },
            {
              pt: (
                <>
                  Dê contexto à variação com <Code>help</Code> ("vs. outubro"). Uma porcentagem sem referência não diz
                  muito.
                </>
              ),
              en: (
                <>
                  Give the change context with <Code>help</Code> ("vs. October"). A percentage without a reference says
                  little.
                </>
              ),
            },
            {
              pt: (
                <>
                  Quando subir é ruim (churn, custo, tempo de espera), inverta a cor com <Code>deltaTone</Code> — a seta
                  continua mostrando a direção.
                </>
              ),
              en: (
                <>
                  When going up is bad (churn, cost, wait time), invert the color with <Code>deltaTone</Code> — the arrow
                  still shows the direction.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Anatomia', en: 'Anatomy' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Rótulo', en: 'Label' }, description: { pt: 'O que está sendo medido (<dt>).', en: 'What is being measured (<dt>).' } },
            { term: { pt: 'Valor', en: 'Value' }, description: { pt: 'Número em Space Grotesk com tracking negativo e algarismos tabulares (<dd>).', en: 'Number in Space Grotesk with negative tracking and tabular figures (<dd>).' } },
            { term: { pt: 'Variação', en: 'Change' }, description: { pt: 'Seta, valor e tom; texto acessível como "aumento de 12%".', en: 'Arrow, value and tone; accessible text such as "increase of 12%".' } },
            { term: { pt: 'Ajuda', en: 'Help' }, description: { pt: 'Contexto curto: período de comparação, meta, total.', en: 'Short context: comparison period, goal, total.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Métrica com variação', en: 'Metric with change' }}
          description={{
            pt: 'trend="increase" mostra a seta para cima no tom positivo e anuncia "aumento de 12%".',
            en: 'trend="increase" shows the up arrow in the positive tone and announces "increase of 12%".',
          }}
          code={SingleCode}
        >
          <Single />
        </Example>
        <Example
          title={{ pt: 'Painel com StatGroup', en: 'Dashboard with StatGroup' }}
          description={{
            pt: 'Grade com divisórias de 1px que reflui para 2 e 1 coluna. Com animate, cada número conta até o valor ao entrar na tela.',
            en: 'A grid with 1px dividers that reflows to 2 and 1 columns. With animate, each number counts up when it enters the screen.',
          }}
          code={DashboardCode}
          align="stretch"
        >
          <Dashboard />
        </Example>
        <Example
          title={{ pt: 'Quando cair é bom', en: 'When down is good' }}
          description={{
            pt: 'deltaTone="positive" em uma queda (churn) e "negative" em um aumento (custo).',
            en: 'deltaTone="positive" on a decrease (churn) and "negative" on an increase (cost).',
          }}
          code={InvertedToneCode}
          align="stretch"
        >
          <InvertedTone />
        </Example>
        <Example
          title={{ pt: 'Dentro de cartões', en: 'Inside cards' }}
          description={{
            pt: 'Fora de um StatGroup, cada Stat renderiza seu próprio <dl> e pode ser combinado com Card.',
            en: 'Outside a StatGroup, each Stat renders its own <dl> and can be combined with Card.',
          }}
          code={InCardsCode}
          align="stretch"
        >
          <InCards />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'animate', en: 'animate' }, description: { pt: 'Conta de zero até o valor quando o Stat entra na tela (useInView + useCountUp, 1,2s com desaceleração). Todos os números do texto são interpolados com os separadores do idioma.', en: 'Counts from zero to the value when the Stat enters the screen (useInView + useCountUp, 1.2s with deceleration). Every number in the text is interpolated with the locale separators.' } },
            { term: { pt: 'Seta da variação', en: 'Change arrow' }, description: { pt: 'Entra pela direção da tendência (de baixo no aumento, de cima na queda) com --or-ease-spring, após --or-duration-slow (400ms).', en: 'Enters from the trend direction (from below on increase, from above on decrease) with --or-ease-spring, after --or-duration-slow (400ms).' } },
            { term: { pt: 'Leitores de tela', en: 'Screen readers' }, description: { pt: 'O número animado é aria-hidden; o valor final fica no lugar (transparente) e é o único lido.', en: 'The animated number is aria-hidden; the final value stays in place (transparent) and is the only one read.' } },
            { term: { pt: 'Movimento reduzido', en: 'Reduced motion' }, description: { pt: 'Mostra o valor final imediatamente, sem contagem.', en: 'Shows the final value immediately, without counting.' } },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          caption={{ pt: 'Stat', en: 'Stat' }}
          rows={[
            { name: 'label', type: 'ReactNode', required: true, description: { pt: 'O que está sendo medido.', en: 'What is being measured.' } },
            { name: 'value', type: 'ReactNode', required: true, description: { pt: 'O valor, já formatado.', en: 'The value, already formatted.' } },
            { name: 'delta', type: 'ReactNode', description: { pt: 'A variação (ex.: "12%").', en: 'The change (e.g. "12%").' } },
            { name: 'trend', type: "'increase' | 'decrease' | 'neutral'", default: "'neutral'", description: { pt: 'Direção: seta e texto acessível.', en: 'Direction: arrow and accessible text.' } },
            { name: 'deltaTone', type: "'positive' | 'negative' | 'neutral'", description: { pt: 'Se a variação é boa ou ruim. Padrão: segue trend.', en: 'Whether the change is good or bad. Default: follows trend.' } },
            { name: 'help', type: 'ReactNode', description: { pt: 'Contexto da métrica.', en: 'Metric context.' } },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: { pt: 'Tamanho do número.', en: 'Number size.' } },
            { name: 'animate', type: 'boolean', default: 'false', description: { pt: 'Conta até o valor ao entrar na tela (leitores de tela ouvem só o valor final).', en: 'Counts up to the value when entering the screen (screen readers only hear the final value).' } },
            { name: 'format', type: '(value: number) => string', default: 'Intl.NumberFormat', description: { pt: 'Formata value numérico.', en: 'Formats a numeric value.' } },
          ]}
        />
        <PropsTable
          caption={{ pt: 'StatGroup', en: 'StatGroup' }}
          rows={[
            { name: 'columns', type: 'number', default: 'min(filhos, 4)', description: { pt: 'Colunas em contêineres largos.', en: 'Columns in wide containers.' } },
            { name: 'size', type: "'sm' | 'md' | 'lg'", description: { pt: 'Tamanho de todos os Stats.', en: 'Size of every Stat.' } },
            { name: '...rest', type: 'HTMLAttributes<HTMLDListElement>', description: { pt: 'Atributos do <dl>.', en: '<dl> attributes.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                Métricas são pares nome–valor, então usam uma lista de definição: <Code>StatGroup</Code> é um único{' '}
                <Code>&lt;dl&gt;</Code> e cada <Code>Stat</Code> é um grupo <Code>&lt;div&gt;</Code> com{' '}
                <Code>&lt;dt&gt;</Code> e <Code>&lt;dd&gt;</Code>. A seta é decorativa; a variação é lida como frase
                completa ("aumento de 12%", "queda de 3,1%"), traduzida via <Code>useLocale().t()</Code>.
              </>
            }
            en={
              <>
                Metrics are name–value pairs, so they use a description list: <Code>StatGroup</Code> is a single{' '}
                <Code>&lt;dl&gt;</Code> and each <Code>Stat</Code> is a <Code>&lt;div&gt;</Code> group with{' '}
                <Code>&lt;dt&gt;</Code> and <Code>&lt;dd&gt;</Code>. The arrow is decorative; the change is read as a
                full phrase ("increase of 12%", "decrease of 3.1%"), translated via <Code>useLocale().t()</Code>.
              </>
            }
          />
        </p>
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Relação rótulo–valor exposta com <dl>, <dt> e <dd>.', en: 'Label–value relationship exposed with <dl>, <dt> and <dd>.' } },
            { criterion: '1.4.1', description: { pt: 'Direção indicada por seta e texto, não só pela cor.', en: 'Direction shown by arrow and text, not color alone.' } },
            { criterion: '1.4.3', description: { pt: 'Tons de sucesso e perigo com contraste mínimo de 4.5:1.', en: 'Success and danger tones with at least 4.5:1 contrast.' } },
            { criterion: '1.4.10', description: { pt: 'A grade reflui para 2 e 1 coluna sem rolagem horizontal.', en: 'The grid reflows to 2 and 1 columns without horizontal scrolling.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
