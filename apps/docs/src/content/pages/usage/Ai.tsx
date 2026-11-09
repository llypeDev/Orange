import { buttonClassName, Icon } from '@orangesys/ui'
import { T } from '../../../i18n'
import { Bullets, Callout, Code, CodeBlock, DefinitionTable, DocPage, Section } from '../../../kit'
import { componentMetas, REPO_URL } from '../../registry'
import { Steps } from '../_shared/Blocks'

/** URL absoluta de um arquivo publicado pelo build (scripts/llms.mjs). */
const published = (path: string) => {
  const base = import.meta.env.BASE_URL
  const origin = typeof window === 'undefined' ? '' : window.location.origin
  return `${origin}${base}${path}`
}

export default function AiPage() {
  const llmsTxt = published('llms.txt')
  const llmsFull = published('llms-full.txt')
  const skillZip = published('llms/orange-ui.zip')
  const skillMd = published('llms/orange-ui/SKILL.md')
  const count = componentMetas.length

  // Linhas curtas: o bloco de código não quebra linha (rola), e o celular mostra ~45 colunas.
  const installClaudeCode = `# na raiz do projeto: cria .claude/skills/orange-ui/
curl -L -o orange-ui.zip \\
  ${skillZip}
unzip orange-ui.zip -d .claude/skills
rm orange-ui.zip`

  const prompt = {
    pt: `Vou construir esta tela com o Orange
Design System (@orangesys/ui). Antes de
escrever código, leia
${llmsTxt}
e, para cada componente que usar, o
arquivo dele. Use só props que estão na
referência, estilize com os tokens
var(--or-*) e siga as regras de
acessibilidade.`,
    en: `I'm building this screen with the
Orange Design System (@orangesys/ui).
Before writing code, read
${llmsTxt}
and, for every component you use, its
file. Only use props listed in the
reference, style with the var(--or-*)
tokens and follow the accessibility
rules.`,
  }

  return (
    <DocPage
      eyebrow={{ pt: 'Usando', en: 'Usage' }}
      title={{ pt: 'Uso com IA', en: 'Using with AI' }}
      lead={{
        pt: 'O Orange vem com uma referência feita para assistentes de IA — Claude, ChatGPT, Copilot, Cursor, Gemini e outros: as props de cada componente geradas do código, boas práticas, acessibilidade e exemplos que funcionam. Assim a IA usa os componentes como a documentação manda, em vez de adivinhar.',
        en: 'Orange ships with a reference made for AI assistants — Claude, ChatGPT, Copilot, Cursor, Gemini and others: each component’s props generated from the code, best practices, accessibility and working examples. The AI then uses the components the way the docs say, instead of guessing.',
      }}
    >
      <Section title={{ pt: 'Três formas', en: 'Three ways' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Skill orange-ui', en: 'orange-ui skill' },
              description: {
                pt: 'Instalado no assistente, ele entra em ação quando o pedido for sobre telas com o Orange e lê só a referência dos componentes que vai usar. Segue o formato aberto de Agent Skills (uma pasta com SKILL.md).',
                en: 'Installed in the assistant, it kicks in when the request is about screens built with Orange and reads only the reference for the components it will use. It follows the open Agent Skills format (a folder with SKILL.md).',
              },
            },
            {
              term: { pt: 'llms.txt', en: 'llms.txt' },
              description: {
                pt: 'Para qualquer IA que acesse a web: um índice com um link para a referência de cada componente. O llms-full.txt traz tudo num arquivo só.',
                en: 'For any AI that can browse: an index with a link to each component’s reference. llms-full.txt has everything in a single file.',
              },
            },
            {
              term: { pt: 'AGENTS.md', en: 'AGENTS.md' },
              description: {
                pt: 'Para IAs que trabalham no código do próprio Orange: a estrutura do monorepo, os comandos e as regras de contribuição.',
                en: 'For AIs working on Orange’s own code: the monorepo layout, the commands and the contribution rules.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Instalar o skill', en: 'Install the skill' }}>
        {/* <div>, não <p>: os links dentro de parágrafos ganham o sublinhado do texto corrido. */}
        <div className="guide-row">
          <a className={buttonClassName({ variant: 'outline' })} href={skillZip} download>
            <span className="or-button__icon or-button__icon--start" aria-hidden="true">
              <Icon name="download" />
            </span>
            <span className="or-button__label">
              <T pt="Baixar orange-ui.zip" en="Download orange-ui.zip" />
            </span>
          </a>
        </div>
        <Steps
          items={[
            {
              title: { pt: 'Claude Code', en: 'Claude Code' },
              content: (
                <>
                  <p>
                    <T
                      pt={
                        <>
                          Descompacte em <Code>.claude/skills/</Code> do projeto (ou em{' '}
                          <Code>~/.claude/skills/</Code> para todos os projetos). O Claude Code
                          encontra o skill sozinho.
                        </>
                      }
                      en={
                        <>
                          Unzip it into the project’s <Code>.claude/skills/</Code> (or{' '}
                          <Code>~/.claude/skills/</Code> for every project). Claude Code finds the
                          skill on its own.
                        </>
                      }
                    />
                  </p>
                  <CodeBlock code={installClaudeCode} language="bash" title="terminal" />
                </>
              ),
            },
            {
              title: { pt: 'Apps do Claude', en: 'Claude apps' },
              content: (
                <p>
                  <T
                    pt="Baixe o orange-ui.zip e envie o arquivo na área de skills das configurações do Claude."
                    en="Download orange-ui.zip and upload it in the skills area of Claude’s settings."
                  />
                </p>
              ),
            },
            {
              title: { pt: 'Outras ferramentas', en: 'Other tools' },
              content: (
                <p>
                  <T
                    pt={
                      <>
                        Ferramentas compatíveis com Agent Skills aceitam a mesma pasta. Nas demais,
                        adicione às instruções do projeto: “Para telas com @orangesys/ui, siga{' '}
                        <Code>{skillMd}</Code>”.
                      </>
                    }
                    en={
                      <>
                        Tools that support Agent Skills take the same folder. For the rest, add to
                        the project instructions: “For screens with @orangesys/ui, follow{' '}
                        <Code>{skillMd}</Code>”.
                      </>
                    }
                  />
                </p>
              ),
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'llms.txt para qualquer IA', en: 'llms.txt for any AI' }}>
        <Bullets
          items={[
            {
              pt: (
                <>
                  <a href={llmsTxt}>llms.txt</a> — o índice (formato llmstxt.org): o que é o Orange
                  e um link para cada um dos {count} componentes, hooks, tokens, ícones, modelos e
                  guias.
                </>
              ),
              en: (
                <>
                  <a href={llmsTxt}>llms.txt</a> — the index (llmstxt.org format): what Orange is
                  and a link to each of the {count} components, hooks, tokens, icons, templates and
                  guides.
                </>
              ),
            },
            {
              pt: (
                <>
                  <a href={llmsFull}>llms-full.txt</a> — tudo num arquivo (cerca de 1,4 MB). Grande
                  para colar inteiro: em ferramentas sem acesso à web, anexe só os arquivos dos
                  componentes que a tela usa.
                </>
              ),
              en: (
                <>
                  <a href={llmsFull}>llms-full.txt</a> — everything in one file (about 1.4 MB). Too
                  big to paste whole: in tools without web access, attach only the files for the
                  components the screen uses.
                </>
              ),
            },
          ]}
        />
        <CodeBlock code={prompt.pt} language="markup" title="prompt (pt)" />
        <CodeBlock code={prompt.en} language="markup" title="prompt (en)" />
      </Section>

      <Section title={{ pt: 'O que a referência traz', en: 'What the reference covers' }}>
        <Bullets
          items={[
            {
              pt: `Uma página por componente (${count}): quando usar, faça e evite, props com tipos e padrões (geradas do TypeScript), teclado, critérios WCAG, movimento e todos os exemplos da documentação.`,
              en: `One page per component (${count}): when to use it, do and don’t, props with types and defaults (generated from TypeScript), keyboard, WCAG criteria, motion and every example from these docs.`,
            },
            {
              pt: 'Fundamentos (OrangeProvider, Field, tipografia, Icon), hooks, tokens nos quatro temas e os nomes dos ícones.',
              en: 'Foundations (OrangeProvider, Field, typography, Icon), hooks, tokens in all four themes and the icon names.',
            },
            {
              pt: 'Os modelos de página (entrar, painel, configurações) com o código completo, e os guias de tema, estilos, i18n e design.',
              en: 'The page templates (sign in, dashboard, settings) with full code, plus the theme, styles, i18n and design guides.',
            },
            {
              pt: (
                <>
                  Sempre em dia: tudo sai do código e desta documentação com{' '}
                  <Code>pnpm gen:ai</Code>, e a CI falha se a referência ficar para trás.
                </>
              ),
              en: (
                <>
                  Always current: everything comes from the code and these docs through{' '}
                  <Code>pnpm gen:ai</Code>, and CI fails if the reference falls behind.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Trabalhando no Orange', en: 'Working on Orange' }}>
        <p>
          <T
            pt={
              <>
                Para contribuir com ajuda de IA, o repositório tem um{' '}
                <a href={`${REPO_URL}/blob/main/AGENTS.md`}>AGENTS.md</a> — lido por Codex, Cursor,
                Copilot, Gemini e outros — e um <Code>CLAUDE.md</Code> que o importa. Eles resumem o{' '}
                <a href={`${REPO_URL}/blob/main/CONTRIBUTING.md`}>CONTRIBUTING.md</a>: estrutura,
                comandos e o que um componente novo precisa ter.
              </>
            }
            en={
              <>
                To contribute with AI help, the repository has an{' '}
                <a href={`${REPO_URL}/blob/main/AGENTS.md`}>AGENTS.md</a> — read by Codex, Cursor,
                Copilot, Gemini and others — and a <Code>CLAUDE.md</Code> that imports it. They
                summarize <a href={`${REPO_URL}/blob/main/CONTRIBUTING.md`}>CONTRIBUTING.md</a>:
                layout, commands and what a new component must include.
              </>
            }
          />
        </p>
        <Callout
          tone="warning"
          title={{ pt: 'Revise o que a IA entrega', en: 'Review what the AI delivers' }}
        >
          <T
            pt="A referência reduz os erros, não os elimina. Confira rótulos, foco e teclado, os quatro temas e a tela em 390px — o skill termina com esse checklist."
            en="The reference reduces mistakes, it doesn’t remove them. Check labels, focus and keyboard, all four themes and the screen at 390px — the skill ends with that checklist."
          />
        </Callout>
      </Section>
    </DocPage>
  )
}
