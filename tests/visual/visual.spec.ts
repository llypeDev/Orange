import { existsSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { join, relative } from 'node:path'
import { expect, test, type Page } from '@playwright/test'
import { SNAPSHOT_DIR, STORYBOOK_STATIC } from './paths'

/** Temas comparados. O toolbar pode ter outros (ex.: alto contraste); eles ficam fora das baselines. */
const THEMES = ['dark', 'light'] as const
type Theme = (typeof THEMES)[number]

/**
 * Componentes inteiros fora da regressão visual por serem não determinísticos
 * (chave: `title` da story; valor: motivo). Prefira estabilizar a story a crescer esta lista.
 */
const SKIP_TITLES: Record<string, string> = {
  // Texto relativo ao relógio ("há 5 minutos") que se atualiza sozinho.
  'Componentes/RelativeTime': 'baseado em tempo',
  // Autoplay troca o slide visível por timer.
  'Componentes/Carousel': 'autoplay',
  // Toasts avançam/somem por timers (barra de progresso, auto-dismiss).
  'Componentes/Toast': 'timers',
  // Balão posicionado por medições do alvo e do scroll em tempo de execução.
  'Componentes/Tour': 'posicionamento',
}

/**
 * Por componente entra a story `--default` (ou a primeira). Estas entram além dela por
 * mostrarem muitas variações (tons, variantes, estados) em uma imagem só.
 */
const EXTRA_STORIES = [
  'fundamentos-tokens--tipografia',
  'componentes-alert--tones',
  'componentes-badge--tones',
  'componentes-banner--tones',
  'componentes-button--variants',
  'componentes-card--variants',
  'componentes-checkbox--states',
  'componentes-iconbutton--variants',
  'componentes-link--variants',
  'componentes-paper--tones',
  'componentes-progressbar--tones',
  'componentes-tabs--enclosed',
  'componentes-tag--tones',
  'componentes-textfield--states',
]

/**
 * "Hoje" fixo: Calendar, DatePicker & cia. destacam o dia atual e algumas stories partem de
 * `new Date()`. Fica em novembro de 2026, o mês fixado nas stories de data.
 */
const FIXED_NOW = new Date('2026-11-12T12:00:00-03:00')

const FONT_HOSTS = /^https:\/\/fonts\.(googleapis|gstatic)\.com\//

type Story = { type: string; id: string; title: string; name: string }

function loadStories() {
  const file = join(STORYBOOK_STATIC, 'index.json')
  if (!existsSync(file)) {
    throw new Error(`${file} não existe. Rode \`pnpm build:storybook\` antes da regressão visual.`)
  }
  const index = JSON.parse(readFileSync(file, 'utf8')) as { entries: Record<string, Story> }
  const all = Object.values(index.entries).filter((entry) => entry.type === 'story')

  const byTitle = new Map<string, Story[]>()
  for (const story of all) byTitle.set(story.title, [...(byTitle.get(story.title) ?? []), story])

  const selected: Story[] = []
  for (const [title, stories] of byTitle) {
    if (title in SKIP_TITLES) continue
    selected.push(stories.find((story) => story.id.endsWith('--default')) ?? stories[0])
  }
  for (const id of EXTRA_STORIES) {
    const story = all.find((entry) => entry.id === id)
    if (story && !(story.title in SKIP_TITLES) && !selected.includes(story)) selected.push(story)
  }
  const unknownExtras = EXTRA_STORIES.filter((id) => !all.some((entry) => entry.id === id))
  return { selected, unknownExtras }
}

const { selected, unknownExtras } = loadStories()

async function openStory(page: Page, id: string, theme: Theme) {
  await page.clock.setFixedTime(FIXED_NOW)
  // Fontes vêm do Google Fonts (preview-head.html). Se falharem (rede), o teste falha em vez de
  // gravar/comparar com a fonte de fallback; no CI a nova tentativa costuma resolver.
  const fontErrors: string[] = []
  page.on('requestfailed', (request) => {
    if (FONT_HOSTS.test(request.url()))
      fontErrors.push(`${request.url()} (${request.failure()?.errorText})`)
  })
  page.on('response', (response) => {
    if (FONT_HOSTS.test(response.url()) && !response.ok())
      fontErrors.push(`${response.url()} (${response.status()})`)
  })
  // `motion:reduced` é o toolbar "Movimento" do Storybook (zera durações via data-motion).
  const globals = `theme:${theme};motion:reduced;locale:pt-BR`
  await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=${globals}`)

  // Espera a story terminar de renderizar (inclui a play function, se houver).
  await page.waitForFunction(() => {
    if (document.body.classList.contains('sb-show-errordisplay')) {
      throw new Error(
        document.querySelector('#error-message')?.textContent || 'Erro ao renderizar a story',
      )
    }
    type Preview = { currentRender?: { phase?: string } }
    const phase = (window as unknown as { __STORYBOOK_PREVIEW__?: Preview }).__STORYBOOK_PREVIEW__
      ?.currentRender?.phase
    return phase === 'completed' || phase === 'afterEach' || phase === 'finished'
  })

  // Garante que o tema pedido foi aplicado (se o global mudar de nome, falha aqui e não no diff).
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme)

  // Fontes e imagens carregadas antes da captura.
  await page.evaluate(async () => {
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    await document.fonts.ready
    const pending = Array.from(document.images).filter((img) => !img.complete)
    await Promise.all(
      pending.map(
        (img) =>
          new Promise((resolve) => {
            img.addEventListener('load', resolve, { once: true })
            img.addEventListener('error', resolve, { once: true })
          }),
      ),
    )
  })
  expect(fontErrors, 'fontes do Google Fonts não carregaram').toEqual([])
}

for (const theme of THEMES) {
  test.describe(theme, () => {
    for (const story of selected) {
      test(`${story.title} › ${story.name}`, async ({ page }) => {
        await openStory(page, story.id, theme)
        await expect(page.locator('#storybook-root')).toHaveScreenshot([theme, `${story.id}.png`])
      })
    }
  })
}

test('EXTRA_STORIES só cita stories existentes', () => {
  expect(unknownExtras, 'ids renomeados/removidos em EXTRA_STORIES (visual.spec.ts)').toEqual([])
})

// Com --update-snapshots, apaga baselines de stories que saíram da seleção
// (renomeadas, removidas ou puladas).
test('remove baselines órfãs ao atualizar', () => {
  const mode = test.info().config.updateSnapshots
  test.skip(mode !== 'all' && mode !== 'changed', 'só roda com --update-snapshots')
  const expected = new Set(
    selected.flatMap((story) => THEMES.map((theme) => join(theme, `${story.id}.png`))),
  )
  if (!existsSync(SNAPSHOT_DIR)) return
  for (const entry of readdirSync(SNAPSHOT_DIR, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.png')) continue
    const file = join(entry.parentPath, entry.name)
    if (!expected.has(relative(SNAPSHOT_DIR, file))) rmSync(file)
  }
})
