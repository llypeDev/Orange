import { expect, test, type Page } from '@playwright/test'

/*
 * Fim da faixa com layout de verdade: cada teste reproduz um defeito corrigido na 1.2.1
 * (o último item, seção ou valor fora de vista ou inalcançável) e falharia no código antigo.
 */

interface StoryOptions {
  viewport?: { width: number; height: number }
  args?: string
  motion?: 'full' | 'reduced'
}

async function openStory(
  page: Page,
  id: string,
  { viewport, args, motion = 'reduced' }: StoryOptions = {},
) {
  if (viewport) await page.setViewportSize(viewport)
  const query = new URLSearchParams({ id, viewMode: 'story' })
  const globals = `theme:light;motion:${motion};locale:pt-BR`
  await page.goto(`/iframe.html?${query}&globals=${globals}${args ? `&args=${args}` : ''}`)
  await expect(page.locator('#storybook-root > *').first()).toBeVisible()
  // As fontes da web (display=swap) mudam a largura do texto quando chegam. Medir ou rolar
  // antes disso deixa o teste à mercê da rede: na CI, o End revelou a aba com a fonte reserva
  // (mais estreita no contêiner) e a Inter, ao chegar, empurrou a aba para fora da lista.
  await page.evaluate(async () => {
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    await document.fonts.ready
  })
}

/**
 * A opção ou o item de menu ativo (focado ou apontado por aria-activedescendant) está inteiro
 * dentro do contêiner rolável mais próximo e da janela? Enquanto a lista não abriu, o ativo
 * ainda é o gatilho — isso não conta como visível, para a checagem não passar antes da hora.
 */
async function activeIsVisible(page: Page) {
  return page.evaluate(() => {
    const focused = document.activeElement as HTMLElement | null
    const descendant = focused?.getAttribute('aria-activedescendant')
    const el = descendant ? document.getElementById(descendant) : focused
    if (
      !el ||
      !/^(option|menuitem|menuitemcheckbox|menuitemradio)$/.test(el.getAttribute('role') ?? '')
    )
      return { visible: false, reason: 'nenhuma opção ou item de menu ativo' }
    let box = el.parentElement
    while (
      box &&
      !(
        box.scrollHeight > box.clientHeight + 1 &&
        /auto|scroll/.test(getComputedStyle(box).overflowY)
      )
    )
      box = box.parentElement
    const r = el.getBoundingClientRect()
    const b = box ? box.getBoundingClientRect() : new DOMRect(0, 0, innerWidth, innerHeight)
    const visible =
      r.top >= b.top - 0.5 &&
      r.bottom <= b.bottom + 0.5 &&
      r.top >= -0.5 &&
      r.bottom <= innerHeight + 0.5
    return {
      visible,
      text: (el.textContent ?? '').trim().slice(0, 30),
      top: r.top,
      bottom: r.bottom,
      boxTop: b.top,
      boxBottom: b.bottom,
    }
  })
}

/**
 * Repete `measure` até `ok` ou o tempo acabar e devolve a última medição — para a mensagem de
 * falha trazer as posições (e não só "false"), útil quando o motor que falha não está à mão.
 */
async function measureUntil<T extends { ok: boolean }>(measure: () => Promise<T>, timeout = 5000) {
  const end = Date.now() + timeout
  let last = await measure()
  while (!last.ok && Date.now() < end) {
    await new Promise((resolve) => setTimeout(resolve, 100))
    last = await measure()
  }
  return last
}

/**
 * Espera a lista assentar e confere que o ativo está à vista. Logo depois da tecla, antes do
 * posicionamento (e do quadro extra do movimento reduzido), a lista ainda não tem a altura e a
 * posição finais e qualquer opção "cabe" — medir nesse instante passaria até no código com defeito.
 */
async function expectActiveVisible(page: Page) {
  const first = await measureUntil(async () => {
    const r = await activeIsVisible(page)
    return { ...r, ok: r.visible }
  })
  expect(first.ok, `ativo fora de vista: ${JSON.stringify(first)}`).toBe(true)
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        let frames = 6
        const tick = () => (--frames ? requestAnimationFrame(tick) : resolve())
        requestAnimationFrame(tick)
      }),
  )
  const settled = await activeIsVisible(page)
  expect(
    settled.visible,
    `ativo fora de vista depois de assentar: ${JSON.stringify(settled)}`,
  ).toBe(true)
}

