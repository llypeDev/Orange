import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { Slider } from './Slider'

const norm = (text: string) => text.replace(/\s+/g, ' ')
const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

describe('Slider', () => {
  it('renderiza um input range nativo com rótulo e saída visível', () => {
    render(
      <Slider label="Volume" defaultValue={40} description="Ajuste o volume das notificações" />,
    )
    const slider = screen.getByRole('slider', { name: 'Volume' })
    expect(slider).toHaveAttribute('type', 'range')
    expect(slider).toHaveAttribute('min', '0')
    expect(slider).toHaveAttribute('max', '100')
    expect(slider).toHaveValue('40')
    expect(slider).toHaveAccessibleDescription('Ajuste o volume das notificações')
    const output = screen.getByRole('status')
    expect(output.tagName).toBe('OUTPUT')
    expect(output).toHaveTextContent('40')
  })

  it('usa formatValue em aria-valuetext e na saída', () => {
    render(
      <Slider
        label="Orçamento"
        min={0}
        max={5000}
        step={100}
        defaultValue={1500}
        formatValue={brl}
      />,
    )
    const slider = screen.getByRole('slider')
    expect(slider).toHaveAttribute('aria-valuetext', brl(1500))
    expect(screen.getByRole('status')).toHaveTextContent(norm(brl(1500)))
  })

  it('atualiza o valor e chama onChange / onChangeEnd', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const onChangeEnd = vi.fn()
    render(
      <Slider
        label="Brilho"
        defaultValue={50}
        step={5}
        onChange={onChange}
        onChangeEnd={onChangeEnd}
      />,
    )
    const slider = screen.getByRole('slider')
    fireEvent.change(slider, { target: { value: '63' } })
    // arredonda para o passo
    expect(onChange).toHaveBeenLastCalledWith(65)
    expect(slider).toHaveValue('65')
    slider.focus()
    await user.keyboard('{ArrowRight}')
    expect(onChangeEnd).toHaveBeenCalledWith(65)
  })

  it('funciona controlado', () => {
    function Controlled() {
      const [v, setV] = useState(20)
      return (
        <>
          <Slider label="Temperatura" min={16} max={30} value={v} onChange={setV} />
          <button type="button" onClick={() => setV(24)}>
            Conforto
          </button>
        </>
      )
    }
    render(<Controlled />)
    const slider = screen.getByRole('slider')
    fireEvent.change(slider, { target: { value: '18' } })
    expect(slider).toHaveValue('18')
    fireEvent.click(screen.getByRole('button', { name: 'Conforto' }))
    expect(slider).toHaveValue('24')
  })

  it('modo range: dois polegares em um grupo, com rótulos mínimo e máximo', () => {
    const onChange = vi.fn()
    render(
      <Slider
        range
        label="Faixa de preço"
        min={0}
        max={1000}
        step={50}
        defaultValue={[200, 600]}
        onChange={onChange}
        formatValue={brl}
      />,
    )
    expect(screen.getByRole('group', { name: 'Faixa de preço' })).toBeInTheDocument()
    const lower = screen.getByRole('slider', { name: 'Faixa de preço mínimo' })
    const upper = screen.getByRole('slider', { name: 'Faixa de preço máximo' })
    expect(lower).toHaveValue('200')
    expect(upper).toHaveValue('600')
    expect(screen.getByRole('status')).toHaveTextContent(norm(`${brl(200)} – ${brl(600)}`))
    fireEvent.change(lower, { target: { value: '400' } })
    expect(onChange).toHaveBeenLastCalledWith([400, 600])
  })

  it('modo range: os polegares não se cruzam e respeitam minDistance', () => {
    const onChange = vi.fn()
    render(
      <Slider
        range
        label="Horário"
        min={0}
        max={24}
        defaultValue={[8, 18]}
        minDistance={2}
        onChange={onChange}
      />,
    )
    const [lower, upper] = screen.getAllByRole('slider')
    fireEvent.change(lower, { target: { value: '20' } })
    expect(onChange).toHaveBeenLastCalledWith([16, 18])
    fireEvent.change(upper, { target: { value: '3' } })
    expect(onChange).toHaveBeenLastCalledWith([16, 18])
    expect(upper).toHaveValue('18')
  })

  it('permite nomes próprios para os polegares', () => {
    render(<Slider range label="Idade" defaultValue={[18, 30]} thumbLabels={['de', 'até']} />)
    expect(screen.getByRole('slider', { name: 'Idade de' })).toBeInTheDocument()
    expect(screen.getByRole('slider', { name: 'Idade até' })).toBeInTheDocument()
  })

  it('mostra marcas com rótulos e define o valor ao clicar', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <Slider
        label="Plano"
        min={0}
        max={100}
        step={50}
        defaultValue={0}
        onChange={onChange}
        marks={[
          { value: 0, label: 'Básico' },
          { value: 50, label: 'Pro' },
          { value: 100, label: 'Empresa' },
        ]}
      />,
    )
    expect(document.querySelectorAll('.or-slider__tick')).toHaveLength(3)
    await user.click(screen.getByText('Pro'))
    expect(onChange).toHaveBeenLastCalledWith(50)
    expect(screen.getByRole('slider')).toHaveFocus()
  })

  it('respeita disabled', () => {
    render(<Slider label="Volume" disabled defaultValue={10} />)
    expect(screen.getByRole('slider')).toBeDisabled()
  })

  it('movimento: saltos animam (data-animate) e o arraste não', async () => {
    const user = userEvent.setup()
    render(
      <Slider
        label="Plano"
        min={0}
        max={100}
        step={50}
        defaultValue={0}
        marks={[
          { value: 0, label: 'Básico' },
          { value: 100, label: 'Empresa' },
        ]}
      />,
    )
    const root = document.querySelector('.or-slider')!
    expect(root).not.toHaveAttribute('data-animate')
    await user.click(screen.getByText('Empresa'))
    expect(root).toHaveAttribute('data-animate')
    const slider = screen.getByRole('slider')
    // jsdom não tem PointerEvent com `buttons`: um MouseEvent do tipo pointermove simula o arraste.
    act(() => {
      slider.dispatchEvent(new MouseEvent('pointermove', { bubbles: true, buttons: 1 }))
    })
    expect(root).not.toHaveAttribute('data-animate')
    fireEvent.keyDown(slider, { key: 'ArrowLeft' })
    expect(root).toHaveAttribute('data-animate')
    // polegar visual decorativo posicionado pelo valor
    expect(document.querySelector('.or-slider__thumb-pos')).toHaveAttribute('aria-hidden', 'true')
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <Slider label="Volume" defaultValue={30} marks={[0, 50, 100]} />
        <Slider range label="Faixa de preço" defaultValue={[20, 80]} formatValue={(v) => `${v}%`} />
        <Slider aria-label="Zoom" defaultValue={100} min={50} max={200} />
        <Slider label="Desabilitado" disabled error="Indisponível" />
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
