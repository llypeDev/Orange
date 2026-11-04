import { Bullets, Code, ComponentPage, DefinitionTable, Example, PropsTable, Section, WcagList } from '../../../kit'
import { T } from '../../../i18n'
import Borders from './examples/Borders'
import BordersCode from './examples/Borders?raw'
import Elevation from './examples/Elevation'
import ElevationCode from './examples/Elevation?raw'
import Inverse from './examples/Inverse'
import InverseCode from './examples/Inverse?raw'
import Polymorphic from './examples/Polymorphic'
import PolymorphicCode from './examples/Polymorphic?raw'
import Summary from './examples/Summary'
import SummaryCode from './examples/Summary?raw'
import Interactive from './examples/Interactive'
import InteractiveCode from './examples/Interactive?raw'
import { meta } from './meta'

export default function PaperPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use para agrupar conteúdo relacionado numa superfície própria: resumos, painéis de configuração, blocos de destaque.',
              en: 'Use it to group related content on its own surface: summaries, settings panels, highlight blocks.',
            },
            {
              pt: (
                <>
                  Escolha o elemento certo com <strong>as</strong>: <Code>section</Code> com título para regiões, <Code>article</Code>{' '}
                  para conteúdo independente, <Code>li</Code> dentro de listas. O Paper não adiciona semântica sozinho.
                </>
              ),
              en: (
                <>
                  Pick the right element with <strong>as</strong>: <Code>section</Code> with a heading for regions,{' '}
                  <Code>article</Code> for standalone content, <Code>li</Code> inside lists. Paper adds no semantics by itself.
                </>
              ),
            },
            {
              pt: 'Evite aninhar superfícies com borda: dentro de um Paper, separe com espaço ou Divider.',
              en: 'Avoid nesting bordered surfaces: inside a Paper, separate with space or a Divider.',
            },
            {
              pt: 'Reserve elevation="overlay" para camadas flutuantes; no fluxo da página, flat ou raised bastam.',
              en: 'Reserve elevation="overlay" for floating layers; in the page flow, flat or raised are enough.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Opções de superfície', en: 'Surface options' }}>
        <DefinitionTable
          rows={[
            { term: { pt: <Code>border</Code>, en: <Code>border</Code> }, description: { pt: 'none, default, strong, accent-top (faixa laranja de 3px no topo) e accent-left.', en: 'none, default, strong, accent-top (3px orange bar on top) and accent-left.' } },
            { term: { pt: <Code>elevation</Code>, en: <Code>elevation</Code> }, description: { pt: 'flat (padrão), raised (sombra leve) e overlay (sombra de sobreposição do sistema).', en: 'flat (default), raised (light shadow) and overlay (the system overlay shadow).' } },
            { term: { pt: <Code>tone</Code>, en: <Code>tone</Code> }, description: { pt: 'default (superfície), subtle (fundo sutil) e inverse (inverte o tema dentro da superfície).', en: 'default (surface), subtle (subtle background) and inverse (flips the theme inside the surface).' } },
            { term: { pt: <Code>padding</Code>, en: <Code>padding</Code> }, description: { pt: 'Escala de espaço: 0, 1, 2, 3, 4, 5, 6 (padrão, 24px), 8, 10, 12.', en: 'Space scale: 0, 1, 2, 3, 4, 5, 6 (default, 24px), 8, 10, 12.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Resumo em uma seção', en: 'Summary in a section' }}
          description={{
            pt: 'Com as="section" e aria-labelledby, o Paper vira uma região nomeada.',
            en: 'With as="section" and aria-labelledby, Paper becomes a named region.',
          }}
          code={SummaryCode}
        >
          <Summary />
        </Example>
        <Example title={{ pt: 'Bordas', en: 'Borders' }} code={BordersCode}>
          <Borders />
        </Example>
        <Example title={{ pt: 'Elevação', en: 'Elevation' }} code={ElevationCode}>
          <Elevation />
        </Example>
        <Example
          title={{ pt: 'Tom inverso', en: 'Inverse tone' }}
          description={{
            pt: 'Aplica o tema oposto dentro da superfície — os componentes internos (como Button) acompanham automaticamente. Teste com o seletor Claro/Escuro.',
            en: 'Applies the opposite theme inside the surface — nested components (like Button) follow automatically. Try the Light/Dark switch.',
          }}
          code={InverseCode}
        >
          <Inverse />
        </Example>
        <Example
          title={{ pt: 'Elemento polimórfico', en: 'Polymorphic element' }}
          description={{ pt: 'Itens de lista renderizados como <li> dentro de um <ul>.', en: 'List items rendered as <li> inside a <ul>.' }}
          code={PolymorphicCode}
        >
          <Polymorphic />
        </Example>
        <Example
          title={{ pt: 'Superfície interativa', en: 'Interactive surface' }}
          description={{ pt: 'interactive transforma o Paper em alvo clicável: eleva no hover/foco e afunda ao pressionar. Aqui com as="a" e a seta do utilitário or-nudge.', en: 'interactive turns Paper into a clickable target: it lifts on hover/focus and sinks on press. Here with as="a" and the or-nudge arrow utility.' }}
          code={InteractiveCode}
        >
          <Interactive />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'as', type: 'ElementType', default: "'div'", description: { pt: 'Elemento renderizado.', en: 'Rendered element.' } },
            { name: 'padding', type: '0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12', default: '6', description: { pt: 'Espaçamento interno na escala de espaço.', en: 'Inner spacing on the space scale.' } },
            { name: 'border', type: "'none' | 'default' | 'strong' | 'accent-top' | 'accent-left'", default: "'default'", description: { pt: 'Estilo da borda.', en: 'Border style.' } },
            { name: 'elevation', type: "'flat' | 'raised' | 'overlay'", default: "'flat'", description: { pt: 'Sombra.', en: 'Shadow.' } },
            { name: 'tone', type: "'default' | 'subtle' | 'inverse'", default: "'default'", description: { pt: 'Cor de fundo; inverse inverte o tema.', en: 'Background color; inverse flips the theme.' } },
            { name: 'interactive', type: 'boolean', default: 'false', description: { pt: <>Superfície clicável: eleva no hover/foco e afunda ao pressionar. Use com <Code>as="a"</Code>/<Code>as="button"</Code> ou com um link interno.</>, en: <>Clickable surface: lifts on hover/focus and sinks on press. Use with <Code>as="a"</Code>/<Code>as="button"</Code> or an inner link.</> } },
            { name: '...rest', type: 'HTMLAttributes<HTMLElement>', description: { pt: 'Atributos do elemento.', en: 'Element attributes.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Hover e foco (interactive)', en: 'Hover and focus (interactive)' }, description: { pt: 'Sobe 4px (--or-distance-lift) com a sombra sólida 0 8px 0 -4px na cor do texto, e uma barra de acento de 4px desce pela borda esquerda (scaleY 0 → 1) — 250ms, ease-out, como os cartões do zop.dev. Uma ponte de 12px abaixo evita tremor com o cursor na borda de baixo. Vale também para o foco de um link ou botão interno. Cores: --or-paper-lift-color e --or-paper-lift-shadow.', en: 'Rises 4px (--or-distance-lift) with the solid 0 8px 0 -4px shadow in the text color, and a 4px accent bar draws down the left edge (scaleY 0 → 1) — 250ms, ease-out, like zop.dev cards. A 12px bridge below prevents flicker with the cursor on the bottom edge. Also applies when an inner link or button has focus. Colors: --or-paper-lift-color and --or-paper-lift-shadow.' } },
            { term: { pt: 'Pressionar', en: 'Press' }, description: { pt: 'Desce 1px abaixo da posição original — 90ms.', en: 'Sinks 1px below its resting position — 90ms.' } },
            { term: { pt: 'Bordas e fundo', en: 'Borders and background' }, description: { pt: 'Transicionam em 160ms quando mudam.', en: 'Transition in 160ms when they change.' } },
            { term: { pt: 'Movimento reduzido', en: 'Reduced motion' }, description: { pt: 'A superfície não se desloca: a sombra e a barra aparecem direto.', en: 'The surface does not move: the shadow and the bar appear instantly.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                O Paper é puramente visual: a semântica vem do elemento escolhido em <Code>as</Code>. Para uma região
                navegável, use <Code>as="section"</Code> com <Code>aria-labelledby</Code> apontando para o título. O tom{' '}
                <Code>inverse</Code> aplica <Code>data-theme</Code> oposto, então textos e componentes internos mantêm o contraste
                dos tokens.
              </>
            }
            en={
              <>
                Paper is purely visual: semantics come from the element chosen in <Code>as</Code>. For a navigable region, use{' '}
                <Code>as="section"</Code> with <Code>aria-labelledby</Code> pointing to the heading. The <Code>inverse</Code> tone
                applies the opposite <Code>data-theme</Code>, so nested text and components keep token contrast.
              </>
            }
          />
        </p>
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Estrutura transmitida pelo elemento escolhido (section, article, li), não pela aparência.', en: 'Structure conveyed by the chosen element (section, article, li), not by appearance.' } },
            { criterion: '1.4.3', description: { pt: 'Todos os tons usam pares de tokens com contraste de 4.5:1 para texto.', en: 'Every tone uses token pairs with 4.5:1 text contrast.' } },
            { criterion: '1.4.11', description: { pt: 'Em modo de alto contraste, a borda usa a cor do sistema.', en: 'In forced-colors mode, the border uses the system color.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