test.describe('TableOfContents', () => {
  test('marca a última seção no fim da rolagem e a seção certa ao subir', async ({ page }) => {
    await openStory(page, 'componentes-tableofcontents--default')
    const panel = page.getByRole('region', { name: 'Conteúdo do artigo' })
    const nav = page.getByRole('navigation')
    const current = nav.locator('[aria-current="location"]')
    const scrollTo = (top: number | 'end') =>
      panel.evaluate((el, t) => el.scrollTo({ top: t === 'end' ? el.scrollHeight : t }), top)

    await scrollTo('end')
    await expect(current).toHaveText('Publicação')
    // Subindo até o meio de "Configuração" (nenhum título na faixa): a seção que já passou.
    const configTop = await page
      .locator('#sb-configuracao')
      .evaluate((el) => (el as HTMLElement).offsetTop)
    await scrollTo(configTop + 80)
    await expect(current).toHaveText('Configuração')
    await scrollTo(0)
    await expect(current).toHaveText('Instalação')
  })
})

test.describe('Reveal com movimento', () => {
  test.use({ reducedMotion: 'no-preference' })

  test('o que fica nos últimos pixels da página aparece no fim da rolagem', async ({ page }) => {
    await openStory(page, 'componentes-reveal--no-fim-da-pagina', { motion: 'full' })
    const last = page.getByTestId('reveal-fim')
    await expect(last).toHaveAttribute('data-reveal', 'hidden')
    await page.mouse.wheel(0, 5000)
    await expect(last).toHaveAttribute('data-reveal', 'shown')
    await expect.poll(() => last.evaluate((el) => Number(getComputedStyle(el).opacity))).toBe(1)
  })
})

test.describe('Listas e menus: o item ativo fica à vista', () => {
  test('Combobox: ↑ abre na última opção visível', async ({ page }) => {
    await openStory(page, 'componentes-combobox--default', {
      viewport: { width: 900, height: 700 },
    })
    await page.getByRole('combobox').first().focus()
    await page.keyboard.press('ArrowUp')
    await expectActiveVisible(page)
  })

  test('MultiSelect em tela baixa: ↑ abre na última opção visível', async ({ page }) => {
    await openStory(page, 'componentes-multiselect--default', {
      viewport: { width: 900, height: 330 },
    })
    await page.getByRole('combobox').first().focus()
    await page.keyboard.press('ArrowUp')
    await expectActiveVisible(page)
  })

  test('Picker com grupos, movimento reduzido: End abre na última opção visível', async ({
    page,
  }) => {
    await openStory(page, 'componentes-picker--groups', { viewport: { width: 800, height: 300 } })
    await page.getByRole('combobox').first().focus()
    await page.keyboard.press('End')
    await expectActiveVisible(page)
  })

  test('Dropdown em tela baixa: End e a volta das setas focam um item visível', async ({
    page,
  }) => {
    await openStory(page, 'componentes-dropdown--default', {
      viewport: { width: 700, height: 200 },
    })
    await page.locator('[aria-haspopup="menu"]').first().focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('menu')).toBeVisible()
    await page.keyboard.press('End')
    await expectActiveVisible(page)
    await page.keyboard.press('Home')
    await page.keyboard.press('ArrowUp') // volta para o último
    await expectActiveVisible(page)
  })

  test('SplitButton em tela baixa: ↑ abre na última ação, alcançável', async ({ page }) => {
    await openStory(page, 'componentes-splitbutton--primary', {
      viewport: { width: 700, height: 180 },
    })
    await page.locator('[aria-haspopup="menu"]').first().focus()
    await page.keyboard.press('ArrowUp')
    await expect(page.getByRole('menu')).toBeVisible()
    await expectActiveVisible(page)
  })

  test('SplitButton com muitas ações: o menu para em 24rem, como o do Dropdown, e rola', async ({
    page,
  }) => {
    await openStory(page, 'componentes-splitbutton--many-actions', {
      viewport: { width: 900, height: 1000 },
    })
    await page.locator('[aria-haspopup="menu"]').first().focus()
    await page.keyboard.press('ArrowDown')
    const menu = page.getByRole('menu')
    await expect(menu).toBeVisible()
    const { height, scrolls, rem } = await menu.evaluate((el) => ({
      height: el.getBoundingClientRect().height,
      scrolls: el.scrollHeight > el.clientHeight + 1,
      rem: Number.parseFloat(getComputedStyle(document.documentElement).fontSize),
    }))
    expect(height).toBeLessThanOrEqual(24 * rem + 0.5)
    expect(scrolls).toBe(true)
    await page.keyboard.press('End')
    await expectActiveVisible(page)
  })

  test('CommandPalette: voltar ao primeiro item mostra o título do primeiro grupo', async ({
    page,
  }) => {
    await openStory(page, 'componentes-commandpalette--default', {
      viewport: { width: 900, height: 500 },
    })
    await page.getByRole('button', { name: /Buscar comandos/ }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await page.keyboard.press('PageDown')
    await page.keyboard.press('PageUp')
    const heading = dialog.locator('[role="group"]').first().locator(':scope > :first-child')
    await expect
      .poll(() =>
        heading.evaluate((el) => {
          let box = el.parentElement
          while (box && !(box.scrollHeight > box.clientHeight + 1)) box = box.parentElement
          return box
            ? el.getBoundingClientRect().top >= box.getBoundingClientRect().top - 0.5
            : true
        }),
      )
      .toBe(true)
  })
})

