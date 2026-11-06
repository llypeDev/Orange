import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { Field, useFieldControlProps } from './Field'

function Control() {
  return <input {...useFieldControlProps()} />
}

describe('Field', () => {
  it('liga rótulo e erro ao controle e marca aria-invalid', () => {
    const { container } = render(
      <Field label="Nome" error="Informe o nome">
        <Control />
      </Field>,
    )
    const input = screen.getByRole('textbox', { name: 'Nome' })
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Informe o nome')
    expect(container.querySelector('.or-field')).toHaveAttribute('data-invalid')
  })

  it('aceita invalid sem mensagem de erro', () => {
    const { container } = render(
      <Field label="Nome" invalid>
        <Control />
      </Field>,
    )
    const input = screen.getByRole('textbox', { name: 'Nome' })
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).not.toHaveAccessibleDescription()
    expect(container.querySelector('.or-field')).toHaveAttribute('data-invalid')
    expect(container.querySelector('.or-field__error')).toBeNull()
  })

  it('repassa a ref para o elemento raiz', () => {
    const ref = createRef<HTMLDivElement>()
    const { container } = render(
      <Field ref={ref} label="Nome">
        <Control />
      </Field>,
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toBe(container.querySelector('.or-field'))
  })
})
