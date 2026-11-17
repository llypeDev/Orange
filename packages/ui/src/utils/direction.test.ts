import { afterEach, describe, expect, it } from 'vitest'
import { isRtl, logicalArrowKey } from './index'

function mount(html: string) {
  const host = document.createElement('div')
  host.innerHTML = html
  document.body.appendChild(host)
  return host
}

afterEach(() => {
  document.body.innerHTML = ''
  document.documentElement.removeAttribute('dir')
})

describe('isRtl', () => {
  it('lê o dir do próprio elemento, de um ancestral ou do <html>', () => {
    const host = mount('<div dir="rtl"><span id="dentro"></span></div><span id="fora"></span>')
    expect(isRtl(host.querySelector('#dentro'))).toBe(true)
    expect(isRtl(host.querySelector('#fora'))).toBe(false)
    document.documentElement.setAttribute('dir', 'rtl')
    expect(isRtl(host.querySelector('#fora'))).toBe(true)
  })

  it('um trecho dir="ltr" dentro de uma página RTL volta a ser LTR', () => {
    const host = mount('<div dir="rtl"><div dir="ltr"><span id="codigo"></span></div></div>')
    expect(isRtl(host.querySelector('#codigo'))).toBe(false)
  })

  it('sem elemento, é LTR', () => {
    expect(isRtl(null)).toBe(false)
    expect(isRtl(undefined)).toBe(false)
  })
})

describe('logicalArrowKey', () => {
  it('troca ← e → só em RTL e deixa as outras teclas iguais', () => {
    const host = mount('<div dir="rtl" id="rtl"></div><div id="ltr"></div>')
    const rtl = host.querySelector('#rtl')
    const ltr = host.querySelector('#ltr')
    expect(logicalArrowKey('ArrowLeft', rtl)).toBe('ArrowRight')
    expect(logicalArrowKey('ArrowRight', rtl)).toBe('ArrowLeft')
    expect(logicalArrowKey('ArrowUp', rtl)).toBe('ArrowUp')
    expect(logicalArrowKey('Home', rtl)).toBe('Home')
    expect(logicalArrowKey('ArrowLeft', ltr)).toBe('ArrowLeft')
    expect(logicalArrowKey('ArrowRight', ltr)).toBe('ArrowRight')
  })
})
