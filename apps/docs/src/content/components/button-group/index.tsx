import {
  Bullets,
  Code,
  ComponentPage,
  DoDont,
  Example,
  KeyboardTable,
  PropsTable,
  Section,
  WcagList,
} from '../../../kit'
import { T } from '../../../i18n'
import { Button, ButtonGroup } from '@orange/ui'
import Attached from './examples/Attached'
import AttachedCode from './examples/Attached?raw'
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import GroupProps from './examples/GroupProps'
import GroupPropsCode from './examples/GroupProps?raw'
import Vertical from './examples/Vertical'
import VerticalCode from './examples/Vertical?raw'
import { meta } from './meta'

export default function ButtonGroupPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Agrupe apenas ações relacionadas ao mesmo objeto ou tarefa — exportar, compartilhar e arquivar um relatório.',
              en: 'Only group actions related to the same object or task — export, share and archive a report.',
            },
            {
              pt: (
                <>
                  Dê um nome ao grupo com <Code>aria-label</Code> (ex.: "Ações do relatório"). Leitores de tela anunciam o nome
                  ao entrar no grupo.
                </>
              ),
              en: (
                <>
                  Name the group with <Code>aria-label</Code> (e.g. "Report actions"). Screen readers announce the name when
                  entering the group.
                </>
              ),
            },
            {
              pt: (
                <>
                  Use <strong>attached</strong> quando os botões formam um único controle (zoom, anterior/próximo). Para ações
                  independentes, mantenha o espaçamento padrão.
                </>
              ),
              en: (
                <>
                  Use <strong>attached</strong> when the buttons form a single control (zoom, previous/next). For independent
                  actions, keep the default spacing.
                </>
              ),
            },
            {
              pt: (
                <>
                  ButtonGroup é para <em>ações</em>. Para escolher um estado, use <strong>ToggleButtonGroup</strong> ou{' '}
                  <strong>SegmentedControl</strong>; para muitas ações com navegação por setas, use <strong>Toolbar</strong>.
                </>
              ),
              en: (
                <>
                  ButtonGroup is for <em>actions</em>. To choose a state, use <strong>ToggleButtonGroup</strong> or{' '}
                  <strong>SegmentedControl</strong>; for many actions with arrow-key navigation, use <strong>Toolbar</strong>.
                </>
              ),
            },
          ]}
        />
        <DoDont
          doExample={
            <ButtonGroup aria-label="Navegar entre pedidos" attached variant="outline">
              <Button>Anterior</Button>
              <Button>Próximo</Button>
            </ButtonGroup>
          }
          dontExample={
            <ButtonGroup aria-label="Ações" attached>
              <Button>Salvar</Button>
              <Button variant="danger">Excluir conta</Button>
              <Button variant="ghost">Ajuda</Button>
            </ButtonGroup>
          }
          doItems={[
            { pt: 'Ações irmãs, com o mesmo peso visual, coladas num único controle.', en: 'Sibling actions with the same visual weight, attached as one control.' },
          ]}
          dontItems={[
            {
              pt: 'Misturar ações sem relação e uma ação destrutiva colada às demais — fácil de clicar por engano.',
              en: 'Mixing unrelated actions with a destructive one attached to the rest — easy to click by mistake.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Grupo básico', en: 'Basic group' }}
          description={{
            pt: 'A variante definida no grupo vale para todos os botões filhos.',
            en: 'The variant set on the group applies to every child button.',
          }}
          code={BasicCode}
        >
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Colado (attached)', en: 'Attached' }}
          description={{
            pt: 'Sem espaço entre os botões e com bordas internas compartilhadas. Em variantes preenchidas, a borda interna vira um divisor sutil.',
            en: 'No gap between buttons and shared inner borders. On filled variants, the inner border becomes a subtle divider.',
          }}
          code={AttachedCode}
        >
          <Attached />
        </Example>
        <Example
          title={{ pt: 'Tamanho, variante e disabled do grupo', en: 'Group size, variant and disabled' }}
          description={{
            pt: (
              <>
                <Code>size</Code>, <Code>variant</Code> e <Code>disabled</Code> são repassados aos filhos que não os definem.
                IconButton, ToggleButton, CopyButton e SplitButton leem o grupo em qualquer nível; <Code>Button</Code> recebe os
                valores quando é filho direto.
              </>
            ),
            en: (
              <>
                <Code>size</Code>, <Code>variant</Code> and <Code>disabled</Code> are passed down to children that don't set
                them. IconButton, ToggleButton, CopyButton and SplitButton read the group at any depth; <Code>Button</Code> gets
                the values when it is a direct child.
              </>
            ),
          }}
          code={GroupPropsCode}
        >
          <GroupProps />
        </Example>
        <Example
          title={{ pt: 'Vertical', en: 'Vertical' }}
          description={{
            pt: 'Os botões ocupam a mesma largura e os rótulos alinham à esquerda.',
            en: 'Buttons share the same width and labels align to the start.',
          }}
          code={VerticalCode}
        >
          <Vertical />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'aria-label', type: 'string', description: { pt: 'Nome do grupo anunciado por leitores de tela. Recomendado (ou aria-labelledby).', en: 'Group name announced by screen readers. Recommended (or aria-labelledby).' } },
            { name: 'attached', type: 'boolean', default: 'false', description: { pt: 'Cola os botões, sem espaço e com bordas internas compartilhadas.', en: 'Attaches the buttons, with no gap and shared inner borders.' } },
            { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: { pt: 'Direção do grupo.', en: 'Group direction.' } },
            { name: 'size', type: "'sm' | 'md' | 'lg'", description: { pt: 'Tamanho repassado aos botões que não definem o próprio.', en: 'Size passed to buttons that do not set their own.' } },
            { name: 'variant', type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'", description: { pt: 'Variante repassada aos botões que não definem a própria.', en: 'Variant passed to buttons that do not set their own.' } },
            { name: 'disabled', type: 'boolean', default: 'false', description: { pt: 'Desabilita todos os botões do grupo.', en: 'Disables every button in the group.' } },
            { name: '...rest', type: 'HTMLAttributes<HTMLDivElement>', description: { pt: 'Atributos nativos do <div role="group">.', en: 'Native attributes of the <div role="group">.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                Renderiza um <Code>&lt;div role="group"&gt;</Code> com o nome dado em <Code>aria-label</Code>. Cada botão continua
                sendo uma parada de Tab — o grupo não muda a navegação. Para uma única parada de Tab com setas, use{' '}
                <strong>Toolbar</strong>.
              </>
            }
            en={
              <>
                Renders a <Code>&lt;div role="group"&gt;</Code> named by <Code>aria-label</Code>. Each button stays a Tab stop —
                the group does not change navigation. For a single Tab stop with arrow keys, use <strong>Toolbar</strong>.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Move o foco para o próximo botão do grupo.', en: 'Moves focus to the next button in the group.' } },
            { keys: ['Shift', 'Tab'], description: { pt: 'Move o foco para o botão anterior.', en: 'Moves focus to the previous button.' } },
            { keys: ['Enter'], description: { pt: 'Ativa o botão focado.', en: 'Activates the focused button.' } },
            { keys: ['Space'], description: { pt: 'Ativa o botão focado.', en: 'Activates the focused button.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: <>A relação entre os botões é exposta com <Code>role="group"</Code> e um nome.</>, en: <>The relationship between buttons is exposed with <Code>role="group"</Code> and a name.</> } },
            { criterion: '1.4.11', description: { pt: 'Bordas e divisores dos grupos colados têm contraste suficiente com o fundo.', en: 'Borders and dividers of attached groups have enough contrast against the background.' } },
            { criterion: '2.4.7', description: { pt: 'O botão focado sobe acima dos vizinhos: o contorno de foco nunca fica escondido.', en: 'The focused button is raised above its neighbors: the focus outline is never hidden.' } },
            { criterion: '4.1.2', description: { pt: 'Cada botão mantém o próprio nome, papel e estado.', en: 'Each button keeps its own name, role and state.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
