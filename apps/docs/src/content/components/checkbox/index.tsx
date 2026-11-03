import { Bullets, Code, ComponentPage, DoDont, Example, KeyboardTable, PropsTable, Section, WcagList } from '../../../kit'
import { T } from '../../../i18n'
import { Checkbox, Switch } from '@orange/ui'
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import Group from './examples/Group'
import GroupCode from './examples/Group?raw'
import Horizontal from './examples/Horizontal'
import HorizontalCode from './examples/Horizontal?raw'
import SelectAll from './examples/SelectAll'
import SelectAllCode from './examples/SelectAll?raw'
import Validation from './examples/Validation'
import ValidationCode from './examples/Validation?raw'
import { meta } from './meta'

export default function CheckboxPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use checkbox quando a escolha só vale ao enviar o formulário. Para ligar algo na hora, use Switch.',
              en: 'Use a checkbox when the choice takes effect on form submit. To turn something on immediately, use Switch.',
            },
            {
              pt: 'Escreva rótulos afirmativos ("Receber novidades"), nunca negativos ("Não quero receber novidades").',
              en: 'Write positive labels ("Receive updates"), never negative ones ("I don\'t want updates").',
            },
            {
              pt: (
                <>
                  Agrupe opções relacionadas em um <strong>CheckboxGroup</strong>: a legenda é anunciada ao entrar no grupo.
                </>
              ),
              en: (
                <>
                  Group related options in a <strong>CheckboxGroup</strong>: the legend is announced when entering the group.
                </>
              ),
            },
            {
              pt: (
                <>
                  Use <Code>indeterminate</Code> apenas para "selecionar todos" quando parte dos itens está marcada.
                </>
              ),
              en: (
                <>
                  Use <Code>indeterminate</Code> only for "select all" when some items are checked.
                </>
              ),
            },
          ]}
        />
        <DoDont
          doExample={<Checkbox label="Receber novidades por e-mail" />}
          dontExample={<Switch label="Aceito os termos de uso" />}
          doItems={[{ pt: 'Checkbox para escolhas confirmadas no envio.', en: 'Checkbox for choices confirmed on submit.' }]}
          dontItems={[{ pt: 'Switch para aceites que dependem de enviar o formulário.', en: 'Switch for consents that depend on submitting the form.' }]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example title={{ pt: 'Básico', en: 'Basic' }} code={BasicCode}>
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Grupo', en: 'Group' }}
          description={{
            pt: <>Com <Code>options</Code> ou filhos <Code>&lt;Checkbox value&gt;</Code>. O valor é um <Code>string[]</Code>.</>,
            en: <>With <Code>options</Code> or <Code>&lt;Checkbox value&gt;</Code> children. The value is a <Code>string[]</Code>.</>,
          }}
          code={GroupCode}
        >
          <Group />
        </Example>
        <Example title={{ pt: 'Selecionar todos', en: 'Select all' }} code={SelectAllCode}>
          <SelectAll />
        </Example>
        <Example title={{ pt: 'Horizontal', en: 'Horizontal' }} code={HorizontalCode}>
          <Horizontal />
        </Example>
        <Example
          title={{ pt: 'Validação e estados', en: 'Validation and states' }}
          description={{ pt: 'Envie sem marcar nada para ver os erros.', en: 'Submit without checking anything to see the errors.' }}
          code={ValidationCode}
        >
          <Validation />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          caption={{ pt: 'Checkbox', en: 'Checkbox' }}
          rows={[
            { name: 'label', type: 'ReactNode', description: { pt: <>Rótulo clicável. Sem ele, informe <Code>aria-label</Code>.</>, en: <>Clickable label. Without it, provide <Code>aria-label</Code>.</> } },
            { name: 'description', type: 'ReactNode', description: { pt: 'Texto de apoio abaixo do rótulo.', en: 'Supporting text below the label.' } },
            { name: 'error', type: 'ReactNode', description: { pt: 'Mensagem de erro; marca aria-invalid.', en: 'Error message; sets aria-invalid.' } },
            { name: 'invalid', type: 'boolean', default: 'false', description: { pt: 'Estado inválido sem mensagem.', en: 'Invalid state without a message.' } },
            { name: 'indeterminate', type: 'boolean', default: 'false', description: { pt: 'Estado misto (aria-checked="mixed").', en: 'Mixed state (aria-checked="mixed").' } },
            { name: 'checked / defaultChecked', type: 'boolean', description: { pt: 'Estado controlado / inicial.', en: 'Controlled / initial state.' } },
            { name: 'onCheckedChange', type: '(checked: boolean) => void', description: { pt: <>Atalho para <Code>onChange</Code>.</>, en: <>Shortcut for <Code>onChange</Code>.</> } },
            { name: 'value', type: 'string', description: { pt: 'Valor no formulário; obrigatório dentro de CheckboxGroup.', en: 'Form value; required inside CheckboxGroup.' } },
            { name: '...rest', type: 'InputHTMLAttributes', description: { pt: <>Atributos nativos e <Code>ref</Code> vão para o <Code>&lt;input&gt;</Code>.</>, en: <>Native attributes and <Code>ref</Code> go to the <Code>&lt;input&gt;</Code>.</> } },
          ]}
        />
        <PropsTable
          caption={{ pt: 'CheckboxGroup', en: 'CheckboxGroup' }}
          rows={[
            { name: 'label', type: 'ReactNode', required: true, description: { pt: 'Legenda do grupo (<legend>).', en: 'Group legend (<legend>).' } },
            { name: 'hideLabel', type: 'boolean', default: 'false', description: { pt: 'Oculta a legenda visualmente.', en: 'Visually hides the legend.' } },
            { name: 'description / error', type: 'ReactNode', description: { pt: 'Ajuda e erro do grupo (aria-describedby).', en: 'Group help and error (aria-describedby).' } },
            { name: 'required / optional', type: 'boolean', description: { pt: 'Indicadores na legenda ("obrigatório" é anunciado).', en: 'Legend indicators ("required" is announced).' } },
            { name: 'value / defaultValue', type: 'string[]', description: { pt: 'Valores marcados (controlado / inicial).', en: 'Checked values (controlled / initial).' } },
            { name: 'onChange', type: '(value: string[]) => void', description: { pt: 'Chamado com a nova lista.', en: 'Called with the new list.' } },
            { name: 'options', type: '{ value, label, description?, disabled? }[]', description: { pt: 'Opções geradas automaticamente.', en: 'Auto-generated options.' } },
            { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: { pt: 'Disposição das opções.', en: 'Options layout.' } },
            { name: 'name', type: 'string', description: { pt: 'name aplicado a todas as caixas.', en: 'name applied to every checkbox.' } },
            { name: 'disabled', type: 'boolean', default: 'false', description: { pt: 'Desabilita todas as opções (fieldset nativo).', en: 'Disables every option (native fieldset).' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={<>Cada opção é um <Code>&lt;input type="checkbox"&gt;</Code> nativo (invisível) sobre a caixa desenhada, com área de clique de 24×24px e rótulo clicável. O grupo usa <Code>&lt;fieldset&gt;</Code>/<Code>&lt;legend&gt;</Code>; descrição e erro entram em <Code>aria-describedby</Code>. <Code>indeterminate</Code> é aplicado como propriedade do DOM e lido como "misto".</>}
            en={<>Each option is a native (invisible) <Code>&lt;input type="checkbox"&gt;</Code> over the drawn box, with a 24×24px hit area and clickable label. The group uses <Code>&lt;fieldset&gt;</Code>/<Code>&lt;legend&gt;</Code>; description and error go into <Code>aria-describedby</Code>. <Code>indeterminate</Code> is set as a DOM property and read as "mixed".</>}
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Move o foco para a próxima caixa.', en: 'Moves focus to the next checkbox.' } },
            { keys: ['Shift', 'Tab'], description: { pt: 'Move o foco para a caixa anterior.', en: 'Moves focus to the previous checkbox.' } },
            { keys: ['Space'], description: { pt: 'Marca ou desmarca.', en: 'Checks or unchecks.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Grupo com fieldset/legend; rótulos associados.', en: 'Group with fieldset/legend; associated labels.' } },
            { criterion: '1.4.11', description: { pt: 'Borda da caixa com contraste mínimo de 3:1.', en: 'Box border with at least 3:1 contrast.' } },
            { criterion: '2.5.8', description: { pt: 'Área de toque de 24×24px, ampliada pelo rótulo.', en: '24×24px target, extended by the label.' } },
            { criterion: '3.3.1', description: { pt: 'Erros em texto ligados à caixa ou ao grupo.', en: 'Text errors linked to the checkbox or group.' } },
            { criterion: '4.1.2', description: { pt: 'Estados marcado, desmarcado e misto expostos nativamente.', en: 'Checked, unchecked and mixed states exposed natively.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
