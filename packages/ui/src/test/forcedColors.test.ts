/**
 * Guarda de alto contraste (Windows High Contrast / temas de contraste).
 *
 * Com `forced-colors: active` o navegador troca as cores do autor pelas do
 * sistema: fundos viram `Canvas`, `box-shadow` some e as bordas viram texto.
 * Tudo o que comunica estado (marcado, selecionado, atual, foco) só com fundo
 * ou sombra desaparece — por isso cada componente que faz isso precisa de um
 * bloco `@media (forced-colors: active)` com cores do sistema (Highlight,
 * HighlightText, CanvasText, GrayText…).
 *
 * Este teste lê o CSS de todos os componentes e falha quando um arquivo:
 *   1. usa `box-shadow` em foco ou `background`/`box-shadow` em estado de
 *      seleção sem nenhum bloco forced-colors (e não está na allowlist);
 *   2. usa cor de token/hex dentro de um bloco forced-colors (é ignorada);
 *   3. usa `forced-color-adjust: none` fora da lista revisada.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

// String (não `new URL`): no ambiente jsdom o URL global é o do jsdom.
const componentsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'components')

/**
 * Arquivos com os padrões acima que, revisados, NÃO precisam de bloco
 * forced-colors. Cada entrada diz por quê. Um componente novo não entra aqui
 * sem revisão — o caminho normal é escrever o bloco.
 */
const allowlist: Record<string, string> = {
  'DatePicker/DatePicker.css':
    'O `outline: none` é do diálogo, que só recebe foco programático; o foco visível fica nos dias e botões (Calendar.css tem o bloco).',
}

/**
 * Arquivos revisados que podem usar `forced-color-adjust: none`. Dois casos:
 *
 * - a cor do autor É o conteúdo (amostras de cor, séries de gráfico, status de
 *   avatar) ou o elemento é só um traço/ponto sem filhos;
 * - texto sobre Highlight/Mark: com `auto`, o Chromium pinta a "placa de
 *   leitura" (Canvas) atrás de cada texto e o rótulo some no fundo de seleção.
 *   Nesses blocos TODAS as cores do elemento (texto, ícones, borda, contorno de
 *   foco, sombra) são definidas explicitamente com cores do sistema.
 */
const TEXT_ON_HIGHLIGHT =
  'Texto sobre Highlight/Mark: sem none o Chromium pinta a placa de leitura (Canvas) atrás do texto; todas as cores do elemento são cores do sistema explícitas.'
const forcedColorAdjustNone: Record<string, string> = {
  'Avatar/Avatar.css': 'Ponto de status: a cor do status é mantida, com contorno CanvasText.',
  'BarChart/ChartFrame.css':
    'SVG do gráfico: séries mantêm a cor; texto, grade, base e foco usam cores do sistema.',
  'BottomNavigation/BottomNavigation.css': TEXT_ON_HIGHLIGHT,
  'Carousel/Carousel.css': 'Indicador e barra de progresso sem filhos, pintados em Highlight.',
  'Chip/Chip.css': TEXT_ON_HIGHLIGHT,
  'CodeBlock/CodeBlock.css': TEXT_ON_HIGHLIGHT,
  'ColorField/ColorField.css': 'Amostra e prévia: a cor escolhida é o próprio conteúdo.',
  'DatePicker/Calendar.css': TEXT_ON_HIGHLIGHT,
  'DateRangePicker/RangeCalendar.css': TEXT_ON_HIGHLIGHT,
  'Fieldset/Fieldset.css': 'Barra de erro (::before) pintada em CanvasText.',
  'Highlight/Highlight.css': TEXT_ON_HIGHLIGHT,
  'Paginator/Paginator.css': TEXT_ON_HIGHLIGHT,
  'SegmentedControl/SegmentedControl.css': TEXT_ON_HIGHLIGHT,
  'SideNav/SideNav.css': TEXT_ON_HIGHLIGHT,
  'Sparkline/Sparkline.css': 'SVG da série única, pintado com cores do sistema.',
  'Stepper/Stepper.css': TEXT_ON_HIGHLIGHT,
  'Tag/Tag.css': 'Marcador de tom ao lado do texto da etiqueta (decorativo).',
  'TimeField/TimeField.css': TEXT_ON_HIGHLIGHT,
  'ToggleButton/ToggleButton.css': TEXT_ON_HIGHLIGHT,
  'TreeView/TreeView.css': TEXT_ON_HIGHLIGHT,
}

interface CssRule {
  selector: string
  declarations: string[]
  atRules: string[]
}

