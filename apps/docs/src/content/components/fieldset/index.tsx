import { Bullets, Code, ComponentPage, Example, KeyboardTable, PropsTable, Section, WcagList } from '../../../kit'
import { T } from '../../../i18n'
import Address from './examples/Address'
import AddressCode from './examples/Address?raw'
import DisabledGroup from './examples/DisabledGroup'
import DisabledGroupCode from './examples/DisabledGroup?raw'
import GroupError from './examples/GroupError'
import GroupErrorCode from './examples/GroupError?raw'
import Sections from './examples/Sections'
import SectionsCode from './examples/Sections?raw'
import { meta } from './meta'

export default function FieldsetPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Agrupe campos que respondem a uma mesma pergunta ou formam um dado composto: endereço, período, dados de contato.',
              en: 'Group fields that answer the same question or form a compound value: address, date range, contact details.',
            },
            {
              pt: 'A legenda deve fazer sentido antes de cada rótulo — leitores de tela anunciam "Endereço de entrega, grupo" ao entrar no primeiro campo.',
              en: 'The legend should make sense before each label — screen readers announce "Shipping address, group" when entering the first field.',
            },
            {
              pt: (
                <>
                  Use <Code>disabled</Code> para bloquear o grupo inteiro de uma vez (comportamento nativo do fieldset).
                </>
              ),
              en: (
                <>
                  Use <Code>disabled</Code> to block the whole group at once (native fieldset behavior).
                </>
              ),
            },
            {
              pt: 'Evite aninhar fieldsets mais de um nível: a leitura fica repetitiva.',
              en: 'Avoid nesting fieldsets more than one level deep: it becomes repetitive to listen to.',
            },
            {
              pt: 'Para grupos de opções use CheckboxGroup e RadioGroup — eles já são fieldsets com legenda no estilo de rótulo.',
              en: 'For option groups use CheckboxGroup and RadioGroup — they are already fieldsets with a label-style legend.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example title={{ pt: 'Endereço', en: 'Address' }} code={AddressCode}>
          <Address />
        </Example>
        <Example
          title={{ pt: 'Desabilitar o grupo', en: 'Disabling the group' }}
          description={{
            pt: 'Desmarque a caixa para liberar o endereço de cobrança.',
            en: 'Uncheck the box to enable the billing address.',
          }}
          code={DisabledGroupCode}
        >
          <DisabledGroup />
        </Example>
        <Example
          title={{ pt: 'Erro do grupo', en: 'Group error' }}
          description={{
            pt: 'Para regras que envolvem vários campos. Envie vazio para ver o erro.',
            en: 'For rules spanning several fields. Submit empty to see the error.',
          }}
          code={GroupErrorCode}
        >
          <GroupError />
        </Example>
        <Example
          title={{ pt: 'Seções e espaçamento', en: 'Sections and spacing' }}
          description={{ pt: <><Code>gap</Code>: sm (12px), md (20px, padrão) e lg (32px).</>, en: <><Code>gap</Code>: sm (12px), md (20px, default) and lg (32px).</> }}
          code={SectionsCode}
        >
          <Sections />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'legend', type: 'ReactNode', required: true, description: { pt: 'Título do grupo (<legend>).', en: 'Group title (<legend>).' } },
            { name: 'hideLegend', type: 'boolean', default: 'false', description: { pt: 'Oculta a legenda visualmente.', en: 'Visually hides the legend.' } },
            { name: 'description', type: 'ReactNode', description: { pt: 'Ajuda do grupo (aria-describedby).', en: 'Group help (aria-describedby).' } },
            { name: 'error', type: 'ReactNode', description: { pt: 'Erro do grupo; mostra uma barra vermelha ao lado dos campos.', en: 'Group error; shows a red bar beside the fields.' } },
            { name: 'disabled', type: 'boolean', default: 'false', description: { pt: 'Desabilita nativamente todos os controles internos.', en: 'Natively disables every inner control.' } },
            { name: 'gap', type: "'sm' | 'md' | 'lg'", default: "'md'", description: { pt: 'Espaço entre os campos.', en: 'Space between fields.' } },
            { name: '...rest', type: 'FieldsetHTMLAttributes', description: { pt: <>Atributos nativos e <Code>ref</Code> vão para o <Code>&lt;fieldset&gt;</Code>.</>, en: <>Native attributes and <Code>ref</Code> go to the <Code>&lt;fieldset&gt;</Code>.</> } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={<>Um <Code>&lt;fieldset&gt;</Code> com <Code>&lt;legend&gt;</Code> nativos (papel <Code>group</Code>, nomeado pela legenda). Descrição e erro entram em <Code>aria-describedby</Code> do fieldset. Com <Code>disabled</Code>, o navegador desabilita todos os controles internos e os retira da ordem de tabulação.</>}
            en={<>A native <Code>&lt;fieldset&gt;</Code> with <Code>&lt;legend&gt;</Code> (role <Code>group</Code>, named by the legend). Description and error go into the fieldset's <Code>aria-describedby</Code>. With <Code>disabled</Code>, the browser disables every inner control and removes it from the tab order.</>}
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Move entre os campos do grupo; o grupo em si não recebe foco.', en: 'Moves between the group fields; the group itself is not focusable.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Relação entre campos expressa por fieldset/legend.', en: 'Relationship between fields expressed via fieldset/legend.' } },
            { criterion: '2.4.6', description: { pt: 'Legendas descritivas organizam o formulário.', en: 'Descriptive legends organize the form.' } },
            { criterion: '3.3.1', description: { pt: 'Erros do grupo descritos em texto e associados.', en: 'Group errors described in text and associated.' } },
            { criterion: '3.3.2', description: { pt: 'Instruções do grupo na descrição.', en: 'Group instructions in the description.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
