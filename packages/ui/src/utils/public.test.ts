import { createRef } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  clamp,
  composeEventHandlers,
  cx,
  getFocusableElements,
  mergeRefs,
  range,
  setRef,
} from '../index'

afterEach(() => vi.restoreAllMocks())

describe('utilitários públicos', () => {
  it('cx, mergeRefs e composeEventHandlers seguem públicos, sem aviso', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const ref = createRef<string>()
    mergeRefs(ref)('ok')
    const internal = vi.fn()
    composeEventHandlers(undefined, internal)(new Event('click'))
    expect(cx('a', { b: true })).toBe('a b')
    expect(ref.current).toBe('ok')
    expect(internal).toHaveBeenCalled()
    expect(warn).not.toHaveBeenCalled()
  })

  it('clamp, range, setRef e getFocusableElements (depreciados) funcionam e avisam', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const ref = createRef<number>()
    const root = document.createElement('div')
    root.innerHTML = '<button>a</button><span>b</span>'
    expect(clamp(12, 0, 10)).toBe(10)
    expect(range(2, 4)).toEqual([2, 3, 4])
    setRef(ref, 3)
    expect(ref.current).toBe(3)
    expect(getFocusableElements(root)).toHaveLength(1)
    for (const name of ['clamp', 'range', 'setRef', 'getFocusableElements']) {
      expect(warn).toHaveBeenCalledWith(expect.stringContaining(`\`${name}\` sai da API pública`))
    }
  })
})
