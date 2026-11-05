import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { Button } from '../Button'
import { Checkbox, CheckboxGroup } from '../Checkbox'
import { Combobox } from '../Combobox'
import { DatePicker } from '../DatePicker'
import { FileUploader } from '../FileUploader'
import { RadioGroup } from '../RadioGroup'
import { Select } from '../Select'
import { TextField } from '../TextField'
import { Form, FormActions, useForm, type FormErrors, type FormProps, type FormValues } from './Form'

const validateSignUp = (values: FormValues): FormErrors => ({
  nome: String(values.nome ?? '').trim() ? undefined : 'Informe seu nome completo.',
  email: /^\S+@\S+\.\S+$/.test(String(values.email ?? '')) ? undefined : 'Informe um e-mail como nome@empresa.com.',
  termos: values.termos ? undefined : 'Aceite os termos de uso para continuar.',
})

/** Formulário de cadastro com erros vindos do render-prop. */
function SignUp(props: Partial<FormProps>) {
  return (
    <Form aria-label="Criar conta" validate={validateSignUp} {...props}>
      {({ errors, isSubmitting }) => (
        <>
          <TextField name="nome" label="Nome completo" error={errors.nome} />
          <TextField name="email" type="email" label="E-mail de trabalho" error={errors.email} />
          <Checkbox name="termos" label="Li e aceito os termos de uso" error={errors.termos} />
          <FormActions>
            <Button type="submit" loading={isSubmitting}>
              Criar conta
            </Button>
          </FormActions>
        </>
      )}
    </Form>
  )
}

function deferred() {
  let resolve!: () => void
  const promise = new Promise<void>((r) => {
    resolve = r
  })
  return { promise, resolve }
}

