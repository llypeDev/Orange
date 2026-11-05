import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { deprecate, devWarning } from './index'

// Os avisos são deduplicados no nível do módulo: cada teste usa ids/mensagens únicos.
let warn: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('deprecate', () => {
  it('avisa uma única vez por id, com prefixo e a mensagem', () => {
    deprecate('Foo: `size="xs"` está depreciado e sai na v1.0. Use `size="sm"`.', 'foo.size.xs')
    deprecate('Foo: `size="xs"` está depreciado e sai na v1.0. Use `size="sm"`.', 'foo.size.xs')

    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn).toHaveBeenCalledWith(
      '[Orange] Depreciado: Foo: `size="xs"` está depreciado e sai na v1.0. Use `size="sm"`.',
    )
  })

  it('deduplica pelo id, não pelo texto', () => {
    deprecate('Bar: a prop `onDismiss` foi renomeada para `onClose`.', 'bar.onDismiss')
    deprecate('Bar: a prop `onDismiss` (de novo) foi renomeada para `onClose`.', 'bar.onDismiss')
    deprecate('Bar: a prop `onDismiss` foi renomeada para `onClose`.', 'bar.onDismiss.outro-id')

    expect(warn).toHaveBeenCalledTimes(2)
  })

  it('usa a própria mensagem como id quando nenhum é informado', () => {
    deprecate('Baz: `tone="primary"` está depreciado.')
    deprecate('Baz: `tone="primary"` está depreciado.')
    deprecate('Baz: `tone="secondary"` está depreciado.')

    expect(warn).toHaveBeenCalledTimes(2)
  })

  it('fica em silêncio em produção (e avisa depois, fora dela)', () => {
    vi.stubEnv('NODE_ENV', 'production')
    deprecate('Qux: `legacy` está depreciado.', 'qux.legacy')
    expect(warn).not.toHaveBeenCalled()

    // O aviso suprimido em produção não conta como "já emitido".
    vi.stubEnv('NODE_ENV', 'development')
    deprecate('Qux: `legacy` está depreciado.', 'qux.legacy')
    expect(warn).toHaveBeenCalledTimes(1)
  })

  it('não compartilha a deduplicação com devWarning', () => {
    devWarning(true, 'Quux: mensagem compartilhada.')
    deprecate('Quux: mensagem compartilhada.')

    expect(warn).toHaveBeenCalledTimes(2)
    expect(warn).toHaveBeenNthCalledWith(1, '[Orange] Quux: mensagem compartilhada.')
    expect(warn).toHaveBeenNthCalledWith(2, '[Orange] Depreciado: Quux: mensagem compartilhada.')
  })
})

describe('devWarning', () => {
  it('avisa só quando a condição é verdadeira, uma vez por mensagem', () => {
    devWarning(false, 'Corge: nunca aparece.')
    devWarning(true, 'Corge: precisa de `label`.')
    devWarning(true, 'Corge: precisa de `label`.')

    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn).toHaveBeenCalledWith('[Orange] Corge: precisa de `label`.')
  })

  it('fica em silêncio em produção', () => {
    vi.stubEnv('NODE_ENV', 'production')
    devWarning(true, 'Grault: não aparece em produção.')

    expect(warn).not.toHaveBeenCalled()
  })
})
