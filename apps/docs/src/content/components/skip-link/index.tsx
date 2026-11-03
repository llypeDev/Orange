import {
  Bullets,
  Callout,
  Code,
  ComponentPage,
  Example,
  KeyboardTable,
  PropsTable,
  Section,
  WcagList,
} from '../../../kit'
import { T } from '../../../i18n'
import AppShell from './examples/AppShell'
import AppShellCode from './examples/AppShell?raw'
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import MultipleTargets from './examples/MultipleTargets'
import MultipleTargetsCode from './examples/MultipleTargets?raw'
import { meta } from './meta'

export default function SkipLinkPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Coloque o SkipLink como o primeiro elemento focável da página, antes do cabeçalho e da navegação.',
              en: 'Place the SkipLink as the first focusable element on the page, before the header and navigation.',
            },
            {
              pt: (
                <>
                  O destino precisa existir: por padrão é <Code>#main</Code>, então dê <Code>id="main"</Code> ao seu{' '}
                  <Code>&lt;main&gt;</Code>.
                </>
              ),
              en: (
                <>
                  The target must exist: by default it is <Code>#main</Code>, so give your <Code>&lt;main&gt;</Code>{' '}
                  <Code>id="main"</Code>.
                </>
              ),
            },
            {
              pt: 'Use no máximo dois ou três atalhos (conteúdo, busca, filtros). Mais do que isso vira outra barra de navegação.',
              en: 'Use at most two or three shortcuts (content, search, filters). More than that becomes another navigation bar.',
            },
            {
              pt: 'Não esconda o link com display: none — ele precisa continuar focável. O componente já cuida disso.',
              en: 'Do not hide the link with display: none — it must stay focusable. The component already handles this.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Callout title={{ pt: 'Como testar', en: 'How to try it' }}>
          <T
            pt="O atalho só aparece com foco de teclado. Clique em um botão de tema da prévia (Auto/Escuro/Claro) e pressione Tab."
            en="The shortcut only shows with keyboard focus. Click a preview theme button (Auto/Dark/Light) and press Tab."
          />
        </Callout>
        <Example
          title={{ pt: 'Atalho para o conteúdo', en: 'Skip to content' }}
          description={{
            pt: 'Ao ativar, o foco vai para o destino — que recebe tabindex="-1" temporário se não for focável.',
            en: 'When activated, focus moves to the target — which gets a temporary tabindex="-1" if not focusable.',
          }}
          code={BasicCode}
        >
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Mais de um atalho', en: 'More than one shortcut' }}
          description={{
            pt: 'Em páginas de busca, um segundo atalho leva direto ao campo de busca.',
            en: 'On search pages, a second shortcut goes straight to the search field.',
          }}
          code={MultipleTargetsCode}
        >
          <MultipleTargets />
        </Example>
        <Example
          title={{ pt: 'No layout da aplicação', en: 'In the app layout' }}
          description={{
            pt: 'Inclua o atalho uma única vez, no layout raiz.',
            en: 'Include the shortcut once, in the root layout.',
          }}
          code={AppShellCode}
        >
          <AppShell />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            {
              name: 'href',
              type: 'string',
              default: "'#main'",
              description: { pt: 'Âncora do elemento de destino.', en: 'Anchor of the target element.' },
            },
            {
              name: 'children',
              type: 'ReactNode',
              default: "t('skipToContent')",
              description: {
                pt: 'Rótulo. Padrão: "Pular para o conteúdo principal".',
                en: 'Label. Default: "Skip to main content".',
              },
            },
            {
              name: '...rest',
              type: 'AnchorHTMLAttributes',
              description: { pt: <>Atributos nativos de <Code>&lt;a&gt;</Code>.</>, en: <>Native <Code>&lt;a&gt;</Code> attributes.</> },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={<>Um <Code>&lt;a href="#main"&gt;</Code> nativo, deslocado para fora da tela até receber foco (nunca <Code>display: none</Code>). Ao ativar, o componente move o foco de fato para o destino — sem isso, alguns navegadores só rolam a página e o próximo Tab volta ao topo.</>}
            en={<>A native <Code>&lt;a href="#main"&gt;</Code>, moved off screen until focused (never <Code>display: none</Code>). When activated, the component actually moves focus to the target — without it, some browsers only scroll and the next Tab goes back to the top.</>}
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Primeiro Tab da página revela o atalho.', en: 'The first Tab on the page reveals the shortcut.' } },
            { keys: ['Enter'], description: { pt: 'Pula para o conteúdo e move o foco para ele.', en: 'Skips to the content and moves focus to it.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '2.4.1', description: { pt: 'Mecanismo para pular blocos repetidos de conteúdo.', en: 'Mechanism to bypass repeated blocks of content.' } },
            { criterion: '2.4.3', description: { pt: 'A ordem de foco continua a partir do conteúdo de destino.', en: 'Focus order continues from the target content.' } },
            { criterion: '2.4.7', description: { pt: 'Visível e com contorno de foco quando focado.', en: 'Visible and outlined when focused.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
