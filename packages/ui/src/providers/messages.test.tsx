import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Table } from '../components/Table'
import { esES } from './esES'
import { builtInMessages, enUS, interpolate, ptBR, type MessageKey, type Messages } from './messages'
import { OrangeProvider, useLocale } from './OrangeProvider'

const keys = Object.keys(ptBR) as MessageKey[]
const placeholders = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort()

const dictionaries: [string, Messages][] = [
  ['enUS', enUS],
  ['esES', esES],
]

describe.each(dictionaries)('dicionário %s', (_name, dictionary) => {
  it('tem exatamente as chaves do ptBR', () => {
    expect(Object.keys(dictionary).sort()).toEqual([...keys].sort())
  })

  it('não tem texto vazio', () => {
    expect(keys.filter((key) => !dictionary[key].trim())).toEqual([])
  })

  it('usa as mesmas variáveis do ptBR em cada mensagem', () => {
    // Uma variável a mais nunca seria preenchida ("{nome}" apareceria na tela); uma a menos
    // esconde informação (a contagem, o rótulo).
    const different = keys.filter(
      (key) => placeholders(dictionary[key]).join() !== placeholders(ptBR[key]).join(),
    )
    expect(different).toEqual([])
  })
})

describe('esES', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('está em espanhol: sem sobras de português ou de inglês', () => {
    // Português e espanhol têm textos idênticos de verdade ("Cancelar", "Página anterior"): cerca
    // de um quinto das chaves. Bem mais que isso seria um trecho esquecido sem traduzir.
    const sameAsPortuguese = keys.filter((key) => esES[key] === ptBR[key])
    expect(sameAsPortuguese.length / keys.length).toBeLessThan(0.25)
    // Letras e palavras que só existem em português, e palavras de ligação do inglês.
    const portuguese = /[ãõç]|\b(não|você|um|uma|são)\b/i
    const english = /\b(the|and|of|to|is|are|with)\b/i
    expect(keys.filter((key) => portuguese.test(esES[key]) || english.test(esES[key]))).toEqual([])
  })

  it('não vem embutido no provider (fica fora do bundle de quem não usa)', () => {
    expect(Object.keys(builtInMessages).sort()).toEqual(['en', 'en-US', 'pt', 'pt-BR'])
  })

  it('com locale e messages, os componentes falam espanhol', () => {
    function Probe() {
      const { locale, t } = useLocale()
      return <output>{`${locale}|${t('pageOf', { page: 2, total: 9 })}`}</output>
    }
    render(
      <OrangeProvider locale="es-ES" messages={esES} themeTarget="scoped">
        <Probe />
        <Table
          caption="Facturas"
          selectable
          columns={[{ key: 'name', header: 'Cliente', rowHeader: true, filter: 'text', resizable: true }]}
          data={[{ id: '1', name: 'Panadería Aurora' }]}
        />
      </OrangeProvider>,
    )
    expect(screen.getByText('es-ES|Página 2 de 9')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Seleccionar todo' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Seleccionar fila Panadería Aurora' })).toBeInTheDocument()
    expect(screen.getByRole('searchbox', { name: 'Filtrar por Cliente' })).toBeInTheDocument()
    expect(screen.getByRole('separator', { name: 'Redimensionar la columna Cliente' })).toBeInTheDocument()
  })

  it('interpola as variáveis', () => {
    expect(interpolate(esES.sortableMoved, { label: 'Tarea', position: 2, total: 5 })).toBe(
      'Tarea movido a la posición 2 de 5.',
    )
    expect(interpolate(esES.itemRange, { start: 1, end: 10, total: 42 })).toBe('1–10 de 42')
  })

  it('locale sem textos embutidos e sem messages avisa em desenvolvimento', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(
      <OrangeProvider locale="es-ES" messages={esES} themeTarget="scoped">
        ok
      </OrangeProvider>,
    )
    render(
      <OrangeProvider locale="en-GB" themeTarget="scoped">
        ok
      </OrangeProvider>,
    )
    // Com o dicionário, ou com um idioma embutido (en-GB cai em "en"), nada a avisar.
    expect(warn).not.toHaveBeenCalled()
    render(
      <OrangeProvider locale="es-ES" themeTarget="scoped">
        ok
      </OrangeProvider>,
    )
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('não há textos embutidos para o locale "es-ES"'))
  })
})
