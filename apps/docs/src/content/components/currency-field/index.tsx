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
import Currencies from './examples/Currencies'
import CurrenciesCode from './examples/Currencies?raw'
import Installments from './examples/Installments'
import InstallmentsCode from './examples/Installments?raw'
import Limits from './examples/Limits'
import LimitsCode from './examples/Limits?raw'
import { meta } from './meta'

export default function CurrencyFieldPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: (
                <>
                  Trabalhe com números: <Code>value</Code> e <Code>onChange</Code> usam{' '}
                  <Code>number | null</Code>, nunca a string formatada. O <Code>name</Code> envia o
                  número cru (ex.: <Code>1299.9</Code>).
                </>
              ),
              en: (
                <>
                  Work with numbers: <Code>value</Code> and <Code>onChange</Code> use{' '}
                  <Code>number | null</Code>, never the formatted string. <Code>name</Code> submits
                  the raw number (e.g. <Code>1299.9</Code>).
                </>
              ),
            },
            {
              pt: 'Não force máscaras que digitam da direita para a esquerda: o usuário digita como escreveria ("1500,90") e o campo formata ao sair.',
              en: 'Avoid right-to-left typing masks: users type as they would write ("1500.90") and the field formats on blur.',
            },
            {
              pt: (
                <>
                  Informe limites na descrição. <Code>min</Code>/<Code>max</Code> ajustam o valor ao
                  sair; para bloquear o envio, mostre também um <Code>error</Code>.
                </>
              ),
              en: (
                <>
                  State limits in the description. <Code>min</Code>/<Code>max</Code> adjust the
                  value on blur; to block submission, also show an <Code>error</Code>.
                </>
              ),
            },
            {
              pt: (
                <>
                  O locale padrão é o do <Code>OrangeProvider</Code>; troque <Code>currency</Code> e{' '}
                  <Code>locale</Code> juntos quando o valor for de outro país.
                </>
              ),
              en: (
                <>
                  The default locale comes from <Code>OrangeProvider</Code>; change{' '}
                  <Code>currency</Code> and <Code>locale</Code> together for values from another
                  country.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Como a digitação é interpretada', en: 'How typing is interpreted' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: <Code>1500,9</Code>, en: <Code>1500,9</Code> },
              description: {
                pt: 'Vírgula é o decimal em pt-BR → 1.500,90',
                en: 'Comma is the decimal in pt-BR → 1.500,90',
              },
            },
            {
              term: { pt: <Code>1.500</Code>, en: <Code>1.500</Code> },
              description: {
                pt: 'Um separador seguido de 3 dígitos é milhar → 1.500,00',
                en: 'One separator followed by 3 digits is a thousands separator → 1.500,00 (pt-BR)',
              },
            },
            {
              term: { pt: <Code>12.5</Code>, en: <Code>12.5</Code> },
              description: {
                pt: 'Ponto com 1 ou 2 dígitos vira decimal (teclado numérico) → 12,50',
                en: 'A dot with 1 or 2 digits becomes the decimal (numeric keypad) → 12,50 (pt-BR)',
              },
            },
            {
              term: { pt: <Code>2.345.678,123</Code>, en: <Code>2.345.678,123</Code> },
              description: {
                pt: 'Arredonda para as casas da moeda → 2.345.678,12',
                en: 'Rounded to the currency precision → 2.345.678,12 (pt-BR)',
              },
            },
            {
              term: { pt: <Code>R$ 99</Code>, en: <Code>R$ 99</Code> },
              description: {
                pt: 'Letras e símbolos são descartados → 99,00',
                en: 'Letters and symbols are dropped → 99,00 (pt-BR)',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Básico', en: 'Basic' }}
          description={{
            pt: 'Real brasileiro (padrão). O símbolo fica no campo e a formatação é aplicada ao sair.',
            en: 'Brazilian real (default). The symbol sits in the field and formatting is applied on blur.',
          }}
          code={BasicCode}
        >
          <Basic />
        </Example>
        <Example title={{ pt: 'Limites', en: 'Limits' }} code={LimitsCode}>
          <Limits />
        </Example>
        <Example
          title={{ pt: 'Outras moedas', en: 'Other currencies' }}
          description={{
            pt: 'Casas decimais, separadores e posição do símbolo seguem o Intl.NumberFormat (o iene não tem centavos).',
            en: 'Decimals, separators and symbol position follow Intl.NumberFormat (the yen has no cents).',
          }}
          code={CurrenciesCode}
        >
          <Currencies />
        </Example>
        <Example
          title={{ pt: 'Simulador de parcelas', en: 'Installment simulator' }}
          code={InstallmentsCode}
        >
          <Installments />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            {
              name: 'value / defaultValue',
              type: 'number | null',
              description: {
                pt: 'Valor numérico (controlado / inicial).',
                en: 'Numeric value (controlled / initial).',
              },
            },
            {
              name: 'onChange',
              type: '(value: number | null) => void',
              description: {
                pt: 'A cada digitação e com o valor final ao sair.',
                en: 'On every keystroke and with the final value on blur.',
              },
            },
            {
              name: 'currency',
              type: 'string',
              default: "'BRL'",
              description: { pt: 'Código ISO 4217.', en: 'ISO 4217 code.' },
            },
            {
              name: 'locale',
              type: 'string',
              default: 'locale do provider',
              description: {
                pt: 'Locale da formatação (pt-BR fora do provider).',
                en: 'Formatting locale (pt-BR outside the provider).',
              },
            },
            {
              name: 'currencyDisplay',
              type: "'symbol' | 'narrowSymbol' | 'code'",
              default: "'symbol'",
              description: { pt: 'Como exibir a moeda.', en: 'How to display the currency.' },
            },
            {
              name: 'min / max',
              type: 'number',
              description: {
                pt: 'Faixa aplicada ao sair. Negativos só com min < 0.',
                en: 'Range applied on blur. Negatives only when min < 0.',
              },
            },
            {
              name: 'label / hideLabel / description / error',
              type: 'ReactNode / boolean',
              description: { pt: 'Estrutura de campo (Field).', en: 'Field structure.' },
            },
            {
              name: 'size',
              type: "'sm' | 'md' | 'lg'",
              default: "'md'",
              description: { pt: 'Altura do controle.', en: 'Control height.' },
            },
            {
              name: 'name',
              type: 'string',
              description: {
                pt: 'Envia o número cru em um input oculto.',
                en: 'Submits the raw number in a hidden input.',
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
                pt: 'Atributos do input (a ref aponta para ele).',
                en: 'Input attributes (the ref points to it).',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Foco', en: 'Focus' },
              description: {
                pt: 'Borda e anel em 160ms; o símbolo acende em laranja (160ms) e encosta 2px no valor (250ms, spring).',
                en: 'Border and ring in 160ms; the symbol turns orange (160ms) and nudges 2px toward the value (250ms, spring).',
              },
            },
            {
              term: { pt: 'Erro', en: 'Error' },
              description: {
                pt: 'O campo treme uma vez (or-shake, 400ms) quando a mensagem surge ou muda; o símbolo fica vermelho.',
                en: 'The field shakes once (or-shake, 400ms) when the message appears or changes; the symbol turns red.',
              },
            },
            {
              term: { pt: 'Sair do campo', en: 'Blur' },
              description: {
                pt: 'A formatação é aplicada sem animar o texto, para não atrapalhar a leitura do valor.',
                en: 'Formatting is applied without animating the text, so the value stays readable.',
              },
            },
            {
              term: { pt: 'Movimento reduzido', en: 'Reduced motion' },
              description: {
                pt: 'Durações e distâncias zeram pelos tokens; o estado continua indicado por cor, borda e texto.',
                en: 'Durations and distances drop to zero via tokens; state is still conveyed by color, border and text.',
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
                É um campo de texto com <Code>inputMode="decimal"</Code> (teclado numérico no
                celular) — não um <Code>type="number"</Code>, que tem problemas conhecidos com
                separadores e rolagem. O símbolo é decorativo; a moeda é anunciada por extenso
                ("Moeda: Real brasileiro") via <Code>aria-describedby</Code>, junto com a ajuda e o
                erro.
              </>
            }
            en={
              <>
                It is a text field with <Code>inputMode="decimal"</Code> (numeric keypad on phones)
                — not a <Code>type="number"</Code>, which has known issues with separators and
                scrolling. The symbol is decorative; the currency is announced in full ("Currency:
                US Dollar") via <Code>aria-describedby</Code>, along with help and error text.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            {
              keys: ['0–9'],
              description: {
                pt: 'Digita o valor; letras e símbolos são ignorados.',
                en: 'Types the value; letters and symbols are ignored.',
              },
            },
            {
              keys: [', / .'],
              description: {
                pt: 'Separador decimal (ambos são aceitos; veja a tabela acima).',
                en: 'Decimal separator (both are accepted; see the table above).',
              },
            },
            {
              keys: ['Tab'],
              description: {
                pt: 'Sai do campo e aplica a formatação e os limites.',
                en: 'Leaves the field and applies formatting and limits.',
              },
            },
          ]}
        />
        <WcagList
          items={[
            {
              criterion: '1.3.1',
              description: {
                pt: 'Moeda informada em texto, não só pelo símbolo.',
                en: 'Currency conveyed in text, not just by the symbol.',
              },
            },
            {
              criterion: '3.3.1',
              description: {
                pt: (
                  <>
                    Erros com <Code>aria-invalid</Code> e mensagem ligada ao campo.
                  </>
                ),
                en: (
                  <>
                    Errors with <Code>aria-invalid</Code> and a message tied to the field.
                  </>
                ),
              },
            },
            {
              criterion: '3.3.2',
              description: {
                pt: 'Placeholder mostra o formato esperado (0,00).',
                en: 'Placeholder shows the expected format (0.00).',
              },
            },
            {
              criterion: '3.3.4',
              description: {
                pt: 'Valores fora dos limites são corrigidos antes do envio.',
                en: 'Out-of-range values are corrected before submission.',
              },
            },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
