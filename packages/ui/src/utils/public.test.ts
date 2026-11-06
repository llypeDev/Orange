import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import * as ui from '../index'

describe('utilitários públicos', () => {
  it('cx, mergeRefs e composeEventHandlers são públicos', () => {
    const ref = createRef<string>()
    ui.mergeRefs(ref)('ok')
    const internal = vi.fn()
    ui.composeEventHandlers(undefined, internal)(new Event('click'))
    expect(ui.cx('a', { b: true })).toBe('a b')
    expect(ref.current).toBe('ok')
    expect(internal).toHaveBeenCalled()
  })

  it('clamp, range, setRef e getFocusableElements saíram da API pública na v1.0', () => {
    for (const name of ['clamp', 'range', 'setRef', 'getFocusableElements']) {
      expect(ui).not.toHaveProperty(name)
    }
  })

  it('decimalsOf e roundTo são internos', () => {
    for (const name of ['decimalsOf', 'roundTo']) {
      expect(ui).not.toHaveProperty(name)
    }
  })
})
