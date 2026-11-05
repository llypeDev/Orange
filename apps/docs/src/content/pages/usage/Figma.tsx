import { Button, Icon } from '@orange/ui'
import { themeNames } from '@orange/tokens'
import {
  buildDtcgBundle,
  buildPrimitiveTokens,
  buildThemeTokens,
  figmaCollections,
  flattenTokens,
  primitivesMode,
} from '@orange/tokens/dtcg'
import { useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { T, useLang, type Localized } from '../../../i18n'
import {
  Bullets,
  Callout,
  Code,
  CodeBlock,
  DefinitionTable,
  DocPage,
  Prose,
  Section,
} from '../../../kit'
import { Steps, TableWrap } from '../_shared/Blocks'

/* --- Amostras geradas dos próprios tokens ---------------------------------- */

const pick = (group: Record<string, unknown>, keys: string[]) =>
  Object.fromEntries(['$type', ...keys].map((key) => [key, group[key]]))

function sampleJson() {
  const primitives = buildPrimitiveTokens() as Record<string, Record<string, unknown>>
  const color = primitives.color as Record<string, Record<string, unknown>>
  const darkHc = buildThemeTokens('dark-hc').color as Record<string, unknown>
  return {
    primitives: JSON.stringify(
      { color: { $type: 'color', orange: pick(color.orange, ['500']) }, space: pick(primitives.space, ['4']) },
      null,
      2,
    ),
    theme: JSON.stringify({ color: pick(darkHc, ['bg', 'text', 'accent', 'overlay']) }, null, 2),
  }
}

function download(filename: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/* --- Tabelas ------------------------------------------------------------------ */

const sets: { file: string; mode: string; text: Localized<ReactNode> }[] = [
  {
    file: 'primitivas.json',
    mode: `${figmaCollections.primitives} · ${primitivesMode}`,
    text: {
      pt: 'Paletas de cor, espaço, raio, tipografia (família, tamanho, peso, entrelinha, espaçamento) e movimento (durações, curvas, distâncias).',
      en: 'Color palettes, space, radius, typography (family, size, weight, line height, letter spacing) and motion (durations, curves, distances).',
    },
  },
  ...themeNames.map((name) => ({
    file: `tema/${name}.json`,
    mode: `${figmaCollections.theme} · ${name}`,
    text: {
      pt: <>Os tokens <Code>--or-color-*</Code> (inclusive <Code>viz-*</Code>) do tema, como aliases.</>,
      en: <>The theme's <Code>--or-color-*</Code> tokens (including <Code>viz-*</Code>), as aliases.</>,
    },
  })),
  {
    file: '$themes.json · $metadata.json',
    mode: 'Tokens Studio',
    text: {
      pt: 'Temas do Tokens Studio (grupo = coleção, tema = modo) e a ordem dos conjuntos.',
      en: 'Tokens Studio themes (group = collection, theme = mode) and the set order.',
    },
  },
]

const typeMap: [string, string, Localized<string>][] = [
  ['color', 'COLOR', { pt: 'Alias vira VARIABLE_ALIAS; rgba mantém o alfa.', en: 'Aliases become VARIABLE_ALIAS; rgba keeps its alpha.' }],
  ['dimension', 'FLOAT', { pt: 'Em px (1rem = 16px).', en: 'In px (1rem = 16px).' }],
  ['fontWeight · number', 'FLOAT', { pt: 'Entrelinha e espaçamento ficam sem unidade/em.', en: 'Line height and letter spacing stay unitless/em.' }],
  ['duration', 'FLOAT', { pt: 'Em ms.', en: 'In ms.' }],
  ['fontFamily', 'STRING', { pt: 'Só a primeira família da pilha.', en: 'Only the first family of the stack.' }],
  ['cubicBezier', 'STRING', { pt: 'Texto cubic-bezier(…), para o Dev Mode.', en: 'cubic-bezier(…) text, for Dev Mode.' }],
]

export default function FigmaPage() {
  const { t, to } = useLang()
  const samples = useMemo(sampleJson, [])
  const [announce, setAnnounce] = useState('')
  const stats = useMemo(() => {
    const primitives = flattenTokens(buildPrimitiveTokens()).length
    const theme = flattenTokens(buildThemeTokens('dark')).length
    return { primitives, theme }
  }, [])

  return (
    <DocPage
      eyebrow={{ pt: 'Usando', en: 'Usage' }}
      title={{ pt: 'Figma', en: 'Figma' }}
      lead={{
        pt: 'Os tokens do Orange saem do código no formato W3C Design Tokens (DTCG) e chegam ao Figma como variáveis: uma coleção de primitivas e uma de tema, com um modo para cada tema e os aliases preservados.',
        en: "Orange tokens leave the code in the W3C Design Tokens (DTCG) format and reach Figma as variables: one primitives collection and one theme collection, with a mode per theme and aliases preserved.",
      }}
    >
      <Section title={{ pt: 'Dois caminhos', en: 'Two paths' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Importar o arquivo DTCG', en: 'Import the DTCG file' },
              description: {
                pt: 'Com o Tokens Studio ou com a importação de variáveis do próprio Figma. Funciona em qualquer plano e não precisa de token.',
                en: "With Tokens Studio or Figma's own variables import. Works on any plan and needs no token.",
              },
            },
            {
              term: { pt: 'Sincronizar pela API', en: 'Sync through the API' },
              description: {
                pt: (
                  <>
                    <Code>figma:sync</Code> envia as variáveis pela API REST de variáveis, sem
                    abrir o Figma. Exige um plano com acesso de escrita à API.
                  </>
                ),
                en: (
                  <>
                    <Code>figma:sync</Code> pushes the variables through the Variables REST API,
                    without opening Figma. Requires a plan with API write access.
                  </>
                ),
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'O arquivo DTCG', en: 'The DTCG file' }} id="dtcg">
        <Prose>
          <p>
            <T
              pt={
                <>
                  <Code>pnpm --filter @orange/tokens build</Code> gera, além do{' '}
                  <Code>tokens.css</Code>, o <Code>dist/tokens.dtcg.json</Code> (publicado como{' '}
                  <Code>@orange/tokens/tokens.dtcg.json</Code>) e a pasta <Code>dist/tokens/</Code>{' '}
                  com um arquivo por conjunto. São {stats.primitives} primitivas e{' '}
                  {stats.theme} tokens semânticos por tema. O builder também é público:{' '}
                  <Code>buildDtcgBundle()</Code> em <Code>@orange/tokens/dtcg</Code>.
                </>
              }
              en={
                <>
                  Besides <Code>tokens.css</Code>, <Code>pnpm --filter @orange/tokens build</Code>{' '}
                  writes <Code>dist/tokens.dtcg.json</Code> (published as{' '}
                  <Code>@orange/tokens/tokens.dtcg.json</Code>) and the <Code>dist/tokens/</Code>{' '}
                  folder with one file per set. That is {stats.primitives} primitives and{' '}
                  {stats.theme} semantic tokens per theme. The builder is public too:{' '}
                  <Code>buildDtcgBundle()</Code> in <Code>@orange/tokens/dtcg</Code>.
                </>
              }
            />
          </p>
        </Prose>
        <TableWrap label={{ pt: 'Conjuntos do DTCG', en: 'DTCG sets' }}>
          <table className="doc-table">
            <thead>
              <tr>
                <th scope="col">{t({ pt: 'Arquivo', en: 'File' })}</th>
                <th scope="col">{t({ pt: 'Coleção · modo no Figma', en: 'Figma collection · mode' })}</th>
                <th scope="col">{t({ pt: 'Conteúdo', en: 'Contents' })}</th>
              </tr>
            </thead>
            <tbody>
              {sets.map((set) => (
                <tr key={set.file}>
                  <th scope="row">
                    <Code>{set.file}</Code>
                  </th>
                  <td>{set.mode}</td>
                  <td>{t(set.text)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
        <div className="guide-row">
          <Button
            variant="outline"
            size="sm"
            startIcon={<Icon name="download" size="sm" />}
            onClick={() => {
              download('tokens.dtcg.json', `${JSON.stringify(buildDtcgBundle(), null, 2)}\n`)
              setAnnounce(t({ pt: 'tokens.dtcg.json baixado', en: 'tokens.dtcg.json downloaded' }))
            }}
          >
            {t({ pt: 'Baixar tokens.dtcg.json', en: 'Download tokens.dtcg.json' })}
          </Button>
          <span className="or-visually-hidden" role="status">
            {announce}
          </span>
        </div>
        <Prose>
          <h3 className="doc-h3">{t({ pt: 'Modos: um arquivo por modo', en: 'Modes: one file per mode' })}</h3>
          <p>
            <T
              pt={
                <>
                  O DTCG não tem modos. Das duas convenções comuns — um arquivo (conjunto) por modo
                  ou valores por modo em <Code>$extensions</Code> — o Orange usa{' '}
                  <strong>um arquivo por modo</strong>, porque é o que as duas ferramentas entendem:
                  a importação de variáveis do Figma lê um JSON por modo, e o Tokens Studio
                  transforma conjuntos + <Code>$themes</Code> em coleções e modos. Valores em{' '}
                  <Code>$extensions</Code> seriam ignorados pelas duas. Os tokens semânticos são
                  aliases (<Code>{'{color.orange.500}'}</Code>) para as primitivas; só
                  transparências e alguns ajustes finos ficam como cor crua.
                </>
              }
              en={
                <>
                  DTCG has no modes. Of the two common conventions — one file (set) per mode or
                  per-mode values in <Code>$extensions</Code> — Orange uses{' '}
                  <strong>one file per mode</strong>, because it is what both tools understand:
                  Figma's variables import reads one JSON per mode, and Tokens Studio turns sets +{' '}
                  <Code>$themes</Code> into collections and modes. Values in{' '}
                  <Code>$extensions</Code> would be ignored by both. Semantic tokens are aliases (
                  <Code>{'{color.orange.500}'}</Code>) to primitives; only transparencies and a few
                  fine adjustments stay as raw colors.
                </>
              }
            />
          </p>
          <p>
            <T
              pt={
                <>
                  Os valores seguem o DTCG 2025.10: cores como objeto (<Code>colorSpace</Code>,{' '}
                  <Code>components</Code>, <Code>alpha</Code>) com <Code>hex</Code> de reserva para
                  ferramentas mais antigas, dimensões e durações como <Code>{'{ value, unit }'}</Code>.
                  Cada token traz a custom property CSS em{' '}
                  <Code>$extensions["orange.cssVar"]</Code>.
                </>
              }
              en={
                <>
                  Values follow DTCG 2025.10: colors as objects (<Code>colorSpace</Code>,{' '}
                  <Code>components</Code>, <Code>alpha</Code>) with a <Code>hex</Code> fallback for
                  older tools, dimensions and durations as <Code>{'{ value, unit }'}</Code>. Every
                  token carries its CSS custom property in{' '}
                  <Code>$extensions["orange.cssVar"]</Code>.
                </>
              }
            />
          </p>
        </Prose>
        <CodeBlock language="json" title="dist/tokens/primitivas.json (trecho)" code={samples.primitives} maxHeight={360} />
        <CodeBlock language="json" title="dist/tokens/tema/dark-hc.json (trecho)" code={samples.theme} maxHeight={360} />
      </Section>

      <Section title={{ pt: 'Importar com o Tokens Studio', en: 'Import with Tokens Studio' }} id="tokens-studio">
        <Steps
          items={[
            {
              title: { pt: 'Carregue os tokens', en: 'Load the tokens' },
              content: (
                <p>
                  <T
                    pt={
                      <>
                        Arquivo único: cole ou carregue o <Code>tokens.dtcg.json</Code>. Sincronização
                        com o repositório (GitHub, GitLab…): aponte para a pasta{' '}
                        <Code>dist/tokens/</Code> — cada arquivo vira um conjunto, e o{' '}
                        <Code>$themes.json</Code> traz os temas prontos.
                      </>
                    }
                    en={
                      <>
                        Single file: paste or load <Code>tokens.dtcg.json</Code>. Repository sync
                        (GitHub, GitLab…): point it to the <Code>dist/tokens/</Code> folder — each
                        file becomes a set, and <Code>$themes.json</Code> brings the themes.
                      </>
                    }
                  />
                </p>
              ),
            },
            {
              title: { pt: 'Confira os temas', en: 'Check the themes' },
              content: (
                <p>
                  <T
                    pt={
                      <>
                        Grupo <Code>{figmaCollections.primitives}</Code> com o tema{' '}
                        <Code>{primitivesMode}</Code>; grupo <Code>{figmaCollections.theme}</Code>{' '}
                        com <Code>{themeNames.join(', ')}</Code> — cada um usa{' '}
                        <Code>primitivas</Code> como fonte e o próprio conjunto como ativo.
                      </>
                    }
                    en={
                      <>
                        Group <Code>{figmaCollections.primitives}</Code> with the{' '}
                        <Code>{primitivesMode}</Code> theme; group <Code>{figmaCollections.theme}</Code>{' '}
                        with <Code>{themeNames.join(', ')}</Code> — each uses <Code>primitivas</Code>{' '}
                        as source and its own set as enabled.
                      </>
                    }
                  />
                </p>
              ),
            },
            {
              title: { pt: 'Exporte para variáveis', en: 'Export to variables' },
              content: (
                <p>
                  <T
                    pt="Use a exportação de variáveis por temas: cada grupo vira uma coleção e cada tema um modo, com os aliases preservados."
                    en="Use the export of variables by themes: each group becomes a collection and each theme a mode, with aliases preserved."
                  />
                </p>
              ),
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Importar no próprio Figma', en: 'Import in Figma itself' }} id="figma-import">
        <Steps
          items={[
            {
              title: { pt: 'Primitivas primeiro', en: 'Primitives first' },
              content: (
                <p>
                  <T
                    pt={
                      <>
                        No painel de variáveis, crie a coleção{' '}
                        <Code>{figmaCollections.primitives}</Code> importando{' '}
                        <Code>primitivas.json</Code>.
                      </>
                    }
                    en={
                      <>
                        In the variables panel, create the{' '}
                        <Code>{figmaCollections.primitives}</Code> collection by importing{' '}
                        <Code>primitivas.json</Code>.
                      </>
                    }
                  />
                </p>
              ),
            },
            {
              title: { pt: 'Um modo por arquivo de tema', en: 'One mode per theme file' },
              content: (
                <p>
                  <T
                    pt={
                      <>
                        Importe <Code>tema/dark.json</Code>, <Code>tema/light.json</Code>,{' '}
                        <Code>tema/dark-hc.json</Code> e <Code>tema/light-hc.json</Code> como os
                        quatro modos da coleção <Code>{figmaCollections.theme}</Code>.
                      </>
                    }
                    en={
                      <>
                        Import <Code>tema/dark.json</Code>, <Code>tema/light.json</Code>,{' '}
                        <Code>tema/dark-hc.json</Code> and <Code>tema/light-hc.json</Code> as the
                        four modes of the <Code>{figmaCollections.theme}</Code> collection.
                      </>
                    }
                  />
                </p>
              ),
            },
          ]}
        />
        <Callout tone="info" title={{ pt: 'Aliases entre coleções', en: 'Aliases across collections' }}>
          <p>
            <T
              pt="Os aliases do tema apontam para a coleção de primitivas. Se o importador da sua versão do Figma não resolver aliases entre coleções, use o Tokens Studio ou o script abaixo — os dois preservam os aliases."
              en="Theme aliases point to the primitives collection. If your Figma version's importer doesn't resolve aliases across collections, use Tokens Studio or the script below — both keep aliases."
            />
          </p>
        </Callout>
      </Section>

      <Section title={{ pt: 'Sincronizar pela API', en: 'Sync through the API' }} id="figma-sync">
        <Prose>
          <p>
            <T
              pt={
                <>
                  O script <Code>packages/tokens/scripts/figma-sync.ts</Code> lê os mesmos conjuntos
                  DTCG e chama <Code>POST /v1/files/:file_key/variables</Code>. Ele é idempotente
                  pelo nome: coleções, modos e variáveis que já existem são reaproveitados, só vai o
                  que falta ou mudou, e nada é apagado. Rodar duas vezes seguidas não envia nada na
                  segunda.
                </>
              }
              en={
                <>
                  The <Code>packages/tokens/scripts/figma-sync.ts</Code> script reads the same DTCG
                  sets and calls <Code>POST /v1/files/:file_key/variables</Code>. It is idempotent
                  by name: existing collections, modes and variables are reused, only what is
                  missing or changed is sent, and nothing is deleted. Running it twice in a row sends
                  nothing the second time.
                </>
              }
            />
          </p>
        </Prose>
        <CodeBlock
          language="bash"
          title="Terminal"
          code={`# Só mostra o payload (como para um arquivo vazio) — nenhuma chamada à API
pnpm --filter @orange/tokens figma:sync --dry-run

# Sincroniza de verdade
FIGMA_TOKEN=figd_… FIGMA_FILE_KEY=AbCdEf123 pnpm --filter @orange/tokens figma:sync`}
        />
        <TableWrap label={{ pt: 'Variáveis de ambiente e opções', en: 'Environment variables and options' }}>
          <table className="doc-table">
            <thead>
              <tr>
                <th scope="col">{t({ pt: 'Nome', en: 'Name' })}</th>
                <th scope="col">{t({ pt: 'Descrição', en: 'Description' })}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">
                  <Code>FIGMA_TOKEN</Code>
                </th>
                <td>
                  {t({
                    pt: 'Token pessoal do Figma com os escopos file_variables:read e file_variables:write.',
                    en: 'Figma personal access token with the file_variables:read and file_variables:write scopes.',
                  })}
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <Code>FIGMA_FILE_KEY</Code>
                </th>
                <td>
                  {t({
                    pt: 'Chave do arquivo: o trecho depois de /design/ na URL.',
                    en: 'File key: the part after /design/ in the URL.',
                  })}
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <Code>--dry-run</Code>
                </th>
                <td>
                  {t({
                    pt: 'Imprime o payload no terminal e não chama a API (não precisa das variáveis de ambiente).',
                    en: 'Prints the payload and does not call the API (no environment variables needed).',
                  })}
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <Code>--allow-ci</Code>
                </th>
                <td>
                  {t({
                    pt: 'Permite rodar com CI definido. Sem ela, o script se recusa em CI.',
                    en: 'Allows running with CI set. Without it, the script refuses to run in CI.',
                  })}
                </td>
              </tr>
            </tbody>
          </table>
        </TableWrap>
        <Callout tone="warning" title={{ pt: 'Plano do Figma', en: 'Figma plan' }}>
          <p>
            <T
              pt={
                <>
                  A API REST de variáveis exige um plano do Figma com acesso de escrita à API (na
                  data desta versão, a Figma a libera para membros plenos de organizações
                  Enterprise) e um token com <Code>file_variables:write</Code>. A coleção de tema
                  usa quatro modos — confira o limite de modos do seu plano. Sem esse acesso, use a
                  importação do arquivo DTCG.
                </>
              }
              en={
                <>
                  The Variables REST API requires a Figma plan with API write access (at the time of
                  this release, Figma grants it to full members of Enterprise organizations) and a
                  token with <Code>file_variables:write</Code>. The theme collection uses four modes
                  — check your plan's mode limit. Without that access, import the DTCG file.
                </>
              }
            />
          </p>
        </Callout>
        <Bullets
          items={[
            {
              pt: 'Nunca roda em CI por padrão: não faz parte do build, e com CI definido ele para com uma mensagem (a menos que você passe --allow-ci). Sem FIGMA_TOKEN ou FIGMA_FILE_KEY, falha explicando o que falta.',
              en: 'Never runs in CI by default: it is not part of the build, and with CI set it stops with a message (unless you pass --allow-ci). Without FIGMA_TOKEN or FIGMA_FILE_KEY, it fails explaining what is missing.',
            },
            {
              pt: 'Primitivas de cor ficam fora dos seletores do Figma (servem de origem para os aliases); espaço, raio e fonte aparecem nos campos certos. Toda variável traz o codeSyntax WEB com a variável CSS, visível no Dev Mode.',
              en: 'Color primitives stay out of Figma pickers (they are alias sources); space, radius and font show up in the right fields. Every variable carries the WEB codeSyntax with the CSS variable, visible in Dev Mode.',
            },
            {
              pt: 'Se uma variável com o mesmo nome existir com outro tipo, o script para e diz qual renomear ou apagar.',
              en: 'If a variable with the same name exists with another type, the script stops and says which one to rename or delete.',
            },
          ]}
        />
        <TableWrap label={{ pt: 'Tipos do DTCG no Figma', en: 'DTCG types in Figma' }}>
          <table className="doc-table">
            <thead>
              <tr>
                <th scope="col">DTCG</th>
                <th scope="col">Figma</th>
                <th scope="col">{t({ pt: 'Conversão', en: 'Conversion' })}</th>
              </tr>
            </thead>
            <tbody>
              {typeMap.map(([dtcg, figma, note]) => (
                <tr key={dtcg}>
                  <th scope="row">
                    <Code>{dtcg}</Code>
                  </th>
                  <td>
                    <Code>{figma}</Code>
                  </td>
                  <td>{t(note)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
        <p className="guide-muted guide-note">
          <T
            pt={
              <>
                Os modos da coleção de tema são os valores de <Code>data-theme</Code> — veja{' '}
                <Link to={to('/usage/theme')}>Tema</Link>.
              </>
            }
            en={
              <>
                The theme collection's modes are the <Code>data-theme</Code> values — see{' '}
                <Link to={to('/usage/theme')}>Theme</Link>.
              </>
            }
          />
        </p>
      </Section>
    </DocPage>
  )
}
