import { Bullets, Code, ComponentPage, Example, KeyboardTable, PropsTable, Section, WcagList } from '../../../kit'
import { T } from '../../../i18n'
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import Controlled from './examples/Controlled'
import ControlledCode from './examples/Controlled?raw'
import Currency from './examples/Currency'
import CurrencyCode from './examples/Currency?raw'
import States from './examples/States'
import StatesCode from './examples/States?raw'
import Units from './examples/Units'
import UnitsCode from './examples/Units?raw'
import { meta } from './meta'

export default function NumberFieldPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use NumberField para quantidades que se ajustam aos poucos (itens, pessoas, porcentagens). Para números que são identificadores — CPF, CEP, cartão — use TextField com inputMode="numeric".',
              en: 'Use NumberField for quantities adjusted in small increments (items, people, percentages). For numbers that are identifiers — IDs, ZIP codes, cards — use TextField with inputMode="numeric".',
            },
            {
              pt: (
                <>
                  Defina <Code>min</Code> e <Code>max</Code> sempre que houver limite: os botões são desabilitados nos extremos e <Code>Home</Code>/<Code>End</Code> levam até eles.
                </>
              ),
              en: (
                <>
                  Set <Code>min</Code> and <Code>max</Code> whenever there is a limit: buttons are disabled at the ends and <Code>Home</Code>/<Code>End</Code> jump to them.
                </>
              ),
            },
            {
              pt: (
                <>
                  Para dinheiro e porcentagem, use <Code>formatOptions</Code>: o texto segue o idioma do provider (R$ 1.234,50 / $1,234.50) e o valor continua sendo um número.
                </>
              ),
              en: (
                <>
                  For money and percentages, use <Code>formatOptions</Code>: text follows the provider locale (R$ 1.234,50 / $1,234.50) while the value stays a number.
                </>
              ),
            },
            {
              pt: 'O valor digitado é confirmado ao sair do campo ou com Enter, e ajustado aos limites. Texto inválido volta ao último valor.',
              en: 'Typed values are committed on blur or Enter, and clamped to the bounds. Invalid text reverts to the last value.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example title={{ pt: 'Básico', en: 'Basic' }} code={BasicCode}>
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Moeda e porcentagem', en: 'Currency and percent' }}
          description={{
            pt: 'Com porcentagem, o valor é a fração (0,1 = 10%). Digite "R$ 99,9" ou "99,90": os dois funcionam.',
            en: 'With percent, the value is the fraction (0.1 = 10%). Type "R$ 99,9" or "99,90": both work.',
          }}
          code={CurrencyCode}
        >
          <Currency />
        </Example>
        <Example title={{ pt: 'Unidades e passos', en: 'Units and steps' }} code={UnitsCode}>
          <Units />
        </Example>
        <Example
          title={{ pt: 'Controlado', en: 'Controlled' }}
          description={{
            pt: <>O valor é <Code>number | null</Code> — <Code>null</Code> quando o campo está vazio.</>,
            en: <>The value is <Code>number | null</Code> — <Code>null</Code> when the field is empty.</>,
          }}
          code={ControlledCode}
        >
          <Controlled />
        </Example>
        <Example title={{ pt: 'Estados', en: 'States' }} code={StatesCode}>
          <States />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'label', type: 'ReactNode', description: { pt: 'Rótulo visível.', en: 'Visible label.' } },
            { name: 'description / error', type: 'ReactNode', description: { pt: 'Ajuda e mensagem de erro.', en: 'Help text and error message.' } },
            { name: 'required / optional / invalid', type: 'boolean', description: { pt: 'Indicadores e estado de validação.', en: 'Indicators and validation state.' } },
            { name: 'value', type: 'number | null', description: { pt: 'Valor controlado (null = vazio).', en: 'Controlled value (null = empty).' } },
            { name: 'defaultValue', type: 'number | null', default: 'null', description: { pt: 'Valor inicial.', en: 'Initial value.' } },
            { name: 'onChange', type: '(value: number | null) => void', description: { pt: 'Chamado com o novo valor numérico.', en: 'Called with the new numeric value.' } },
            { name: 'min / max', type: 'number', description: { pt: 'Limites; o valor é ajustado a eles.', en: 'Bounds; the value is clamped to them.' } },
            { name: 'step', type: 'number', default: '1', description: { pt: 'Incremento das setas e botões.', en: 'Arrow and button increment.' } },
            { name: 'largeStep', type: 'number', default: 'step × 10', description: { pt: 'Incremento de PageUp/PageDown.', en: 'PageUp/PageDown increment.' } },
            { name: 'formatOptions', type: 'Intl.NumberFormatOptions', description: { pt: 'Formatação (moeda, porcentagem, unidade, casas decimais).', en: 'Formatting (currency, percent, unit, decimals).' } },
            { name: 'prefix / suffix', type: 'ReactNode', description: { pt: 'Texto fixo antes/depois do valor.', en: 'Fixed text before/after the value.' } },
            { name: 'startIcon', type: 'ReactNode', description: { pt: 'Ícone decorativo.', en: 'Decorative icon.' } },
            { name: 'hideStepper', type: 'boolean', default: 'false', description: { pt: 'Oculta os botões − / +.', en: 'Hides the − / + buttons.' } },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: { pt: 'Altura do controle.', en: 'Control height.' } },
            { name: 'name', type: 'string', description: { pt: 'Envia o número cru (sem formatação) em um input oculto.', en: 'Submits the raw (unformatted) number in a hidden input.' } },
            { name: '...rest', type: 'InputHTMLAttributes', description: { pt: <>Atributos nativos e <Code>ref</Code> vão para o <Code>&lt;input&gt;</Code>.</>, en: <>Native attributes and <Code>ref</Code> go to the <Code>&lt;input&gt;</Code>.</> } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={<>Segue o padrão <strong>Spinbutton</strong> do WAI-ARIA: o input tem <Code>role="spinbutton"</Code> com <Code>aria-valuenow</Code>, <Code>aria-valuemin</Code>, <Code>aria-valuemax</Code> e <Code>aria-valuetext</Code> (o valor formatado, como "R$ 12,50"). Os botões − / + têm nome ("Diminuir"/"Aumentar"), <Code>aria-controls</Code> e ficam fora da ordem de tabulação, pois o teclado já cobre tudo. Segurar o botão repete o passo.</>}
            en={<>Follows the WAI-ARIA <strong>Spinbutton</strong> pattern: the input has <Code>role="spinbutton"</Code> with <Code>aria-valuenow</Code>, <Code>aria-valuemin</Code>, <Code>aria-valuemax</Code> and <Code>aria-valuetext</Code> (the formatted value, e.g. "$12.50"). The − / + buttons are named ("Decrease"/"Increase"), have <Code>aria-controls</Code> and are out of the tab order because the keyboard covers everything. Holding a button repeats the step.</>}
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['↑'], description: { pt: 'Aumenta um passo.', en: 'Increases by one step.' } },
            { keys: ['↓'], description: { pt: 'Diminui um passo.', en: 'Decreases by one step.' } },
            { keys: ['PageUp'], description: { pt: <>Aumenta um passo grande (<Code>largeStep</Code>, padrão 10×).</>, en: <>Increases by a large step (<Code>largeStep</Code>, default 10×).</> } },
            { keys: ['PageDown'], description: { pt: 'Diminui um passo grande.', en: 'Decreases by a large step.' } },
            { keys: ['Home'], description: { pt: <>Vai para o mínimo (quando há <Code>min</Code>).</>, en: <>Goes to the minimum (when <Code>min</Code> is set).</> } },
            { keys: ['End'], description: { pt: <>Vai para o máximo (quando há <Code>max</Code>).</>, en: <>Goes to the maximum (when <Code>max</Code> is set).</> } },
            { keys: ['Enter'], description: { pt: 'Confirma o valor digitado.', en: 'Commits the typed value.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Limites e valor expostos por aria-valuemin/max/now.', en: 'Bounds and value exposed via aria-valuemin/max/now.' } },
            { criterion: '2.1.1', description: { pt: 'Todas as ações disponíveis pelo teclado.', en: 'Every action available from the keyboard.' } },
            { criterion: '2.5.7', description: { pt: 'Botões − / + como alternativa a arrastar ou digitar.', en: '− / + buttons as an alternative to dragging or typing.' } },
            { criterion: '2.5.8', description: { pt: 'Botões com no mínimo 30×30px (tamanho sm).', en: 'Buttons at least 30×30px (sm size).' } },
            { criterion: '4.1.2', description: { pt: 'Valor formatado anunciado por aria-valuetext.', en: 'Formatted value announced via aria-valuetext.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
