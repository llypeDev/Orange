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
import { Switch } from '@orange/ui'
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import Controlled from './examples/Controlled'
import ControlledCode from './examples/Controlled?raw'
import SettingsList from './examples/SettingsList'
import SettingsListCode from './examples/SettingsList?raw'
import SizesStates from './examples/SizesStates'
import SizesStatesCode from './examples/SizesStates?raw'
import { meta } from './meta'

export default function SwitchPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use Switch para configurações que valem imediatamente, sem botão "Salvar". Em formulários enviados depois, use Checkbox.',
              en: 'Use Switch for settings that apply immediately, with no "Save" button. In forms submitted later, use Checkbox.',
            },
            {
              pt: 'O rótulo nomeia a configuração ("Notificações por e-mail"), não a ação ("Ativar notificações") nem o estado ("Ligado").',
              en: 'The label names the setting ("Email notifications"), not the action ("Enable notifications") or the state ("On").',
            },
            {
              pt: (
                <>
                  Em listas de configurações, use <Code>labelPosition="start"</Code>: o texto à esquerda e os switches alinhados à direita.
                </>
              ),
              en: (
                <>
                  In settings lists, use <Code>labelPosition="start"</Code>: text on the left and switches aligned on the right.
                </>
              ),
            },
            {
              pt: 'Se a mudança demora ou falha, mostre o resultado (status ou toast) e volte o switch ao estado anterior em caso de erro.',
              en: 'If the change takes time or fails, show the result (status or toast) and revert the switch on error.',
            },
          ]}
        />
        <DoDont
          doExample={<Switch label="Notificações por e-mail" defaultChecked />}
          dontExample={<Switch label="Desativar notificações" />}
          doItems={[{ pt: 'Rótulo afirmativo que nomeia a configuração.', en: 'Positive label naming the setting.' }]}
          dontItems={[{ pt: 'Rótulos negativos: "ligar" o "desativar" confunde.', en: 'Negative labels: turning "disable" on is confusing.' }]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example title={{ pt: 'Básico', en: 'Basic' }} code={BasicCode}>
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Lista de configurações', en: 'Settings list' }}
          description={{ pt: 'Rótulo à esquerda e switch à direita.', en: 'Label on the left and switch on the right.' }}
          code={SettingsListCode}
        >
          <SettingsList />
        </Example>
        <Example title={{ pt: 'Controlado', en: 'Controlled' }} code={ControlledCode}>
          <Controlled />
        </Example>
        <Example title={{ pt: 'Tamanhos e estados', en: 'Sizes and states' }} code={SizesStatesCode}>
          <SizesStates />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'label', type: 'ReactNode', description: { pt: <>Rótulo associado (clicável). Sem ele, informe <Code>aria-label</Code>.</>, en: <>Associated (clickable) label. Without it, provide <Code>aria-label</Code>.</> } },
            { name: 'description', type: 'ReactNode', description: { pt: 'Texto de apoio (aria-describedby).', en: 'Supporting text (aria-describedby).' } },
            { name: 'size', type: "'sm' | 'md'", default: "'md'", description: { pt: 'Tamanho do trilho.', en: 'Track size.' } },
            { name: 'checked', type: 'boolean', description: { pt: 'Estado ligado (controlado).', en: 'On state (controlled).' } },
            { name: 'defaultChecked', type: 'boolean', default: 'false', description: { pt: 'Estado inicial (não controlado).', en: 'Initial state (uncontrolled).' } },
            { name: 'onCheckedChange', type: '(checked: boolean) => void', description: { pt: 'Chamado com o novo estado.', en: 'Called with the new state.' } },
            { name: 'labelPosition', type: "'end' | 'start'", default: "'end'", description: { pt: 'Rótulo depois ou antes do switch.', en: 'Label after or before the switch.' } },
            { name: 'name / value', type: 'string', default: "value: 'on'", description: { pt: 'Envia name=value no formulário quando ligado.', en: 'Submits name=value with the form when on.' } },
            { name: 'disabled', type: 'boolean', default: 'false', description: { pt: 'Desabilita o switch.', en: 'Disables the switch.' } },
            { name: '...rest', type: 'ButtonHTMLAttributes', description: { pt: <>Atributos nativos e <Code>ref</Code> vão para o <Code>&lt;button&gt;</Code>.</>, en: <>Native attributes and <Code>ref</Code> go to the <Code>&lt;button&gt;</Code>.</> } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <p>
          <T
            pt={<>Interações rápidas e geométricas, só com tokens de duração e curva. Com <Code>prefers-reduced-motion</Code>, as durações vão a zero e os estados mudam na hora — o movimento nunca é a única pista de estado.</>}
            en={<>Fast, geometric interactions using only duration and easing tokens. With <Code>prefers-reduced-motion</Code>, durations drop to zero and states change instantly — motion is never the only cue.</>}
          />
        </p>
        <DefinitionTable
          rows={[
            { term: { pt: 'Alternar', en: 'Toggle' }, description: { pt: 'O polegar desliza com --or-ease-spring (250ms) e o trilho troca de cor em 250ms (--or-duration-medium).', en: 'The thumb slides with --or-ease-spring (250ms) and the track changes color in 250ms (--or-duration-medium).' } },
            { term: { pt: 'Hover e foco', en: 'Hover and focus' }, description: { pt: 'Borda mais forte, anel laranja suave e polegar mais claro — 160ms.', en: 'Stronger border, soft orange ring and lighter thumb — 160ms.' } },
            { term: { pt: 'Pressionar', en: 'Press' }, description: { pt: 'No switch ou no rótulo, o polegar encolhe levemente (scale 0.82) em 90ms.', en: 'On the switch or label, the thumb shrinks slightly (scale 0.82) in 90ms.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={<>Segue o padrão <strong>Switch</strong> do WAI-ARIA: um <Code>&lt;button type="button" role="switch"&gt;</Code> com <Code>aria-checked</Code>, nomeado pelo <Code>&lt;label&gt;</Code> (via <Code>aria-labelledby</Code>), que também é clicável. O estado é indicado pela posição do polegar, além da cor.</>}
            en={<>Follows the WAI-ARIA <strong>Switch</strong> pattern: a <Code>&lt;button type="button" role="switch"&gt;</Code> with <Code>aria-checked</Code>, named by its <Code>&lt;label&gt;</Code> (via <Code>aria-labelledby</Code>), which is also clickable. State is shown by the thumb position, not only color.</>}
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Move o foco para o switch.', en: 'Moves focus to the switch.' } },
            { keys: ['Space'], description: { pt: 'Liga ou desliga.', en: 'Turns it on or off.' } },
            { keys: ['Enter'], description: { pt: 'Liga ou desliga.', en: 'Turns it on or off.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.4.1', description: { pt: 'Estado indicado pela posição do polegar, não só pela cor.', en: 'State indicated by thumb position, not only color.' } },
            { criterion: '1.4.11', description: { pt: 'Trilho e polegar com contraste mínimo de 3:1.', en: 'Track and thumb with at least 3:1 contrast.' } },
            { criterion: '2.4.7', description: { pt: 'Foco visível com contorno laranja de 2px.', en: 'Visible focus with a 2px orange outline.' } },
            { criterion: '2.5.8', description: { pt: 'Área de toque de no mínimo 24px de altura.', en: 'Target at least 24px tall.' } },
            { criterion: '4.1.2', description: { pt: 'Nome, papel (switch) e estado (aria-checked) expostos.', en: 'Name, role (switch) and state (aria-checked) exposed.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