/** Parser mínimo: regras com seletor, declarações e os @-blocos que as envolvem. */
function parseCss(source: string): CssRule[] {
  const css = source.replace(/\/\*[\s\S]*?\*\//g, '')
  const rules: CssRule[] = []
  const stack: { prelude: string; declarations: string[] }[] = []
  let buffer = ''
  const split = (text: string) =>
    text
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
  for (const char of css) {
    if (char === '{') {
      const parts = buffer.split(';')
      const prelude = (parts.pop() ?? '').trim()
      stack.at(-1)?.declarations.push(...split(parts.join(';')))
      stack.push({ prelude, declarations: [] })
      buffer = ''
    } else if (char === '}') {
      const frame = stack.pop()
      if (!frame) continue
      frame.declarations.push(...split(buffer))
      buffer = ''
      if (!frame.prelude.startsWith('@')) {
        rules.push({
          selector: frame.prelude.replace(/\s+/g, ' '),
          declarations: frame.declarations,
          atRules: stack.filter((f) => f.prelude.startsWith('@')).map((f) => f.prelude),
        })
      }
    } else {
      buffer += char
    }
  }
  return rules
}

const isForced = (rule: CssRule) => rule.atRules.some((at) => /forced-colors\s*:\s*active/.test(at))
const isKeyframe = (rule: CssRule) => rule.atRules.some((at) => at.startsWith('@keyframes'))

const FOCUS = /:focus(-visible|-within)?\b/
const STATE =
  /:checked|:indeterminate|\[aria-(selected|checked|pressed)=['"]?true|\[aria-current|\[data-(checked|selected|active)\]|\[data-state=['"]?(checked|on|active)|--(selected|current)\b/

const prop = (declaration: string) => declaration.split(':')[0].trim().toLowerCase()
const value = (declaration: string) => declaration.slice(declaration.indexOf(':') + 1).trim()
const paints = (declaration: string) =>
  /^(background|background-color|box-shadow)$/.test(prop(declaration)) &&
  !/^(none|transparent|inherit|initial|unset)$/.test(value(declaration))

/** Motivos pelos quais um arquivo precisa de fallback em alto contraste. */
function risks(rules: CssRule[]): string[] {
  const found: string[] = []
  for (const rule of rules) {
    if (isForced(rule) || isKeyframe(rule)) continue
    const focus = FOCUS.test(rule.selector)
    const state = STATE.test(rule.selector)
    for (const declaration of rule.declarations) {
      const name = prop(declaration)
      if (focus && name === 'box-shadow' && paints(declaration)) {
        found.push(`foco com box-shadow: ${rule.selector}`)
      } else if (state && paints(declaration)) {
        found.push(`estado com ${name}: ${rule.selector}`)
      } else if (
        focus &&
        /^outline(-style)?$/.test(name) &&
        /^(none|0)\b/.test(value(declaration))
      ) {
        found.push(`outline removido no foco: ${rule.selector}`)
      }
    }
  }
  return found
}

const COLOR_PROPS =
  /^(color|background|background-color|border(-(top|right|bottom|left|block|inline)(-(start|end))?)?(-color)?|outline(-color)?|fill|stroke|text-decoration-color|caret-color|accent-color)$/
const NON_SYSTEM = /var\(--or-color-|#[0-9a-f]{3,8}\b|\b(rgb|rgba|hsl|hsla|oklch|color-mix)\(/i

const files = readdirSync(componentsDir)
  .filter((name) => statSync(join(componentsDir, name)).isDirectory())
  .flatMap((dir) =>
    readdirSync(join(componentsDir, dir))
      .filter((file) => file.endsWith('.css'))
      .map((file) => join(componentsDir, dir, file)),
  )
  .map((path) => {
    const raw = readFileSync(path, 'utf8')
    // Sem comentários: eles citam `forced-color-adjust: none` para explicar por que não o usam.
    const source = raw.replace(/\/\*[\s\S]*?\*\//g, '')
    return {
      name: relative(componentsDir, path).split('\\').join('/'),
      source,
      rules: parseCss(source),
      hasForcedBlock: /@media[^{]*forced-colors\s*:\s*active/.test(source),
    }
  })

describe('forced-colors (alto contraste)', () => {
  it('encontra o CSS dos componentes', () => {
    expect(files.length).toBeGreaterThan(90)
  })

  it('todo estado/foco desenhado com fundo ou sombra tem fallback forced-colors', () => {
    const missing = files
      .filter((file) => !file.hasForcedBlock && !(file.name in allowlist))
      .map((file) => ({ file: file.name, risks: risks(file.rules) }))
      .filter((entry) => entry.risks.length > 0)
    expect(
      missing,
      'Adicione um bloco @media (forced-colors: active) com cores do sistema ' +
        '(Highlight, CanvasText, GrayText…) — ou, se revisado, uma entrada na allowlist.',
    ).toEqual([])
  })

  it('a allowlist só tem arquivos que existem, sem bloco e ainda com riscos', () => {
    const stale = Object.keys(allowlist).filter((name) => {
      const file = files.find((f) => f.name === name)
      return !file || file.hasForcedBlock || risks(file.rules).length === 0
    })
    expect(stale, 'Remova da allowlist as entradas que não se aplicam mais.').toEqual([])
  })

  it('blocos forced-colors usam só cores do sistema', () => {
    const offenders = files.flatMap((file) =>
      file.rules
        .filter(isForced)
        .flatMap((rule) =>
          rule.declarations
            .filter((d) => COLOR_PROPS.test(prop(d)) && NON_SYSTEM.test(value(d)))
            .map((d) => `${file.name} → ${rule.selector} { ${d} }`),
        ),
    )
    expect(offenders, 'Cores de token ou literais são ignoradas em alto contraste.').toEqual([])
  })

  it('forced-color-adjust: none só nos arquivos revisados', () => {
    const unreviewed = files
      .filter((file) => /forced-color-adjust\s*:\s*none/.test(file.source))
      .map((file) => file.name)
      .filter((name) => !(name in forcedColorAdjustNone))
    expect(
      unreviewed,
      'forced-color-adjust: none mantém as cores do autor (e o laranja do foco) em alto contraste: ' +
        'prefira cores do sistema; se a cor for o conteúdo, revise e registre o arquivo.',
    ).toEqual([])
    const stale = Object.keys(forcedColorAdjustNone).filter(
      (name) =>
        !files.find((f) => f.name === name && /forced-color-adjust\s*:\s*none/.test(f.source)),
    )
    expect(stale).toEqual([])
  })
})
