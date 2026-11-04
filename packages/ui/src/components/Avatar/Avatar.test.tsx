import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { Avatar } from './Avatar'

describe('Avatar', () => {
  it('mostra as iniciais do nome e expõe o nome como imagem acessível', () => {
    render(<Avatar name="Mariana da Silva Lopes" />)
    const avatar = screen.getByRole('img', { name: 'Mariana da Silva Lopes' })
    expect(avatar).toHaveTextContent('ML')
    expect(avatar).toHaveClass('or-avatar', 'or-avatar--md', 'or-avatar--square')
  })

  it('usa uma única inicial para nomes de uma palavra e ignora pontuação', () => {
    render(<Avatar name="(orange)" />)
    expect(screen.getByRole('img', { name: '(orange)' })).toHaveTextContent(/^O$/)
  })

  it('a cor de fundo é determinística pelo nome', () => {
    const { rerender } = render(<Avatar name="Rafael Costa" data-testid="a" />)
    const first = Array.from(screen.getByTestId('a').classList).find((c) => c.startsWith('or-avatar--tone-'))
    rerender(<Avatar name="Rafael Costa" data-testid="a" size="xl" />)
    const second = Array.from(screen.getByTestId('a').classList).find((c) => c.startsWith('or-avatar--tone-'))
    expect(first).toBeDefined()
    expect(first).toBe(second)
  })

  it('carrega a imagem e volta às iniciais quando ela falha', () => {
    const { container } = render(<Avatar src="/fotos/ana.jpg" name="Ana Souza" />)
    const img = container.querySelector('img')!
    expect(img).toHaveAttribute('alt', '')
    fireEvent.load(img)
    expect(screen.getByRole('img', { name: 'Ana Souza' })).toHaveClass('or-avatar--loaded')
    fireEvent.error(img)
    expect(container.querySelector('img')).toBeNull()
    expect(screen.getByRole('img', { name: 'Ana Souza' })).toHaveTextContent('AS')
  })

  it('sem nome nem imagem mostra o ícone de usuário', () => {
    const { container } = render(<Avatar alt="Usuário convidado" />)
    expect(screen.getByRole('img', { name: 'Usuário convidado' })).toBeInTheDocument()
    expect(container.querySelector('[data-icon="user"]')).not.toBeNull()
  })

  it('inclui o status no nome acessível', () => {
    const { rerender } = render(<Avatar name="Ana Souza" status="busy" />)
    expect(screen.getByRole('img', { name: 'Ana Souza, Ocupado' })).toBeInTheDocument()
    rerender(<Avatar name="Ana Souza" status="away" statusLabel="Em reunião até 15h" />)
    expect(screen.getByRole('img', { name: 'Ana Souza, Em reunião até 15h' })).toBeInTheDocument()
  })

  it('alt="" torna o avatar decorativo, mas mantém o status em texto oculto', () => {
    render(<Avatar name="Ana Souza" alt="" status="online" data-testid="a" />)
    expect(screen.queryByRole('img')).toBeNull()
    expect(screen.getByTestId('a')).toHaveTextContent('Online')
  })

  it('traduz o status conforme o idioma', () => {
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <Avatar name="Ana Souza" status="away" shape="circle" />
      </OrangeProvider>,
    )
    expect(screen.getByRole('img', { name: 'Ana Souza, Away' })).toHaveClass('or-avatar--circle')
  })

  it('pulse liga o anel "ao vivo" no status (exceto offline)', () => {
    const { container, rerender } = render(<Avatar name="Ana Souza" status="online" pulse />)
    expect(container.querySelector('.or-avatar__status')).toHaveClass('or-avatar__status--pulse')
    rerender(<Avatar name="Ana Souza" status="offline" pulse />)
    expect(container.querySelector('.or-avatar__status')).not.toHaveClass('or-avatar__status--pulse')
    rerender(<Avatar name="Ana Souza" status="online" />)
    expect(container.querySelector('.or-avatar__status')).not.toHaveClass('or-avatar__status--pulse')
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <Avatar name="Ana Souza" status="online" size="xs" />
        <Avatar name="Bruno Lima" shape="circle" size="lg" status="offline" />
        <Avatar src="/foto.jpg" alt="Foto de Carla Dias" size="xl" />
        <Avatar alt="Convidado" />
        <Avatar name="Diego" alt="" />
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