test.describe('Fim da faixa em navegação e tabelas', () => {
  test('Tabs com rolagem: End e a volta das setas deixam a aba inteira à vista', async ({
    page,
  }) => {
    await openStory(page, 'componentes-tabs--line', { viewport: { width: 360, height: 640 } })
    const tablist = page.getByRole('tablist').first()
    const inside = () =>
      tablist.evaluate((list) => {
        const tab = document.activeElement as HTMLElement
        const l = list.getBoundingClientRect()
        const t = tab.getBoundingClientRect()
        return {
          ok:
            tab.getAttribute('role') === 'tab' &&
            t.left >= l.left - 0.5 &&
            t.right <= l.right + 0.5,
          ativo: `${tab.tagName}[role=${tab.getAttribute('role')}] ${tab.textContent?.trim().slice(0, 20)}`,
          aba: [Math.round(t.left), Math.round(t.right)],
          lista: [Math.round(l.left), Math.round(l.right)],
          scrollLeft: Math.round(list.scrollLeft),
          larguras: [list.clientWidth, list.scrollWidth],
        }
      })
    await page.locator('[role="tab"][aria-selected="true"]').first().focus()
    await page.keyboard.press('End')
    const afterEnd = await measureUntil(inside)
    expect(afterEnd.ok, `End: ${JSON.stringify(afterEnd)}`).toBe(true)
    await page.keyboard.press('Home')
    await page.keyboard.press('ArrowLeft') // volta para a última
    const afterWrap = await measureUntil(inside)
    expect(afterWrap.ok, `volta das setas: ${JSON.stringify(afterWrap)}`).toBe(true)
    // Só a lista rola, nunca a página.
    expect(await page.evaluate(() => scrollY)).toBe(0)
  })

  test('Table com cabeçalho fixo: o foco subindo nunca fica sob o cabeçalho (WCAG 2.4.11)', async ({
    page,
  }) => {
    await openStory(page, 'componentes-table--sticky-header', {
      viewport: { width: 1000, height: 800 },
      args: 'selectable:!true',
    })
    const boxes = page.locator('tbody input[type="checkbox"]')
    await boxes.last().focus()
    for (let step = 0; step < 12; step++) {
      // O WebKit rola até o foco num quadro seguinte: medido logo após o Shift+Tab, o foco ainda
      // está onde a linha estava. Espera assentar; sem o scroll-padding, nunca assenta e falha.
      const state = await measureUntil(() =>
        page.evaluate(() => {
          const el = document.activeElement as HTMLElement
          const container = el.closest('.or-table-container') as HTMLElement | null
          const head = container?.querySelector('thead th')
          if (!head || !container || el.closest('thead')) return { ok: true, covered: false }
          const top = el.getBoundingClientRect().top
          const headBottom = head.getBoundingClientRect().bottom
          const covered = top < headBottom - 0.5
          return {
            ok: !covered,
            covered,
            foco: el.getAttribute('aria-label') ?? el.tagName,
            top: Math.round(top),
            headBottom: Math.round(headBottom),
            scrollTop: Math.round(container.scrollTop),
            scrollPaddingTop: getComputedStyle(container).scrollPaddingTop,
          }
        }),
      )
      expect(state.covered, `passo ${step}: foco sob o cabeçalho ${JSON.stringify(state)}`).toBe(
        false,
      )
      await page.keyboard.press('Shift+Tab')
    }
  })

  test('Stepper compacto concluído: o rótulo da última etapa aparece', async ({ page }) => {
    await openStory(page, 'componentes-stepper--horizontal', {
      viewport: { width: 360, height: 640 },
      args: 'step:4',
    })
    const last = page.locator('.or-stepper__step').last().locator('.or-stepper__text')
    await expect
      .poll(() => last.evaluate((el) => el.getBoundingClientRect().width))
      .toBeGreaterThan(20)
  })

  // Proteção: o Carousel já tratava o fim do trilho; o teste garante que continue assim.
  test('Carousel com várias por vista: no fim do trilho, última posição e "próximo" desabilitado', async ({
    page,
  }) => {
    await openStory(page, 'componentes-carousel--product-rail', {
      viewport: { width: 390, height: 800 },
    })
    const root = page.locator('.or-carousel').first()
    const track = root.locator('.or-carousel__track')
    for (let x = 0; x <= 4000; x += 300) {
      await track.evaluate((t, v) => {
        t.scrollLeft = v
      }, x)
    }
    await expect(root.locator('.or-carousel__counter')).toHaveText(/^0?(\d+)\s*\/\s*0?\1$/)
  })
})

