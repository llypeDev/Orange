import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { Avatar } from '../Avatar'
import { AvatarGroup } from './AvatarGroup'

const people = ['Ana Souza', 'Bruno Lima', 'Carla Dias', 'Diego Alves', 'Elisa Prado', 'Fábio Reis']

describe('AvatarGroup', () => {
  it('renderiza uma lista rotulada com um item por avatar', () => {
    render(
      <AvatarGroup label="Equipe do projeto">
        {people.slice(0, 3).map((n) => (
          <Avatar key={n} name={n} />
        ))}
      </AvatarGroup>,
    )
    const list = screen.getByRole('list', { name: 'Equipe do projeto' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(3)
    expect(within(list).getByRole('img', { name: 'Bruno Lima' })).toBeInTheDocument()
  })

  it('limita com max e mostra o contador "+N" com nome acessível', () => {
    render(
      <AvatarGroup label="Revisores" max={4}>
        {people.map((n) => (
          <Avatar key={n} name={n} />
        ))}
      </AvatarGroup>,
    )
    expect(screen.getAllByRole('listitem')).toHaveLength(5)
    const more = screen.getByRole('img', { name: 'mais 2' })
    expect(more).toHaveTextContent('+2')
    expect(more).toHaveAttribute('title', 'Elisa Prado, Fábio Reis')
    expect(screen.queryByRole('img', { name: 'Elisa Prado' })).toBeNull()
  })

  it('usa total para contar pessoas não carregadas', () => {
    render(
      <AvatarGroup label="Participantes" total={48}>
        {people.slice(0, 3).map((n) => (
          <Avatar key={n} name={n} />
        ))}
      </AvatarGroup>,
    )
    expect(screen.getByRole('img', { name: 'mais 45' })).toHaveTextContent('+45')
  })

  it('repassa tamanho e forma aos avatares (que podem sobrescrever)', () => {
    render(
      <AvatarGroup label="Time" size="sm" shape="circle">
        <Avatar name="Ana Souza" />
        <Avatar name="Bruno Lima" size="lg" />
      </AvatarGroup>,
    )
    expect(screen.getByRole('img', { name: 'Ana Souza' })).toHaveClass('or-avatar--sm', 'or-avatar--circle')
    expect(screen.getByRole('img', { name: 'Bruno Lima' })).toHaveClass('or-avatar--lg')
  })

  it('traduz o contador', () => {
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <AvatarGroup label="Team" max={2}>
          {people.map((n) => (
            <Avatar key={n} name={n} />
          ))}
        </AvatarGroup>
      </OrangeProvider>,
    )
    expect(screen.getByRole('img', { name: '4 more' })).toBeInTheDocument()
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <AvatarGroup label="Pessoas com acesso" max={3} size="lg">
        {people.map((n) => (
          <Avatar key={n} name={n} status="online" />
        ))}
      </AvatarGroup>,
    )
    await expectNoA11yViolations(container)
  })
})
