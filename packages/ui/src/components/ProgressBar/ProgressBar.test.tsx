import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { ProgressBar } from './ProgressBar'

describe('ProgressBar', () => {
  it('expõe role="progressbar" com valores, rótulo visível associado e valor exibido', () => {
    render(<ProgressBar label="Enviando arquivos" value={45} />)
    const bar = screen.getByRole('progressbar', { name: 'Enviando arquivos' })
    expect(bar).toHaveAttribute('aria-valuenow', '45')
    expect(bar).toHaveAttribute('aria-valuemin', '0')
    expect(bar).toHaveAttribute('aria-valuemax', '100')
    expect(bar).toHaveAttribute('aria-valuetext', '45%')
    expect(screen.getByText('45%')).toHaveAttribute('aria-hidden', 'true')
    expect(bar.querySelector<HTMLElement>('.or-progress-bar__fill')!.style.width).toBe('45%')
  })

  it('calcula o percentual com min/max personalizados e limita o valor', () => {
    const { rerender } = render(<ProgressBar aria-label="Etapas" value={3} min={1} max={5} />)
    const bar = screen.getByRole('progressbar', { name: 'Etapas' })
    expect(bar).toHaveAttribute('aria-valuetext', '50%')
    rerender(<ProgressBar aria-label="Etapas" value={99} min={1} max={5} />)
    expect(bar).toHaveAttribute('aria-valuenow', '5')
    expect(bar).toHaveAttribute('aria-valuetext', '100%')
  })

  it('aceita formatação própria do valor', () => {
    render(
      <ProgressBar
        label="Importando contatos"
        value={320}
        max={800}
        formatValue={(v, { max }) => `${v} de ${max} contatos`}
      />,
    )
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuetext', '320 de 800 contatos')
    expect(screen.getByText('320 de 800 contatos')).toBeInTheDocument()
  })

  it('formata conforme o idioma do provider', () => {
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <ProgressBar aria-label="Upload" value={12.6} />
      </OrangeProvider>,
    )
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '13%')
  })

  it('sem valor fica indeterminada (sem aria-valuenow nem valor exibido)', () => {
    const { container } = render(<ProgressBar label="Preparando relatório" />)
    const bar = screen.getByRole('progressbar', { name: 'Preparando relatório' })
    expect(bar).not.toHaveAttribute('aria-valuenow')
    expect(bar).not.toHaveAttribute('aria-valuetext')
    expect(container.firstElementChild).toHaveClass('or-progress-bar--indeterminate')
    expect(container.querySelector('.or-progress-bar__value')).not.toBeInTheDocument()
  })

  it('associa a descrição via aria-describedby', () => {
    render(<ProgressBar label="Backup" value={70} description="Cerca de 2 minutos restantes" />)
    expect(screen.getByRole('progressbar')).toHaveAccessibleDescription(
      'Cerca de 2 minutos restantes',
    )
  })

  it('aplica tom e tamanho e pode ocultar o valor', () => {
    const { container } = render(
      <ProgressBar aria-label="Cota" value={92} tone="danger" size="sm" showValue={false} />,
    )
    expect(container.firstElementChild).toHaveClass(
      'or-progress-bar--danger',
      'or-progress-bar--sm',
    )
    expect(container.querySelector('.or-progress-bar__value')).not.toBeInTheDocument()
  })

  it('avisa em desenvolvimento quando não há nome acessível', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(<ProgressBar value={10} />)
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('ProgressBar precisa de'))
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <ProgressBar label="Enviando 3 arquivos" value={45} description="1,2 MB de 2,8 MB" />
        <ProgressBar aria-label="Carregando" />
        <ProgressBar label="Armazenamento" value={92} tone="warning" size="sm" />
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