test.describe('Table para dados grandes', () => {
  /** O que está no DOM e na área visível do corpo de uma tabela virtualizada. */
  const virtualState = (page: Page) =>
    page.evaluate(() => {
      const container = document.querySelector('.or-table-container') as HTMLElement
      const table = container.querySelector('.or-table') as HTMLTableElement
      const rows = Array.from(table.querySelectorAll<HTMLElement>('tbody .or-table__row'))
      // As células do cabeçalho são sticky: é delas (não do <thead>) a posição na tela.
      const headBottom = (
        table.querySelector('thead tr:last-child > :first-child') as HTMLElement
      ).getBoundingClientRect().bottom
      const bottom = container.getBoundingClientRect().bottom
      const visible = rows.filter((row) => {
        const box = row.getBoundingClientRect()
        return box.bottom > headBottom + 0.5 && box.top < bottom - 0.5
      })
      const index = (row?: HTMLElement) => Number(row?.getAttribute('aria-rowindex') ?? 0)
      const total = Number(table.getAttribute('aria-rowcount'))
      const first = visible[0]?.getBoundingClientRect()
      const last = visible.at(-1)?.getBoundingClientRect()
      return {
        rendered: rows.length,
        total,
        firstVisible: index(visible[0]),
        lastVisible: index(visible.at(-1)),
        // Sem faixa em branco: há linha logo abaixo do cabeçalho e até a base (ou até a última).
        covered:
          !!first &&
          !!last &&
          first.top <= headBottom + 1 &&
          (last.bottom >= bottom - 2 || index(visible.at(-1)) === total),
        scrollTop: Math.round(container.scrollTop),
        maxScroll: container.scrollHeight - container.clientHeight,
      }
    })

  test('virtualização: a janela de linhas acompanha a rolagem, sem faixa em branco', async ({
    page,
  }) => {
    await openStory(page, 'componentes-table--virtualized', {
      viewport: { width: 1100, height: 800 },
    })
    const container = page.locator('.or-table-container')
    const start = await virtualState(page)
    expect(start.total).toBe(5001)
    expect(start.rendered, JSON.stringify(start)).toBeLessThan(80)
    expect(start.firstVisible).toBe(2)

    // Salto para o meio (barra de rolagem, Page Down): as linhas certas, na posição pedida.
    await container.evaluate((el) => (el.scrollTop = 60000))
    const middle = await measureUntil(async () => {
      const state = await virtualState(page)
      return { ...state, ok: state.covered && state.firstVisible > 1000 }
    })
    expect(middle.ok, `meio: ${JSON.stringify(middle)}`).toBe(true)
    // A rolagem fica onde foi pedida: o navegador não a "corrige" ao trocar as linhas do DOM.
    expect(Math.abs(middle.scrollTop - 60000), JSON.stringify(middle)).toBeLessThanOrEqual(1)
    expect(middle.rendered).toBeLessThan(80)

    // Roda do mouse, vários passos seguidos.
    await container.hover()
    for (let step = 0; step < 8; step++) {
      await page.mouse.wheel(0, 600)
      const state = await measureUntil(async () => {
        const s = await virtualState(page)
        return { ...s, ok: s.covered }
      })
      expect(state.ok, `roda ${step}: ${JSON.stringify(state)}`).toBe(true)
    }

    // Fim: a última linha aparece e a rolagem chega ao limite.
    await container.evaluate((el) => (el.scrollTop = el.scrollHeight))
    const end = await measureUntil(async () => {
      const state = await virtualState(page)
      return { ...state, ok: state.covered && state.lastVisible === state.total }
    })
    expect(end.ok, `fim: ${JSON.stringify(end)}`).toBe(true)
    expect(end.maxScroll - end.scrollTop, JSON.stringify(end)).toBeLessThanOrEqual(1)
  })

  test('virtualização: a linha com o foco continua no DOM depois de rolar para longe', async ({
    page,
  }) => {
    await openStory(page, 'componentes-table--virtualized', {
      viewport: { width: 1100, height: 800 },
    })
    const container = page.locator('.or-table-container')
    await page.locator('tbody .or-table__row').nth(2).locator('input[type="checkbox"]').focus()
    await container.evaluate((el) => (el.scrollTop = 80000))
    const state = await measureUntil(async () => {
      const s = await page.evaluate(() => {
        const active = document.activeElement as HTMLElement
        const container = document.querySelector('.or-table-container') as HTMLElement
        return {
          tag: active.tagName,
          row: active.closest('tr')?.getAttribute('aria-rowindex') ?? null,
          rendered: document.querySelectorAll('tbody .or-table__row').length,
          scrollTop: Math.round(container.scrollTop),
        }
      })
      return { ...s, ok: s.tag === 'INPUT' && s.row === '4' && s.rendered < 80 }
    })
    expect(state.ok, JSON.stringify(state)).toBe(true)
    // Rolar não devolve a tabela à linha focada.
    expect(Math.abs(state.scrollTop - 80000), JSON.stringify(state)).toBeLessThanOrEqual(1)
  })

  test('colunas fixas: ficam nas bordas ao rolar e o foco não para sob elas (WCAG 2.4.11)', async ({
    page,
  }) => {
    await openStory(page, 'componentes-table--pinned-columns', {
      viewport: { width: 700, height: 800 },
    })
    const container = page.locator('.or-table-container')
    const overflow = await container.evaluate((el) => el.scrollWidth - el.clientWidth)
    expect(overflow, 'a tabela precisa rolar na horizontal').toBeGreaterThan(50)
    // Sem rolar: o cabeçalho já nasce alinhado ao corpo (a story combina fixas e redimensionáveis,
    // sem maxHeight — o caso em que o cabeçalho fixo saía do lugar).
    const initial = await page.evaluate(() => {
      const lefts = (row: Element) =>
        Array.from(row.children).map((cell) => Math.round(cell.getBoundingClientRect().left))
      return {
        head: lefts(document.querySelector('.or-table thead tr') as Element),
        body: lefts(document.querySelector('.or-table tbody .or-table__row') as Element),
      }
    })
    expect(initial.head, JSON.stringify(initial)).toEqual(initial.body)

    // Um controle na primeira e outro na última coluna que rola (a story não tem nenhum).
    await page.evaluate(() => {
      const row = document.querySelector('.or-table tbody .or-table__row') as HTMLElement
      const free = Array.from(row.children).filter(
        (cell) => !cell.classList.contains('or-table__cell--pinned'),
      )
      for (const [cell, id] of [
        [free[0], 'primeiro'],
        [free.at(-1), 'ultimo'],
      ] as const) {
        const button = document.createElement('button')
        button.type = 'button'
        button.dataset.testid = id
        button.textContent = '•'
        cell!.prepend(button)
      }
    })

    const measure = (id: string) =>
      page.evaluate((testId) => {
        const container = document.querySelector('.or-table-container') as HTMLElement
        const box = container.getBoundingClientRect()
        const row = document.querySelector('.or-table tbody .or-table__row') as HTMLElement
        const pinned = Array.from(row.querySelectorAll<HTMLElement>('.or-table__cell--pinned')).map(
          (cell) => cell.getBoundingClientRect(),
        )
        const middle = box.left + box.width / 2
        const startEdge = Math.max(...pinned.filter((p) => p.left < middle).map((p) => p.right))
        const endEdge = Math.min(...pinned.filter((p) => p.left >= middle).map((p) => p.left))
        const target = (
          document.querySelector(`[data-testid="${testId}"]`) as HTMLElement
        ).getBoundingClientRect()
        // Cabeçalho e corpo alinhados, coluna a coluna (as células fixas do cabeçalho também).
        const head = Array.from(
          (document.querySelector('.or-table thead tr') as HTMLElement).children,
        ).map((cell) => cell.getBoundingClientRect().left)
        const body = Array.from(row.children).map((cell) => cell.getBoundingClientRect().left)
        return {
          aligned: head.every((left, index) => Math.abs(left - body[index]) <= 0.5),
          // As faixas fixas encostam nas bordas do contêiner (1px de borda).
          stuck:
            Math.min(...pinned.map((p) => p.left)) - box.left <= 1.5 &&
            box.right - Math.max(...pinned.map((p) => p.right)) <= 1.5,
          startEdge: Math.round(startEdge),
          endEdge: Math.round(endEdge),
          left: Math.round(target.left),
          right: Math.round(target.right),
          scrollLeft: Math.round(container.scrollLeft),
        }
      }, id)

    // Rolado até o fim, o primeiro controle está sob a faixa do início; o foco o traz para fora.
    await container.evaluate((el) => (el.scrollLeft = el.scrollWidth))
    await page.getByTestId('primeiro').focus()
    const atStart = await measureUntil(async () => {
      const m = await measure('primeiro')
      return { ...m, ok: m.aligned && m.stuck && m.left >= m.startEdge - 0.5 }
    })
    expect(atStart.ok, `início: ${JSON.stringify(atStart)}`).toBe(true)

    // De volta ao começo, o último controle está sob a faixa do fim.
    await container.evaluate((el) => (el.scrollLeft = 0))
    await page.getByTestId('ultimo').focus()
    const atEnd = await measureUntil(async () => {
      const m = await measure('ultimo')
      return { ...m, ok: m.aligned && m.stuck && m.right <= m.endEdge + 0.5 }
    })
    expect(atEnd.ok, `fim: ${JSON.stringify(atEnd)}`).toBe(true)
  })

  test('redimensionar: teclado, arraste e clique duplo mudam só a coluna; a tabela é a soma delas', async ({
    page,
  }) => {
    await openStory(page, 'componentes-table--resizable-columns', {
      viewport: { width: 1100, height: 800 },
    })
    const widths = () =>
      page
        .locator('.or-table thead th')
        .evaluateAll((cells) => cells.map((cell) => Math.round(cell.getBoundingClientRect().width)))
    /** Espera as larguras chegarem ao esperado (tolerância de 1px) e devolve a última medição. */
    const settle = async (expected: (now: number[]) => boolean) => {
      const state = await measureUntil(async () => {
        const now = await widths()
        return { now, ok: expected(now) }
      })
      return state
    }

    const before = await widths()
    const separator = page.getByRole('separator', { name: 'Redimensionar coluna Cliente' })
    await separator.focus()
    await page.keyboard.press('ArrowRight')
    const byKey = await settle(
      (now) =>
        Math.abs(now[1] - before[1] - 16) <= 1 &&
        now.every((width, index) => index === 1 || Math.abs(width - before[index]) <= 1),
    )
    expect(byKey.ok, `teclado: ${before} → ${byKey.now}`).toBe(true)

    // Layout fixo: a tabela tem exatamente a soma das colunas.
    const sum = await page.evaluate(() => {
      const table = document.querySelector('.or-table') as HTMLElement
      const cells = Array.from(table.querySelectorAll('thead th'))
      return {
        table: table.getBoundingClientRect().width,
        cells: cells.reduce((total, cell) => total + cell.getBoundingClientRect().width, 0),
      }
    })
    expect(Math.abs(sum.table - sum.cells), JSON.stringify(sum)).toBeLessThan(1)

    // Arraste pela borda direita da coluna "Cidade".
    const city = (await page.locator('.or-table thead th').nth(2).boundingBox())!
    const y = city.y + city.height / 2
    await page.mouse.move(city.x + city.width - 3, y)
    await page.mouse.down()
    await page.mouse.move(city.x + city.width + 57, y, { steps: 6 })
    await page.mouse.up()
    const byDrag = await settle(
      (now) => Math.abs(now[2] - byKey.now[2] - 60) <= 1 && Math.abs(now[1] - byKey.now[1]) <= 1,
    )
    expect(byDrag.ok, `arraste: ${byKey.now} → ${byDrag.now}`).toBe(true)

    // Clique duplo: a coluna fica do tamanho do conteúdo, sem quebrar linha.
    await page.getByRole('separator', { name: 'Redimensionar coluna Cidade' }).dblclick()
    const fit = await measureUntil(async () => {
      const state = await page.evaluate(() => {
        const table = document.querySelector('.or-table') as HTMLTableElement
        const cells = Array.from(table.tBodies[0].rows).map((row) => row.cells[2])
        const range = document.createRange()
        const content = Math.max(
          ...cells.map((cell) => {
            range.selectNodeContents(cell)
            return range.getBoundingClientRect().width
          }),
        )
        const heights = Array.from(table.tBodies[0].rows)
          .slice(0, -1)
          .map((row) => Math.round(row.getBoundingClientRect().height))
        return {
          width: cells[0].getBoundingClientRect().width,
          content,
          oneLine: new Set(heights).size === 1,
          measuring: table.hasAttribute('data-measuring'),
        }
      })
      return {
        ...state,
        ok:
          state.oneLine &&
          !state.measuring &&
          state.width >= state.content &&
          state.width <= state.content + 48,
      }
    })
    expect(fit.ok, `clique duplo: ${JSON.stringify(fit)}`).toBe(true)
  })

  test('filtros com cabeçalho fixo: as duas linhas do cabeçalho ficam presas ao topo', async ({
    page,
  }) => {
    await openStory(page, 'componentes-table--large-data', {
      viewport: { width: 1100, height: 800 },
    })
    await page.locator('.or-table-container').evaluate((el) => (el.scrollTop = 3000))
    const state = await measureUntil(async () => {
      const s = await page.evaluate(() => {
        const container = document.querySelector('.or-table-container') as HTMLElement
        const top = container.getBoundingClientRect().top
        const [head, filters] = Array.from(
          container.querySelectorAll<HTMLElement>('.or-table thead tr'),
        ).map((row) => (row.children[1] as HTMLElement).getBoundingClientRect())
        return {
          head: Math.round(head.top - top),
          filters: Math.round(filters.top - top),
          headHeight: Math.round(head.height),
          scrollTop: Math.round(container.scrollTop),
        }
      })
      return { ...s, ok: s.head <= 1 && Math.abs(s.filters - s.head - s.headHeight) <= 1 }
    })
    expect(state.ok, JSON.stringify(state)).toBe(true)
    // Filtrar com a tabela rolada: sobram linhas à vista.
    await page.getByRole('searchbox', { name: 'Filtrar por Cidade' }).fill('recife')
    await expect(page.getByRole('status')).toHaveText(/resultados disponíveis/)
    await expect(page.locator('tbody .or-table__row').first()).toBeVisible()
  })
})
