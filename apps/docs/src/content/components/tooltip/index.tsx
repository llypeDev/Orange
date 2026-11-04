import { Button, Icon, Tooltip } from '@orange/ui'
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
import Placements from './examples/Placements'
import PlacementsCode from './examples/Placements?raw'
import Shortcut from './examples/Shortcut'
import ShortcutCode from './examples/Shortcut?raw'
import Toolbar from './examples/Toolbar'
import ToolbarCode from './examples/Toolbar?raw'
import { meta } from './meta'

export default function TooltipPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Texto curto (até ~80 caracteres), sem links, botões ou informação essencial — quem usa toque nunca vê o tooltip.',
              en: 'Short text (up to ~80 characters), no links, buttons or essential information — touch users never see the tooltip.',
            },
            {
              pt: (
                <>
                  O tooltip complementa o nome do gatilho, não o substitui: botões só com ícone continuam precisando de{' '}
                  <Code>aria-label</Code>. O texto do tooltip vira a <em>descrição</em> acessível.
                </>
              ),
              en: (
                <>
                  The tooltip complements the trigger's name, it does not replace it: icon-only buttons still need{' '}
                  <Code>aria-label</Code>. The tooltip text becomes the accessible <em>description</em>.
                </>
              ),
            },
            {
              pt: 'O gatilho precisa ser focável. Botões desabilitados não recebem foco nem eventos — explique o motivo em texto visível.',
              en: 'The trigger must be focusable. Disabled buttons receive neither focus nor events — explain the reason in visible text.',
            },
            {
              pt: 'Para conteúdo interativo use Popover; para uma explicação aberta por clique, Toggletip.',
              en: 'For interactive content use Popover; for a click-triggered explanation, Toggletip.',
            },
          ]}
        />
        <DoDont
          doExample={
            <Tooltip content="Mover para a lixeira">
              <Button variant="ghost" iconOnly aria-label="Excluir" startIcon={<Icon name="trash" />} />
            </Tooltip>
          }
          dontExample={
            <Tooltip content="Ao excluir, o item fica 30 dias na lixeira. Para restaurar, acesse Configurações → Lixeira e clique em Restaurar.">
              <Button variant="ghost" iconOnly aria-label="Excluir" startIcon={<Icon name="trash" />} />
            </Tooltip>
          }
          doItems={[{ pt: 'Uma frase curta que esclarece a ação.', en: 'A short phrase clarifying the action.' }]}
          dontItems={[{ pt: 'Instruções longas ou passos que a pessoa precisa seguir.', en: 'Long instructions or steps people must follow.' }]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Botões só com ícone', en: 'Icon-only buttons' }}
          description={{
            pt: 'Passe o ponteiro ou navegue com Tab. Depois do primeiro tooltip, os próximos abrem sem atraso.',
            en: 'Hover or navigate with Tab. After the first tooltip, the next ones open without delay.',
          }}
          code={ToolbarCode}
        >
          <Toolbar />
        </Example>
        <Example
          title={{ pt: 'Posições', en: 'Placements' }}
          description={{ pt: 'Sem espaço, o tooltip inverte de lado automaticamente.', en: 'Without room, the tooltip flips sides automatically.' }}
          code={PlacementsCode}
          align="center"
        >
          <Placements />
        </Example>
        <Example
          title={{ pt: 'Atalhos e atraso', en: 'Shortcuts and delay' }}
          description={{
            pt: (
              <>
                O conteúdo pode incluir um <Code>&lt;kbd&gt;</Code> com o atalho. <Code>delay</Code> controla o atraso no hover
                (padrão 400ms); no foco por teclado o tooltip abre na hora.
              </>
            ),
            en: (
              <>
                Content can include a <Code>&lt;kbd&gt;</Code> with the shortcut. <Code>delay</Code> controls the hover delay
                (400ms by default); on keyboard focus the tooltip opens immediately.
              </>
            ),
          }}
          code={ShortcutCode}
        >
          <Shortcut />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Entrada', en: 'Enter' }, description: { pt: 'Depois do delay (400ms no hover, imediato no foco): fade + 4px vindo do gatilho. 160ms, --or-ease-out. Dentro de 300ms após outro tooltip, abre sem atraso.', en: 'After the delay (400ms on hover, immediate on focus): fade + 4px from the trigger. 160ms, --or-ease-out. Within 300ms of another tooltip, it opens without delay.' } },
            { term: { pt: 'Saída', en: 'Exit' }, description: { pt: 'Recua 4px e some. 80ms (--or-duration-instant), --or-ease-in-out — mais curta que a entrada.', en: 'Retreats 4px and fades. 80ms (--or-duration-instant), --or-ease-in-out — shorter than the entrance.' } },
            { term: { pt: 'prefers-reduced-motion', en: 'prefers-reduced-motion' }, description: { pt: 'Durações e distâncias vão a zero: o componente aparece e some na hora, sem deslocamento.', en: 'Durations and distances drop to zero: the component appears and disappears instantly, with no movement.' } },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'content', type: 'ReactNode', required: true, description: { pt: 'Texto curto e não interativo.', en: 'Short, non-interactive text.' } },
            { name: 'children', type: 'ReactElement', required: true, description: { pt: 'Gatilho focável (um único elemento).', en: 'Focusable trigger (a single element).' } },
            { name: 'placement', type: 'Placement', default: "'top'", description: { pt: 'Posição preferida.', en: 'Preferred position.' } },
            { name: 'delay', type: 'number', default: '400', description: { pt: 'Atraso para abrir no hover (ms).', en: 'Hover open delay (ms).' } },
            { name: 'closeDelay', type: 'number', default: '150', description: { pt: 'Atraso para fechar ao sair (ms) — tempo para alcançar o tooltip.', en: 'Close delay on leave (ms) — time to reach the tooltip.' } },
            { name: 'offset', type: 'number', default: '8', description: { pt: 'Distância do gatilho (px).', en: 'Distance from the trigger (px).' } },
            { name: 'arrow', type: 'boolean', default: 'true', description: { pt: 'Mostra a seta.', en: 'Shows the arrow.' } },
            { name: 'open / defaultOpen / onOpenChange', type: 'boolean / boolean / (open) => void', description: { pt: 'Estado controlado ou não controlado.', en: 'Controlled or uncontrolled state.' } },
            { name: 'disabled', type: 'boolean', default: 'false', description: { pt: 'Desliga o tooltip.', en: 'Turns the tooltip off.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                Segue o padrão <em>Tooltip</em> do WAI-ARIA APG: o conteúdo tem <Code>role="tooltip"</Code> e está ligado ao
                gatilho por <Code>aria-describedby</Code> mesmo enquanto fechado, então leitores de tela leem a descrição assim que
                o gatilho recebe foco. O foco nunca vai para o tooltip.
              </>
            }
            en={
              <>
                Follows the WAI-ARIA APG <em>Tooltip</em> pattern: content has <Code>role="tooltip"</Code> and is linked to the
                trigger by <Code>aria-describedby</Code> even while closed, so screen readers read the description as soon as the
                trigger is focused. Focus never moves into the tooltip.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Focar o gatilho mostra o tooltip; sair dele esconde.', en: 'Focusing the trigger shows the tooltip; leaving it hides it.' } },
            { keys: ['Esc'], description: { pt: 'Esconde o tooltip sem mover o foco.', en: 'Hides the tooltip without moving focus.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.4.13', description: { pt: 'Dispensável (Escape), sobrevoável (o ponteiro pode ir até ele) e persistente (só fecha ao sair).', en: 'Dismissible (Escape), hoverable (the pointer can move onto it) and persistent (only closes on leave).' } },
            { criterion: '2.1.1', description: { pt: 'Aparece também no foco por teclado, não só no hover.', en: 'Also appears on keyboard focus, not just on hover.' } },
            { criterion: '4.1.2', description: { pt: 'Texto exposto como descrição acessível do gatilho.', en: 'Text exposed as the trigger’s accessible description.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
