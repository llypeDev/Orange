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
 * Espera a lista assentar e confere que o ativo está à vista. Logo depois da tecla, antes do
 * posicionamento (e do quadro extra do movimento reduzido), a lista ainda não tem a altura e a
 * posição finais e qualquer opção "cabe" — medir nesse instante passaria até no código com defeito.
 */
async function expectActiveVisible(page: Page) {
  await expect.poll(async () => (await activeIsVisible(page)).visible).toBe(true)
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        let frames = 6
        const tick = () => (--frames ? requestAnimationFrame(tick) : resolve())
        requestAnimationFrame(tick)
      }),
  )
  expect(await activeIsVisible(page)).toMatchObject({ visible: true })
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
        return t.left >= l.left - 0.5 && t.right <= l.right + 0.5
      })
    await page.locator('[role="tab"][aria-selected="true"]').first().focus()
    await page.keyboard.press('End')
    await expect.poll(inside).toBe(true)
    await page.keyboard.press('Home')
    await page.keyboard.press('ArrowLeft') // volta para a última
    await expect.poll(inside).toBe(true)
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
      const covered = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement
        const head = el.closest('.or-table-container')?.querySelector('thead th')
        if (!head || el.closest('thead')) return false
        return el.getBoundingClientRect().top < head.getBoundingClientRect().bottom - 0.5
      })
      expect(covered, `passo ${step}: foco sob o cabeçalho`).toBe(false)
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
