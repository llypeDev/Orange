import axe from 'axe-core'
import { expect } from 'vitest'

/**
 * Roda o axe-core no container renderizado e falha o teste caso existam
 * violações de acessibilidade. Regras que dependem de layout real
 * (contraste de cor) são desativadas no jsdom — o contraste é coberto pelos
 * testes de tokens em `@orange/tokens`.
 */
export async function expectNoA11yViolations(container: Element) {
  const results = await axe.run(container, {
    rules: {
      'color-contrast': { enabled: false },
      region: { enabled: false },
    },
  })
  const messages = results.violations.map(
    (v) =>
      `[${v.id}] ${v.help}\n` +
      v.nodes.map((n) => `  → ${n.target.join(' ')}: ${n.failureSummary ?? ''}`).join('\n'),
  )
  expect(messages, messages.join('\n\n')).toEqual([])
}
