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

  describe('fim da faixa', () => {
    const thumbPositions = () =>
      Array.from(document.querySelectorAll<HTMLElement>('.or-slider__thumb-pos')).map((el) =>
        el.style.getPropertyValue('--_p'),
      )

    it('range sem defaultValue e passo que não divide max − min: estado, saída, polegar e input concordam', () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {})
      const onChange = vi.fn()
      render(<Slider range label="Lote" min={0} max={10} step={3} onChange={onChange} />)
      const [lower, upper] = screen.getAllByRole('slider')
      // como no input nativo, 10 não é alcançável com passo 3: o maior valor é 9
      expect(upper).toHaveValue('9')
      expect(screen.getByRole('status')).toHaveTextContent('0 – 9')
      expect(thumbPositions()).toEqual(['0%', '90%'])
      fireEvent.change(lower, { target: { value: '3' } })
      expect(onChange).toHaveBeenLastCalledWith([3, 9])
      // End no polegar máximo (o nativo vai a 9) não move nada nem emite 10
      fireEvent.change(upper, { target: { value: '10' } })
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(screen.getByRole('status')).toHaveTextContent('3 – 9')
    })

    it('limita valores fora de [min, max] como o input nativo, sem chamar onChange', () => {
      const onChange = vi.fn()
      const { rerender } = render(
        <Slider label="Nível" min={0} max={10} defaultValue={15} onChange={onChange} />,
      )
      expect(screen.getByRole('slider')).toHaveValue('10')
      expect(screen.getByRole('status')).toHaveTextContent('10')
      expect(thumbPositions()).toEqual(['100%'])
      rerender(<Slider range label="Nível" min={0} max={10} value={[-3, 20]} onChange={onChange} />)
      expect(screen.getByRole('status')).toHaveTextContent('0 – 10')
      expect(thumbPositions()).toEqual(['0%', '100%'])
      expect(onChange).not.toHaveBeenCalled()
    })

    it('valor controlado fora do passo é mostrado já arredondado', () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {})
      render(<Slider label="Pacotes" min={0} max={10} step={3} value={10} onChange={() => {}} />)
      expect(screen.getByRole('slider')).toHaveValue('9')
      expect(screen.getByRole('status')).toHaveTextContent('9')
      expect(thumbPositions()).toEqual(['90%'])
    })

    it('avisa em desenvolvimento quando step não divide max − min', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      render(<Slider label="Caixas" min={0} max={11} step={4} defaultValue={0} />)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('Slider: `step` (4)'))
      warn.mockClear()
      render(<Slider label="Taxa" min={0} max={0.7} step={0.1} defaultValue={0} />)
      expect(warn).not.toHaveBeenCalled()
    })

    it('a precisão considera min, não só step (min 0.5, step 1)', () => {
      const onChange = vi.fn()
      render(
        <Slider
          label="Nota"
          min={0.5}
          max={10.5}
          step={1}
          defaultValue={5.5}
          onChange={onChange}
        />,
      )
      const slider = screen.getByRole('slider')
      fireEvent.change(slider, { target: { value: '0.5' } }) // Home
      expect(onChange).toHaveBeenLastCalledWith(0.5)
      expect(screen.getByRole('status')).toHaveTextContent('0.5')
      fireEvent.change(slider, { target: { value: '1.5' } }) // ArrowRight
      expect(onChange).toHaveBeenLastCalledWith(1.5)
      fireEvent.change(slider, { target: { value: '10.5' } }) // End
      fireEvent.change(slider, { target: { value: '9.5' } }) // ArrowLeft
      expect(onChange).toHaveBeenLastCalledWith(9.5)
      expect(slider).toHaveValue('9.5')
    })

    it('entende passos em notação exponencial (1e-7)', () => {
      const onChange = vi.fn()
      render(
        <Slider
          label="Tolerância"
          min={0}
          max={0.000001}
          step={1e-7}
          defaultValue={0}
          onChange={onChange}
        />,
      )
      fireEvent.change(screen.getByRole('slider'), { target: { value: '0.0000003' } })
      expect(onChange).toHaveBeenLastCalledWith(3e-7)
    })

    it.each([
      [0.7, 0.1, 8],
      [0.3, 0.1, 4],
      [0.6, 0.2, 4],
      [2.3, 0.1, 24],
    ])(
      'marks={true} com max %s e step %s desenha %s marcas, a última no fim',
      (max, step, count) => {
        render(<Slider label="Opacidade" min={0} max={max} step={step} defaultValue={0} marks />)
        const ticks = document.querySelectorAll<HTMLElement>('.or-slider__tick')
        expect(ticks).toHaveLength(count)
        expect(ticks[ticks.length - 1].style.left).toBe('100%')
      },
    )
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
