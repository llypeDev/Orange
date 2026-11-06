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
import Multiple from './examples/Multiple'
import MultipleCode from './examples/Multiple?raw'
import Single from './examples/Single'
import SingleCode from './examples/Single?raw'
import Standalone from './examples/Standalone'
import StandaloneCode from './examples/Standalone?raw'
import WithIcons from './examples/WithIcons'
import WithIconsCode from './examples/WithIcons?raw'
import { meta } from './meta'

export default function ChipPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use chips para filtros que o usuário liga e desliga e cujo efeito aparece na hora (resultados, gráficos).',
              en: 'Use chips for filters users toggle whose effect shows immediately (results, charts).',
            },
            {
              pt: 'Para opções de formulário que só valem ao enviar, prefira Checkbox ou RadioGroup.',
              en: 'For form options that only apply on submit, prefer Checkbox or RadioGroup.',
            },
            {
              pt: (
                <>
                  Agrupe chips relacionados em um <Code>ChipGroup</Code> com <Code>label</Code> — ele vira o nome do{' '}
                  <Code>role="group"</Code>.
                </>
              ),
              en: (
                <>
                  Group related chips in a <Code>ChipGroup</Code> with a <Code>label</Code> — it names the{' '}
                  <Code>role="group"</Code>.
                </>
              ),
            },
            {
              pt: 'Mostre contagens (count) quando ajudarem a decidir, e desabilite opções sem resultados em vez de escondê-las.',
              en: 'Show counts (count) when they help decide, and disable options without results instead of hiding them.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Chip isolado', en: 'Standalone chip' }}
          description={{
            pt: 'Fora de um grupo, cada chip tem seu próprio estado (selected / defaultSelected / onSelectedChange). Selecionado, o ícone dá lugar ao check.',
            en: 'Outside a group, each chip has its own state (selected / defaultSelected / onSelectedChange). When selected, the icon gives way to the check.',
          }}
          code={StandaloneCode}
        >
          <Standalone />
        </Example>
        <Example
          title={{ pt: 'Seleção múltipla com contagem', en: 'Multiple selection with counts' }}
          description={{
            pt: 'ChipGroup controlado com value (string[]) e onChange. count mostra quantos resultados cada filtro traz.',
            en: 'Controlled ChipGroup with value (string[]) and onChange. count shows how many results each filter brings.',
          }}
          code={MultipleCode}
        >
          <Multiple />
        </Example>
        <Example
          title={{ pt: 'Seleção única', en: 'Single selection' }}
          description={{
            pt: 'selectionMode="single": selecionar um chip desmarca o anterior; clicar no selecionado o desmarca.',
            en: 'selectionMode="single": selecting a chip deselects the previous one; clicking the selected one deselects it.',
          }}
          code={SingleCode}
        >
          <Single />
        </Example>
        <Example
          title={{ pt: 'Com ícones e rótulo oculto', en: 'With icons and hidden label' }}
          description={{
            pt: 'hideLabel mantém o rótulo do grupo só para leitores de tela, quando o contexto visual já é claro.',
            en: 'hideLabel keeps the group label for screen readers only, when the visual context is already clear.',
          }}
          code={WithIconsCode}
        >
          <WithIcons />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Selecionar', en: 'Select' }, description: { pt: 'O check entra com or-scale-in em --or-duration-medium (250ms), --or-ease-bounce (só depois de uma interação, não no carregamento).', en: 'The check enters with or-scale-in in --or-duration-medium (250ms), --or-ease-bounce (only after an interaction, not on load).' } },
            { term: { pt: 'Pressionar', en: 'Press' }, description: { pt: 'Afunda 1px e reduz para 98,5% em --or-duration-press (90ms).', en: 'Sinks 1px and scales to 98.5% in --or-duration-press (90ms).' } },
            { term: { pt: 'Hover e seleção', en: 'Hover and selection' }, description: { pt: 'Borda, fundo e cor transicionam em --or-duration-fast (160ms).', en: 'Border, background and color transition in --or-duration-fast (160ms).' } },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          caption={{ pt: 'Chip', en: 'Chip' }}
          rows={[
            { name: 'value', type: 'string', description: { pt: 'Valor dentro de um ChipGroup.', en: 'Value inside a ChipGroup.' } },
            { name: 'selected', type: 'boolean', description: { pt: 'Selecionado (controlado, fora de grupo).', en: 'Selected (controlled, outside a group).' } },
            { name: 'defaultSelected', type: 'boolean', default: 'false', description: { pt: 'Selecionado inicialmente.', en: 'Initially selected.' } },
            { name: 'onSelectedChange', type: '(selected: boolean) => void', description: { pt: 'Chamado ao alternar (fora de grupo).', en: 'Called on toggle (outside a group).' } },
            { name: 'icon', type: 'ReactNode', description: { pt: 'Ícone antes do rótulo.', en: 'Icon before the label.' } },
            { name: 'count', type: 'number', description: { pt: 'Contagem após o rótulo.', en: 'Count after the label.' } },
            { name: 'size', type: "'sm' | 'md'", default: "'md'", description: { pt: 'Altura de 28 ou 32px.', en: '28 or 32px height.' } },
            { name: 'disabled', type: 'boolean', default: 'false', description: { pt: 'Desabilita o chip.', en: 'Disables the chip.' } },
          ]}
        />
        <PropsTable
          caption={{ pt: 'ChipGroup', en: 'ChipGroup' }}
          rows={[
            { name: 'label', type: 'ReactNode', description: { pt: 'Rótulo do grupo (visível, como eyebrow).', en: 'Group label (visible, as an eyebrow).' } },
            { name: 'hideLabel', type: 'boolean', default: 'false', description: { pt: 'Esconde o rótulo visualmente.', en: 'Visually hides the label.' } },
            { name: 'selectionMode', type: "'multiple' | 'single'", default: "'multiple'", description: { pt: 'Seleção múltipla ou única.', en: 'Multiple or single selection.' } },
            { name: 'value / defaultValue', type: 'string[] (multiple) · string | null (single)', description: { pt: 'Selecionados (controlado / inicial).', en: 'Selected (controlled / initial).' } },
            { name: 'onChange', type: '(value) => void', description: { pt: 'Chamado quando a seleção muda.', en: 'Called when the selection changes.' } },
            { name: 'size', type: "'sm' | 'md'", description: { pt: 'Tamanho de todos os chips.', en: 'Size of every chip.' } },
            { name: 'disabled', type: 'boolean', default: 'false', description: { pt: 'Desabilita todos os chips.', en: 'Disables every chip.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                Cada chip é um <Code>&lt;button type="button"&gt;</Code> com <Code>aria-pressed</Code> — o leitor de
                tela anuncia "Casa e cozinha (86), botão de alternância, pressionado". O grupo usa{' '}
                <Code>role="group"</Code> com <Code>aria-labelledby</Code> apontando para o rótulo. O check e os ícones
                são decorativos; a contagem entra no nome entre parênteses.
              </>
            }
            en={
              <>
                Each chip is a <Code>&lt;button type="button"&gt;</Code> with <Code>aria-pressed</Code> — screen readers
                announce "Home and kitchen (86), toggle button, pressed". The group uses <Code>role="group"</Code> with{' '}
                <Code>aria-labelledby</Code> pointing to the label. The check and icons are decorative; the count joins
                the name in parentheses.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Move o foco entre os chips.', en: 'Moves focus between chips.' } },
            { keys: ['Space'], description: { pt: 'Seleciona ou desmarca o chip focado.', en: 'Selects or deselects the focused chip.' } },
            { keys: ['Enter'], description: { pt: 'Seleciona ou desmarca o chip focado.', en: 'Selects or deselects the focused chip.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Grupo rotulado relaciona os chips ao que filtram.', en: 'A labelled group relates the chips to what they filter.' } },
            { criterion: '1.4.1', description: { pt: 'Selecionado não depende só da cor: há um ícone de check.', en: 'Selection does not rely on color alone: there is a check icon.' } },
            { criterion: '2.5.8', description: { pt: 'Alvos de pelo menos 28px de altura.', en: 'Targets at least 28px tall.' } },
            { criterion: '4.1.2', description: { pt: <>Estado exposto com <Code>aria-pressed</Code>.</>, en: <>State exposed with <Code>aria-pressed</Code>.</> } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