describe('Form', () => {
  it('renderiza um <form noValidate>, repassa a ref e as props nativas', () => {
    const ref = createRef<HTMLFormElement>()
    render(
      <Form ref={ref} aria-label="Contato" id="contato" className="extra">
        <TextField name="nome" label="Nome" />
      </Form>,
    )
    const form = screen.getByRole('form', { name: 'Contato' })
    expect(form).toBe(ref.current)
    expect(form).toHaveAttribute('novalidate')
    expect(form).toHaveAttribute('id', 'contato')
    expect(form).toHaveClass('or-form', 'or-form--gap-md', 'extra')
    expect(form).not.toHaveAttribute('aria-busy')
  })

  it('não mostra erros antes do primeiro envio', async () => {
    const user = userEvent.setup()
    render(<SignUp />)
    await user.type(screen.getByRole('textbox', { name: 'E-mail de trabalho' }), 'ana@')
    await user.tab()
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'E-mail de trabalho' })).not.toHaveAttribute('aria-invalid')
  })

  it('bloqueia o envio inválido, mostra o resumo na ordem dos campos e o foca', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<SignUp onSubmit={onSubmit} />)
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    expect(onSubmit).not.toHaveBeenCalled()
    const summary = screen.getByRole('region', { name: 'Corrija os seguintes erros' })
    expect(summary).toHaveFocus()
    const links = screen.getAllByRole('link')
    expect(links.map((l) => l.textContent)).toEqual([
      'Informe seu nome completo.',
      'Informe um e-mail como nome@empresa.com.',
      'Aceite os termos de uso para continuar.',
    ])
    const nome = screen.getByRole('textbox', { name: 'Nome completo' })
    expect(links[0]).toHaveAttribute('href', `#${nome.id}`)
    // Erros inline ligados por aria-describedby.
    expect(nome).toHaveAttribute('aria-invalid', 'true')
    expect(nome).toHaveAccessibleDescription('Informe seu nome completo.')
    expect(screen.getByRole('checkbox')).toHaveAccessibleDescription('Aceite os termos de uso para continuar.')
  })

  it('o link do resumo foca o campo (clique e Enter)', async () => {
    const user = userEvent.setup()
    render(<SignUp />)
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))
    await user.click(screen.getByRole('link', { name: 'Informe um e-mail como nome@empresa.com.' }))
    expect(screen.getByRole('textbox', { name: 'E-mail de trabalho' })).toHaveFocus()

    screen.getByRole('region').focus()
    await user.tab()
    expect(screen.getByRole('link', { name: 'Informe seu nome completo.' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('textbox', { name: 'Nome completo' })).toHaveFocus()
  })

  it('foca o resumo de novo a cada envio com erros, sem remontá-lo', async () => {
    const user = userEvent.setup()
    render(<SignUp />)
    const button = screen.getByRole('button', { name: 'Criar conta' })
    await user.click(button)
    const summary = screen.getByRole('region')
    await user.click(button)
    expect(screen.getByRole('region')).toBe(summary)
    expect(summary).toHaveFocus()
  })

  it('revalida depois do primeiro envio: erros corrigidos somem, novos só no próximo envio', async () => {
    const user = userEvent.setup()
    const validate = (values: FormValues): FormErrors => ({
      empresa: String(values.empresa ?? '').trim() ? undefined : 'Informe o nome da empresa.',
      site: String(values.site ?? '').startsWith('https://') ? undefined : 'O site precisa começar com https://.',
    })
    render(
      <Form validate={validate}>
        {({ errors }) => (
          <>
            <TextField name="empresa" label="Empresa" error={errors.empresa} />
            <TextField name="site" label="Site" defaultValue="https://acme.com.br" error={errors.site} />
            <Button type="submit">Salvar</Button>
          </>
        )}
      </Form>,
    )
    await user.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(screen.getAllByRole('link')).toHaveLength(1)

    // Quebrar um campo válido não mostra erro novo enquanto a pessoa corrige.
    const site = screen.getByRole('textbox', { name: 'Site' })
    await user.clear(site)
    await user.type(site, 'acme')
    expect(site).not.toHaveAttribute('aria-invalid')

    // Corrigir o campo inválido tira o erro na hora (inline e no resumo).
    const empresa = screen.getByRole('textbox', { name: 'Empresa' })
    await user.type(empresa, 'Acme')
    expect(empresa).not.toHaveAttribute('aria-invalid')
    expect(screen.queryByRole('link')).not.toBeInTheDocument()

    // O erro novo aparece no próximo envio.
    await user.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(screen.getByRole('link', { name: 'O site precisa começar com https://.' })).toBeInTheDocument()
    expect(site).toHaveAttribute('aria-invalid', 'true')
  })

  it('revalida campos que enviam o valor por input oculto (DatePicker)', async () => {
    const user = userEvent.setup()
    const validate = (values: FormValues): FormErrors => ({
      inicio: values.inicio ? undefined : 'Informe a data de início.',
    })
    render(
      <Form validate={validate}>
        {({ errors }) => (
          <>
            <DatePicker name="inicio" label="Início do contrato" error={errors.inicio} />
            <Button type="submit">Continuar</Button>
          </>
        )}
      </Form>,
    )
    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    const link = screen.getByRole('link', { name: 'Informe a data de início.' })
    const input = screen.getByRole('textbox', { name: 'Início do contrato' })
    expect(link).toHaveAttribute('href', `#${input.id}`)
    await user.click(link)
    expect(input).toHaveFocus()
    await user.type(input, '15032026')
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(input).not.toHaveAttribute('aria-invalid')
  })

  it('revalida ao escolher uma opção no popup (Combobox em Portal)', async () => {
    const user = userEvent.setup()
    render(
      <Form validate={(v) => ({ cidade: v.cidade ? undefined : 'Escolha a cidade de entrega.' })}>
        {({ errors }) => (
          <>
            <Combobox
              name="cidade"
              label="Cidade"
              error={errors.cidade}
              options={[
                { value: 'poa', label: 'Porto Alegre' },
                { value: 'rec', label: 'Recife' },
              ]}
            />
            <Button type="submit">Continuar</Button>
          </>
        )}
      </Form>,
    )
    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    const input = screen.getByRole('combobox', { name: 'Cidade' })
    await user.click(screen.getByRole('link', { name: 'Escolha a cidade de entrega.' }))
    expect(input).toHaveFocus()
    await user.type(input, 'Rec')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    await user.click(screen.getByRole('option', { name: /Recife/ }))
    expect(input).not.toHaveAttribute('aria-invalid')
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('FileUploader: sem arquivo o campo fica de fora e o link foca o botão de escolher', async () => {
    const user = userEvent.setup()
    const validate = vi.fn((v: FormValues): FormErrors => ({
      contrato: v.contrato ? undefined : 'Anexe o contrato assinado em PDF.',
    }))
    render(
      <Form validate={validate}>
        {({ errors }) => (
          <>
            <FileUploader name="contrato" label="Contrato assinado" accept=".pdf" error={errors.contrato} />
            <Button type="submit">Enviar</Button>
          </>
        )}
      </Form>,
    )
    await user.click(screen.getByRole('button', { name: 'Enviar' }))
    expect(validate.mock.calls[0][0]).not.toHaveProperty('contrato')
    await user.click(screen.getByRole('link', { name: 'Anexe o contrato assinado em PDF.' }))
    expect(screen.getByRole('button', { name: /Escolher arquivo/ })).toHaveFocus()
  })

  it('link de grupo de opções foca a primeira opção; Select recebe o foco direto', async () => {
    const user = userEvent.setup()
    const validate = (values: FormValues): FormErrors => ({
      plano: values.plano ? undefined : 'Escolha um plano.',
      estado: values.estado ? undefined : 'Escolha o estado.',
    })
    render(
      <Form validate={validate}>
        {({ errors }) => (
          <>
            <RadioGroup
              id="plano"
              name="plano"
              label="Plano"
              error={errors.plano}
              options={[
                { value: 'mensal', label: 'Mensal' },
                { value: 'anual', label: 'Anual' },
              ]}
            />
            <Select
              name="estado"
              label="Estado"
              placeholder="Selecione"
              error={errors.estado}
              options={[
                { value: 'SP', label: 'São Paulo' },
                { value: 'MG', label: 'Minas Gerais' },
              ]}
            />
            <Button type="submit">Continuar</Button>
          </>
        )}
      </Form>,
    )
    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    const planLink = screen.getByRole('link', { name: 'Escolha um plano.' })
    expect(planLink).toHaveAttribute('href', '#plano')
    await user.click(planLink)
    expect(screen.getByRole('radio', { name: 'Mensal' })).toHaveFocus()
    await user.click(screen.getByRole('link', { name: 'Escolha o estado.' }))
    expect(screen.getByRole('combobox', { name: 'Estado' })).toHaveFocus()

    // Escolher as opções tira os erros (change).
    await user.click(screen.getByRole('radio', { name: 'Anual' }))
    await user.selectOptions(screen.getByRole('combobox', { name: 'Estado' }), 'MG')
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  })

  it('useForm() entrega os erros a campos dentro do Form', async () => {
    const user = userEvent.setup()
    function EmailField() {
      const { getError, submitCount, isValid } = useForm()
      return (
        <>
          <TextField name="email" type="email" label="E-mail" error={getError('email')} />
          <p>
            Tentativas: {submitCount} · {isValid ? 'válido' : 'inválido'}
          </p>
        </>
      )
    }
    render(
      <Form validate={(v) => ({ email: v.email ? undefined : 'Informe o e-mail.' })}>
        <EmailField />
        <Button type="submit">Enviar</Button>
      </Form>,
    )
    expect(screen.getByText('Tentativas: 0 · válido')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Enviar' }))
    expect(screen.getByRole('textbox', { name: 'E-mail' })).toHaveAccessibleDescription('Informe o e-mail.')
    expect(screen.getByText('Tentativas: 1 · inválido')).toBeInTheDocument()
  })

  it('useForm() fora de um Form lança um erro claro', () => {
    function Orphan() {
      useForm()
      return null
    }
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Orphan />)).toThrow('[Orange] useForm precisa estar dentro de <Form>.')
  })

  it('soma erros externos aos de validação; o externo some quando o campo muda', async () => {
    const user = userEvent.setup()
    function ServerForm() {
      const [serverErrors, setServerErrors] = useState<FormErrors>({})
      return (
        <Form
          validate={validateSignUp}
          errors={serverErrors}
          onSubmit={() => setServerErrors({ email: 'Este e-mail já está cadastrado.' })}
        >
          {({ errors }) => (
            <>
              <TextField name="nome" label="Nome completo" error={errors.nome} />
              <TextField name="email" type="email" label="E-mail de trabalho" error={errors.email} />
              <Checkbox name="termos" label="Li e aceito os termos de uso" error={errors.termos} />
              <Button type="submit">Criar conta</Button>
            </>
          )}
        </Form>
      )
    }
    render(<ServerForm />)
    await user.type(screen.getByRole('textbox', { name: 'Nome completo' }), 'Ana Souza')
    const email = screen.getByRole('textbox', { name: 'E-mail de trabalho' })
    await user.type(email, 'ana@acme.com.br')
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    // Erro do servidor: no resumo (focado) e no campo.
    expect(screen.getByRole('region')).toHaveFocus()
    expect(screen.getByRole('link', { name: 'Este e-mail já está cadastrado.' })).toBeInTheDocument()
    expect(email).toHaveAccessibleDescription('Este e-mail já está cadastrado.')

    // Validação e erro externo juntos.
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))
    expect(screen.getAllByRole('link').map((l) => l.textContent)).toEqual([
      'Este e-mail já está cadastrado.',
      'Aceite os termos de uso para continuar.',
    ])

    // Mudar o e-mail tira o erro externo.
    await user.type(email, 'x')
    expect(email).not.toHaveAttribute('aria-invalid')
    expect(screen.getAllByRole('link')).toHaveLength(1)
  })

  it('erros externos passados direto aparecem e recebem o foco', () => {
    render(
      <Form errors={{ email: 'Este e-mail já está cadastrado.', nome: undefined }}>
        {({ errors }) => <TextField name="email" label="E-mail" error={errors.email} />}
      </Form>,
    )
    expect(screen.getByRole('region')).toHaveFocus()
    expect(screen.getAllByRole('link')).toHaveLength(1)
    expect(screen.getByRole('textbox', { name: 'E-mail' })).toHaveAttribute('aria-invalid', 'true')
  })

  it('envio assíncrono: isSubmitting, aria-busy e nada de envio duplo', async () => {
    const user = userEvent.setup()
    const pending = deferred()
    const onSubmit = vi.fn(() => pending.promise)
    render(<SignUp onSubmit={onSubmit} validate={undefined} />)
    const form = screen.getByRole('form', { name: 'Criar conta' })
    const email = screen.getByRole('textbox', { name: 'E-mail de trabalho' })

    await user.click(screen.getByRole('button', { name: 'Criar conta' }))
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(form).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByRole('button', { name: /Criar conta/ })).toHaveAttribute('aria-busy', 'true')

    // Enter num campo (envio implícito) e clique de novo não enviam outra vez.
    await user.type(email, 'ana@acme.com.br{Enter}')
    await user.click(screen.getByRole('button', { name: /Criar conta/ }))
    expect(onSubmit).toHaveBeenCalledTimes(1)

    await act(async () => pending.resolve())
    expect(form).not.toHaveAttribute('aria-busy')
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))
    expect(onSubmit).toHaveBeenCalledTimes(2)
  })

  it('envio válido chama onSubmit com os valores (listas para nomes repetidos)', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(
      <Form onSubmit={onSubmit} validate={() => ({})}>
        <TextField name="empresa" label="Empresa" defaultValue="Acme" />
        <CheckboxGroup
          name="modulos"
          label="Módulos"
          options={[
            { value: 'financeiro', label: 'Financeiro' },
            { value: 'estoque', label: 'Estoque' },
            { value: 'fiscal', label: 'Fiscal' },
          ]}
        />
        <Checkbox name="novidades" label="Quero receber novidades" />
        <Button type="submit" name="intencao" value="publicar">
          Publicar
        </Button>
      </Form>,
    )
    await user.click(screen.getByRole('checkbox', { name: 'Financeiro' }))
    await user.click(screen.getByRole('checkbox', { name: 'Fiscal' }))
    await user.click(screen.getByRole('button', { name: 'Publicar' }))
    expect(onSubmit).toHaveBeenCalledTimes(1)
    const [values, event] = onSubmit.mock.calls[0]
    expect(values).toEqual({ empresa: 'Acme', modulos: ['financeiro', 'fiscal'], intencao: 'publicar' })
    expect(values).not.toHaveProperty('novidades')
    expect(event.type).toBe('submit')
  })

  it('com errorSummary={false}, foca o primeiro campo inválido', async () => {
    const user = userEvent.setup()
    render(<SignUp errorSummary={false} />)
    await user.type(screen.getByRole('textbox', { name: 'Nome completo' }), 'Ana')
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'E-mail de trabalho' })).toHaveFocus()
  })

  it('aceita título do resumo e usa o dicionário do idioma por padrão', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<SignUp errorSummaryTitle="Não foi possível criar sua conta" />)
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))
    expect(screen.getByRole('heading', { name: 'Não foi possível criar sua conta' })).toBeInTheDocument()
    unmount()

    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <SignUp />
      </OrangeProvider>,
    )
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))
    expect(screen.getByRole('heading', { name: 'Please fix the following errors' })).toBeInTheDocument()
  })

  it('reset limpa os erros e o contador de envios', async () => {
    const user = userEvent.setup()
    render(
      <Form validate={validateSignUp}>
        {({ errors, submitCount }) => (
          <>
            <TextField name="nome" label="Nome completo" error={errors.nome} />
            <output>{submitCount}</output>
            <FormActions align="end">
              <Button type="reset" variant="outline">
                Limpar
              </Button>
              <Button type="submit">Enviar</Button>
            </FormActions>
          </>
        )}
      </Form>,
    )
    await user.click(screen.getByRole('button', { name: 'Enviar' }))
    expect(screen.getByRole('region')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('1')
    await user.click(screen.getByRole('button', { name: 'Limpar' }))
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('0')
    expect(screen.getByRole('button', { name: 'Limpar' }).parentElement).toHaveClass('or-form-actions', 'or-form-actions--end')
  })

  it('não possui violações de acessibilidade no estado de erro', async () => {
    const user = userEvent.setup()
    const { container } = render(<SignUp />)
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))
    expect(screen.getByRole('region')).toBeInTheDocument()
    await expectNoA11yViolations(container)
  })
})
