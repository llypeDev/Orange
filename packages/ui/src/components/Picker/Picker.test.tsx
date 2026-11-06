import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { Button } from '../Button'
import { Form } from '../Form'
import { Picker, type PickerGroup, type PickerOption, type PickerProps } from './Picker'

const visibilidade: PickerOption[] = [
  { value: 'privado', label: 'Privado', icon: 'lock', description: 'Só você e quem você convidar' },
  { value: 'equipe', label: 'Equipe', icon: 'users', description: 'Todos da equipe Produto' },
  {
    value: 'organizacao',
    label: 'Organização',
    icon: 'home',
    description: 'Disponível no plano Empresarial',
    disabled: true,
  },
  { value: 'publico', label: 'Público', icon: 'globe', description: 'Qualquer pessoa com o link' },
]

const regioes: PickerGroup[] = [
  {
    label: 'América do Sul',
    options: [
      { value: 'sa-east-1', label: 'São Paulo' },
      { value: 'sa-west-1', label: 'Santiago', disabled: true },
    ],
  },
  {
    label: 'América do Norte',
    options: [
      { value: 'us-east-1', label: 'Virgínia' },
      { value: 'us-west-2', label: 'Oregon' },
    ],
  },
  {
    label: 'Europa',
    options: [
      { value: 'eu-west-1', label: 'Irlanda' },
      { value: 'eu-central-1', label: 'Frankfurt' },
    ],
  },
]

const departamentos: PickerOption[] = [
  'Atendimento',
  'Comercial',
  'Compras',
  'Contabilidade',
  'Design',
  'Engenharia',
  'Jurídico',
  'Recursos humanos',
  'Relações institucionais',
].map((label) => ({ value: label.toLowerCase(), label, disabled: label === 'Contabilidade' }))

const sprints: PickerOption[] = Array.from({ length: 25 }, (_, i) => ({
  value: `sprint-${i + 1}`,
  label: `Sprint ${i + 1}`,
  disabled: i === 10,
}))

function setup(props: Partial<PickerProps> = {}) {
  const user = userEvent.setup()
  const onChange = vi.fn()
  const utils = render(
    <Picker label="Visibilidade" options={visibilidade} onChange={onChange} {...props} />,
  )
  const trigger = screen.getByRole('combobox', { name: 'Visibilidade' })
  return { user, onChange, trigger, ...utils }
}

/** Opção apontada por aria-activedescendant. */
function activeOption(trigger: HTMLElement) {
  const id = trigger.getAttribute('aria-activedescendant')
  return id ? document.getElementById(id) : null
}

afterEach(() => {
  vi.useRealTimers()
})

describe('Picker', () => {
  describe('papéis e estados', () => {
    it('expõe o padrão Select-Only Combobox fechado', () => {
      const { trigger } = setup()
      expect(trigger.tagName).toBe('DIV')
      expect(trigger).toHaveAttribute('tabindex', '0')
      expect(trigger).toHaveAttribute('aria-haspopup', 'listbox')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      expect(trigger).not.toHaveAttribute('aria-controls')
      expect(trigger).not.toHaveAttribute('aria-activedescendant')
      expect(trigger).toHaveTextContent('Selecione…')
      expect(trigger.querySelector('.or-picker__value')).toHaveAttribute('data-placeholder')
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })

    it('mostra o ícone e o rótulo da opção escolhida, ou o placeholder informado', () => {
      const { unmount } = render(
        <Picker label="Visibilidade" options={visibilidade} defaultValue="equipe" />,
      )
      const trigger = screen.getByRole('combobox', { name: 'Visibilidade' })
      expect(trigger).toHaveTextContent('Equipe')
      expect(trigger.querySelector('[data-icon="users"]')).toBeInTheDocument()
      expect(trigger.querySelector('.or-picker__value')).not.toHaveAttribute('data-placeholder')
      unmount()
      render(<Picker label="Visibilidade" options={visibilidade} placeholder="Quem pode ver" />)
      expect(screen.getByRole('combobox')).toHaveTextContent('Quem pode ver')
    })

    it('abre um listbox nomeado pelo rótulo, com opções, descrições e a escolhida ativa', async () => {
      const { user, trigger } = setup({ defaultValue: 'equipe' })
      await user.click(trigger)
      expect(trigger).toHaveFocus()
      expect(trigger).toHaveAttribute('aria-expanded', 'true')
      const listbox = screen.getByRole('listbox', { name: 'Visibilidade' })
      expect(trigger).toHaveAttribute('aria-controls', listbox.id)
      const options = within(listbox).getAllByRole('option')
      expect(options).toHaveLength(4)
      const equipe = screen.getByRole('option', { name: 'Equipe' })
      expect(equipe).toHaveAttribute('aria-selected', 'true')
      expect(equipe).toHaveAccessibleDescription('Todos da equipe Produto')
      expect(screen.getByRole('option', { name: 'Privado' })).toHaveAttribute(
        'aria-selected',
        'false',
      )
      expect(screen.getByRole('option', { name: 'Organização' })).toHaveAttribute(
        'aria-disabled',
        'true',
      )
      expect(activeOption(trigger)).toBe(equipe)
    })

    it('agrupa opções em role="group" nomeado pelo título', async () => {
      const user = userEvent.setup()
      render(<Picker label="Região" options={regioes} />)
      await user.click(screen.getByRole('combobox', { name: 'Região' }))
      expect(screen.getAllByRole('group')).toHaveLength(3)
      for (const name of ['América do Sul', 'América do Norte', 'Europa']) {
        expect(screen.getByRole('group', { name })).toBeInTheDocument()
      }
      const europa = screen.getByRole('group', { name: 'Europa' })
      expect(
        within(europa)
          .getAllByRole('option')
          .map((o) => o.textContent),
      ).toEqual(['Irlanda', 'Frankfurt'])
    })

    it('sem opções, mostra uma mensagem em vez de um listbox vazio', async () => {
      const user = userEvent.setup()
      render(<Picker label="Responsável" options={[]} />)
      const trigger = screen.getByRole('combobox', { name: 'Responsável' })
      await user.click(trigger)
      expect(screen.getByText('Nenhuma opção disponível')).toBeInTheDocument()
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
      expect(trigger).not.toHaveAttribute('aria-controls')
    })

    it('usa os textos do idioma (placeholder em inglês)', () => {
      render(
        <OrangeProvider locale="en-US">
          <Picker label="Visibility" options={visibilidade} />
        </OrangeProvider>,
      )
      expect(screen.getByRole('combobox', { name: 'Visibility' })).toHaveTextContent('Select…')
    })
  })

  describe('mouse', () => {
    it('escolhe com clique, fecha e devolve o foco ao gatilho', async () => {
      const { user, trigger, onChange } = setup()
      await user.click(trigger)
      await user.click(screen.getByRole('option', { name: 'Público' }))
      expect(onChange).toHaveBeenCalledWith('publico')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      expect(trigger).toHaveTextContent('Público')
      expect(trigger).toHaveFocus()
    })

    it('não escolhe opção desabilitada', async () => {
      const { user, trigger, onChange } = setup()
      await user.click(trigger)
      await user.click(screen.getByRole('option', { name: 'Organização' }))
      expect(onChange).not.toHaveBeenCalled()
      expect(trigger).toHaveAttribute('aria-expanded', 'true')
    })

    it('passar o mouse destaca a opção (exceto desabilitadas)', async () => {
      const { user, trigger } = setup()
      await user.click(trigger)
      await user.hover(screen.getByRole('option', { name: 'Público' }))
      expect(activeOption(trigger)).toHaveAccessibleName('Público')
      await user.hover(screen.getByRole('option', { name: 'Organização' }))
      expect(activeOption(trigger)).toHaveAccessibleName('Público')
    })

    it('clicar no gatilho aberto fecha; clicar fora fecha sem mudar o valor', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(
        <>
          <Picker label="Visibilidade" options={visibilidade} onChange={onChange} />
          <p>Fora</p>
        </>,
      )
      const trigger = screen.getByRole('combobox')
      await user.click(trigger)
      await user.click(trigger)
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      await user.click(trigger)
      await user.keyboard('{ArrowDown}')
      await user.click(screen.getByText('Fora'))
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      expect(onChange).not.toHaveBeenCalled()
    })

    it('clicar no rótulo foca o gatilho sem abrir a lista', async () => {
      const { user, trigger } = setup()
      await user.click(screen.getByText('Visibilidade'))
      expect(trigger).toHaveFocus()
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
    })
  })

  describe('teclado', () => {
    it.each([
      ['Enter', '{Enter}'],
      ['Espaço', ' '],
      ['↓', '{ArrowDown}'],
      ['↑', '{ArrowUp}'],
      ['Alt+↓', '{Alt>}{ArrowDown}{/Alt}'],
    ])('%s abre a lista na opção escolhida', async (_, keys) => {
      const { user, trigger, onChange } = setup({ defaultValue: 'equipe' })
      trigger.focus()
      await user.keyboard(keys)
      expect(trigger).toHaveAttribute('aria-expanded', 'true')
      expect(activeOption(trigger)).toHaveAccessibleName('Equipe')
      expect(onChange).not.toHaveBeenCalled()
    })

    it('sem escolha, ↓ abre na primeira opção e ↑ na última', async () => {
      const { user, trigger } = setup()
      trigger.focus()
      await user.keyboard('{ArrowDown}')
      expect(activeOption(trigger)).toHaveAccessibleName('Privado')
      await user.keyboard('{Escape}{ArrowUp}')
      expect(activeOption(trigger)).toHaveAccessibleName('Público')
    })

    it('↓/↑ movem sem dar a volta, pulando desabilitadas; Home/End vão às pontas', async () => {
      const { user, trigger } = setup()
      trigger.focus()
      await user.keyboard('{ArrowDown}{ArrowDown}')
      expect(activeOption(trigger)).toHaveAccessibleName('Equipe')
      await user.keyboard('{ArrowDown}')
      // Organização está desabilitada e é pulada.
      expect(activeOption(trigger)).toHaveAccessibleName('Público')
      await user.keyboard('{ArrowDown}')
      expect(activeOption(trigger)).toHaveAccessibleName('Público')
      await user.keyboard('{Home}')
      expect(activeOption(trigger)).toHaveAccessibleName('Privado')
      await user.keyboard('{ArrowUp}')
      expect(activeOption(trigger)).toHaveAccessibleName('Privado')
      await user.keyboard('{End}')
      expect(activeOption(trigger)).toHaveAccessibleName('Público')
    })

    it('Home/End com a lista fechada abrem na primeira/última opção', async () => {
      const { user, trigger } = setup({ defaultValue: 'equipe' })
      trigger.focus()
      await user.keyboard('{End}')
      expect(trigger).toHaveAttribute('aria-expanded', 'true')
      expect(activeOption(trigger)).toHaveAccessibleName('Público')
      await user.keyboard('{Escape}{Home}')
      expect(activeOption(trigger)).toHaveAccessibleName('Privado')
    })

    it('PageDown/PageUp andam 10 opções, pulando desabilitadas', async () => {
      const user = userEvent.setup()
      render(<Picker label="Sprint" options={sprints} />)
      const trigger = screen.getByRole('combobox', { name: 'Sprint' })
      trigger.focus()
      await user.keyboard('{ArrowDown}')
      expect(activeOption(trigger)).toHaveAccessibleName('Sprint 1')
      await user.keyboard('{PageDown}')
      // Sprint 11 está desabilitada: vai para a próxima habilitada.
      expect(activeOption(trigger)).toHaveAccessibleName('Sprint 12')
      await user.keyboard('{PageDown}')
      expect(activeOption(trigger)).toHaveAccessibleName('Sprint 22')
      await user.keyboard('{PageDown}')
      expect(activeOption(trigger)).toHaveAccessibleName('Sprint 25')
      await user.keyboard('{PageUp}')
      expect(activeOption(trigger)).toHaveAccessibleName('Sprint 15')
      await user.keyboard('{PageUp}{PageUp}')
      expect(activeOption(trigger)).toHaveAccessibleName('Sprint 1')
    })

    it('Enter e Espaço escolhem a opção ativa e fecham', async () => {
      const { user, trigger, onChange } = setup()
      trigger.focus()
      await user.keyboard('{ArrowDown}{ArrowDown}{Enter}')
      expect(onChange).toHaveBeenLastCalledWith('equipe')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      expect(trigger).toHaveTextContent('Equipe')
      await user.keyboard(' {End} ')
      expect(onChange).toHaveBeenLastCalledWith('publico')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
    })

    it('Alt+↑ escolhe a opção ativa e fecha', async () => {
      const { user, trigger, onChange } = setup()
      trigger.focus()
      await user.keyboard('{ArrowDown}{ArrowDown}{Alt>}{ArrowUp}{/Alt}')
      expect(onChange).toHaveBeenCalledWith('equipe')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
    })

    it('Escape fecha sem mudar o valor e não chega aos ancestrais', async () => {
      const onParentKeyDown = vi.fn()
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(
        <div onKeyDown={(event) => onParentKeyDown(event.key)}>
          <Picker
            label="Visibilidade"
            options={visibilidade}
            defaultValue="privado"
            onChange={onChange}
          />
        </div>,
      )
      const trigger = screen.getByRole('combobox')
      trigger.focus()
      await user.keyboard('{ArrowDown}{ArrowDown}{Escape}')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      expect(onChange).not.toHaveBeenCalled()
      expect(trigger).toHaveTextContent('Privado')
      expect(onParentKeyDown).not.toHaveBeenCalledWith('Escape')
      // Fechada, o Escape segue adiante (ex.: para fechar um Modal).
      await user.keyboard('{Escape}')
      expect(onParentKeyDown).toHaveBeenCalledWith('Escape')
    })

    it('Tab escolhe a opção ativa, fecha e segue para o próximo campo', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(
        <>
          <Picker label="Visibilidade" options={visibilidade} onChange={onChange} />
          <Button>Salvar</Button>
        </>,
      )
      const trigger = screen.getByRole('combobox')
      trigger.focus()
      await user.keyboard('{End}')
      await user.tab()
      expect(onChange).toHaveBeenCalledWith('publico')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      expect(screen.getByRole('button', { name: 'Salvar' })).toHaveFocus()
    })

    it('perder o foco por outro motivo fecha sem escolher', async () => {
      const { trigger, onChange, user } = setup()
      trigger.focus()
      await user.keyboard('{ArrowDown}{ArrowDown}')
      act(() => trigger.blur())
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('busca por digitação', () => {
    function setupTypeahead(props: Partial<PickerProps> = {}) {
      vi.useFakeTimers()
      const onChange = vi.fn()
      render(<Picker label="Departamento" options={departamentos} onChange={onChange} {...props} />)
      const trigger = screen.getByRole('combobox', { name: 'Departamento' })
      act(() => trigger.focus())
      const type = (text: string) => {
        for (const key of text) fireEvent.keyDown(trigger, { key })
      }
      const wait = (ms: number) => act(() => vi.advanceTimersByTime(ms))
      return { trigger, onChange, type, wait }
    }

    it('aberta: move a opção ativa; a mesma letra percorre as opções, pulando desabilitadas', () => {
      const { trigger, onChange, type, wait } = setupTypeahead()
      fireEvent.keyDown(trigger, { key: 'ArrowDown' })
      expect(activeOption(trigger)).toHaveAccessibleName('Atendimento')
      type('c')
      expect(activeOption(trigger)).toHaveAccessibleName('Comercial')
      type('c')
      expect(activeOption(trigger)).toHaveAccessibleName('Compras')
      // Contabilidade está desabilitada: volta para Comercial.
      type('c')
      expect(activeOption(trigger)).toHaveAccessibleName('Comercial')
      wait(600)
      type('e')
      expect(activeOption(trigger)).toHaveAccessibleName('Engenharia')
      expect(trigger).toHaveAttribute('aria-expanded', 'true')
      expect(onChange).not.toHaveBeenCalled()
    })

    it('várias letras refinam a busca (sem acentos, com espaço) e o buffer expira em 500ms', () => {
      const { trigger, type, wait } = setupTypeahead()
      fireEvent.keyDown(trigger, { key: 'ArrowDown' })
      type('jur')
      expect(activeOption(trigger)).toHaveAccessibleName('Jurídico')
      wait(600)
      type('relacoes i')
      expect(activeOption(trigger)).toHaveAccessibleName('Relações institucionais')
      // O espaço da busca não escolheu nem fechou.
      expect(trigger).toHaveAttribute('aria-expanded', 'true')
      wait(600)
      type('d')
      expect(activeOption(trigger)).toHaveAccessibleName('Design')
    })

    it('fechada: escolhe a próxima correspondência sem abrir (como o select nativo) e anuncia', () => {
      const { trigger, onChange, type, wait } = setupTypeahead({ defaultValue: 'comercial' })
      type('c')
      expect(onChange).toHaveBeenLastCalledWith('compras')
      expect(trigger).toHaveTextContent('Compras')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      expect(screen.getByRole('status')).toHaveTextContent('Compras')
      wait(600)
      type('rec')
      expect(onChange).toHaveBeenLastCalledWith('recursos humanos')
      wait(600)
      type('x')
      expect(onChange).toHaveBeenCalledTimes(2)
    })
  })

  describe('estado controlado', () => {
    it('não controlado usa defaultValue e atualiza sozinho', async () => {
      const { user, trigger } = setup({ defaultValue: 'privado' })
      await user.click(trigger)
      await user.click(screen.getByRole('option', { name: 'Equipe' }))
      expect(trigger).toHaveTextContent('Equipe')
    })

    it('controlado só muda quando o pai atualiza value', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      const { rerender } = render(
        <Picker label="Visibilidade" options={visibilidade} value="privado" onChange={onChange} />,
      )
      const trigger = screen.getByRole('combobox')
      await user.click(trigger)
      await user.click(screen.getByRole('option', { name: 'Equipe' }))
      expect(onChange).toHaveBeenCalledWith('equipe')
      expect(trigger).toHaveTextContent('Privado')
      rerender(
        <Picker label="Visibilidade" options={visibilidade} value={null} onChange={onChange} />,
      )
      expect(trigger).toHaveTextContent('Selecione…')
    })

    it('open/onOpenChange controlam a lista; defaultOpen abre na montagem', async () => {
      const user = userEvent.setup()
      function Controlled() {
        const [open, setOpen] = useState(true)
        return (
          <>
            <Picker
              label="Visibilidade"
              options={visibilidade}
              open={open}
              onOpenChange={setOpen}
            />
            <span data-testid="estado">{open ? 'aberta' : 'fechada'}</span>
          </>
        )
      }
      render(<Controlled />)
      const trigger = screen.getByRole('combobox')
      expect(await screen.findByRole('listbox')).toBeInTheDocument()
      trigger.focus()
      await user.keyboard('{Escape}')
      expect(screen.getByTestId('estado')).toHaveTextContent('fechada')
      await user.keyboard('{ArrowDown}')
      expect(screen.getByTestId('estado')).toHaveTextContent('aberta')
    })

    it('ignora a abertura quando o pai mantém open={false}', async () => {
      const user = userEvent.setup()
      const onOpenChange = vi.fn()
      render(
        <Picker
          label="Visibilidade"
          options={visibilidade}
          open={false}
          onOpenChange={onOpenChange}
        />,
      )
      const trigger = screen.getByRole('combobox')
      await user.click(trigger)
      expect(onOpenChange).toHaveBeenCalledWith(true)
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })
  })

  describe('desabilitado', () => {
    it('sai da ordem de Tab, não abre e não envia o valor', async () => {
      const user = userEvent.setup()
      const { container } = render(
        <Picker
          label="Visibilidade"
          options={visibilidade}
          defaultValue="equipe"
          name="visibilidade"
          disabled
        />,
      )
      const trigger = screen.getByRole('combobox', { name: 'Visibilidade' })
      expect(trigger).not.toHaveAttribute('tabindex')
      expect(trigger).toHaveAttribute('aria-disabled', 'true')
      await user.click(trigger)
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      fireEvent.keyDown(trigger, { key: 'ArrowDown' })
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      expect(container.querySelector('input[name="visibilidade"]')).toBeDisabled()
    })
  })

  describe('formulário', () => {
    it('name renderiza um input oculto com o valor (vazio sem escolha)', async () => {
      const user = userEvent.setup()
      const { container } = render(
        <Picker label="Visibilidade" options={visibilidade} name="visibilidade" />,
      )
      const input = container.querySelector<HTMLInputElement>('input[type="hidden"]')!
      expect(input).toHaveAttribute('name', 'visibilidade')
      expect(input.value).toBe('')
      await user.click(screen.getByRole('combobox'))
      await user.click(screen.getByRole('option', { name: 'Equipe' }))
      expect(input.value).toBe('equipe')
    })

    it('Form valida, o resumo foca o gatilho e o erro some ao escolher', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(
        <Form
          aria-label="Novo projeto"
          validate={(values) => ({
            regiao: values.regiao ? undefined : 'Escolha a região dos dados.',
          })}
          onSubmit={onSubmit}
        >
          {({ errors }) => (
            <>
              <Picker
                label="Região"
                name="regiao"
                options={regioes}
                required
                error={errors.regiao}
              />
              <Button type="submit">Criar projeto</Button>
            </>
          )}
        </Form>,
      )
      await user.click(screen.getByRole('button', { name: 'Criar projeto' }))
      expect(onSubmit).not.toHaveBeenCalled()
      const trigger = screen.getByRole('combobox', { name: 'Região' })
      expect(trigger).toHaveAttribute('aria-invalid', 'true')
      expect(trigger).toHaveAccessibleDescription('Escolha a região dos dados.')
      await user.click(screen.getByRole('link', { name: 'Escolha a região dos dados.' }))
      expect(trigger).toHaveFocus()
      await user.keyboard('{ArrowDown}')
      await user.click(screen.getByRole('option', { name: 'Oregon' }))
      expect(trigger).not.toHaveAttribute('aria-invalid')
      await user.click(screen.getByRole('button', { name: 'Criar projeto' }))
      expect(onSubmit).toHaveBeenCalledTimes(1)
      expect(onSubmit.mock.calls[0][0]).toEqual({ regiao: 'us-west-2' })
    })

    it('o reset do formulário volta ao defaultValue', async () => {
      const user = userEvent.setup()
      const { container } = render(
        <form aria-label="Preferências">
          <Picker
            label="Visibilidade"
            options={visibilidade}
            name="visibilidade"
            defaultValue="privado"
          />
          <button type="reset">Desfazer</button>
        </form>,
      )
      const trigger = screen.getByRole('combobox')
      await user.click(trigger)
      await user.click(screen.getByRole('option', { name: 'Público' }))
      expect(trigger).toHaveTextContent('Público')
      await user.click(screen.getByRole('button', { name: 'Desfazer' }))
      await waitFor(() => expect(trigger).toHaveTextContent('Privado'))
      expect(container.querySelector<HTMLInputElement>('input[name="visibilidade"]')!.value).toBe(
        'privado',
      )
    })
  })

  describe('Field e API', () => {
    it('liga descrição e erro, marca inválido e obrigatório', () => {
      render(
        <Picker
          label="Visibilidade"
          options={visibilidade}
          description="Você pode mudar depois."
          error="Escolha quem pode ver o projeto."
          required
        />,
      )
      const trigger = screen.getByRole('combobox', { name: 'Visibilidade' })
      expect(trigger).toHaveAccessibleDescription(
        'Você pode mudar depois. Escolha quem pode ver o projeto.',
      )
      expect(trigger).toHaveAttribute('aria-invalid', 'true')
      expect(trigger).toHaveAttribute('aria-required', 'true')
      expect(trigger).toHaveAttribute('data-invalid')
    })

    it('invalid marca o campo sem mensagem; optional aparece no rótulo', () => {
      render(<Picker label="Visibilidade" options={visibilidade} invalid optional />)
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true')
      expect(screen.getByText('(opcional)')).toBeInTheDocument()
    })

    it('treme uma vez quando o erro surge', () => {
      const { rerender } = render(<Picker label="Visibilidade" options={visibilidade} />)
      const trigger = screen.getByRole('combobox')
      expect(trigger).not.toHaveClass('or-forms-shake')
      rerender(<Picker label="Visibilidade" options={visibilidade} error="Obrigatório." />)
      expect(trigger).toHaveClass('or-forms-shake')
      const event = new Event('animationend', { bubbles: true })
      Object.defineProperty(event, 'animationName', { value: 'or-shake' })
      act(() => {
        trigger.dispatchEvent(event)
      })
      expect(trigger).not.toHaveClass('or-forms-shake')
    })

    it('aceita aria-label sem rótulo visível (gatilho e lista)', async () => {
      const user = userEvent.setup()
      render(<Picker aria-label="Região do projeto" options={regioes} />)
      const trigger = screen.getByRole('combobox', { name: 'Região do projeto' })
      await user.click(trigger)
      expect(screen.getByRole('listbox', { name: 'Região do projeto' })).toBeInTheDocument()
    })

    it('repassa ref, id, ...rest e tamanho ao gatilho; className vai para o campo', () => {
      const ref = createRef<HTMLDivElement>()
      const { container } = render(
        <Picker
          ref={ref}
          id="visibilidade-projeto"
          label="Visibilidade"
          options={visibilidade}
          size="lg"
          className="extra"
          data-testid="gatilho"
        />,
      )
      const trigger = screen.getByTestId('gatilho')
      expect(ref.current).toBe(trigger)
      expect(trigger).toHaveAttribute('id', 'visibilidade-projeto')
      expect(trigger).toHaveAttribute('role', 'combobox')
      expect(trigger).toHaveClass('or-control-frame', 'or-control-frame--lg', 'or-picker--lg')
      expect(container.firstElementChild).toHaveClass('or-field', 'or-picker-field', 'extra')
    })

    it('rola só a lista para manter a opção ativa visível', async () => {
      const user = userEvent.setup()
      render(<Picker label="Sprint" options={sprints} />)
      const trigger = screen.getByRole('combobox')
      trigger.focus()
      await user.keyboard('{ArrowDown}')
      const listbox = screen.getByRole('listbox')
      const ROW = 36
      const rect = (top: number, height: number) =>
        ({ top, bottom: top + height, left: 0, right: 200, width: 200, height }) as DOMRect
      vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
        this: HTMLElement,
      ) {
        if (this === listbox) return rect(0, 200)
        const index = Number(this.id.split('-option-')[1])
        return Number.isNaN(index) ? rect(0, 0) : rect(index * ROW - listbox.scrollTop, ROW)
      })
      await user.keyboard('{End}')
      // A última opção (índice 24) termina em 25 × 36 = 900px: a lista rola 700px.
      expect(listbox.scrollTop).toBe(700)
      await user.keyboard('{Home}')
      expect(listbox.scrollTop).toBe(0)
    })
  })

  describe('abertura na última opção', () => {
    it('revela a opção ativa também quando a lista ganha a altura final (movimento reduzido)', async () => {
      // Com movimento reduzido, a altura final do popup chega um quadro depois do quadro em que
      // a abertura revela a opção: a lista revela de novo quando muda de tamanho.
      const observers: { targets: Element[]; callback: () => void }[] = []
      vi.stubGlobal(
        'ResizeObserver',
        class {
          targets: Element[] = []
          constructor(callback: () => void) {
            observers.push({ targets: this.targets, callback })
          }
          observe(target: Element) {
            this.targets.push(target)
          }
          unobserve() {}
          disconnect() {}
        },
      )
      try {
        const user = userEvent.setup()
        render(<Picker label="Sprint" options={sprints} />)
        const trigger = screen.getByRole('combobox')
        trigger.focus()
        await user.keyboard('{End}')
        const listbox = screen.getByRole('listbox')
        // Só agora a lista tem 200px de altura (antes, sem altura, não havia o que rolar).
        const ROW = 36
        const rect = (top: number, height: number) =>
          ({ top, bottom: top + height, left: 0, right: 200, width: 200, height }) as DOMRect
        vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
          this: HTMLElement,
        ) {
          if (this === listbox) return rect(0, 200)
          const index = Number(this.id.split('-option-')[1])
          return Number.isNaN(index) ? rect(0, 0) : rect(index * ROW - listbox.scrollTop, ROW)
        })
        act(() => observers.filter((o) => o.targets.includes(listbox)).forEach((o) => o.callback()))
        // A última opção (índice 24) termina em 25 × 36 = 900px: a lista rola 700px.
        expect(listbox.scrollTop).toBe(700)
      } finally {
        vi.unstubAllGlobals()
        vi.restoreAllMocks()
      }
    })
  })

  describe('acessibilidade', () => {
    it('não possui violações (fechado, com valor e descrição)', async () => {
      const { container } = render(
        <Picker
          label="Visibilidade"
          description="Quem pode ver o projeto."
          options={visibilidade}
          defaultValue="equipe"
          name="visibilidade"
        />,
      )
      await expectNoA11yViolations(container)
    })

    it('não possui violações (aberto, com grupos, desabilitadas e opção ativa)', async () => {
      const user = userEvent.setup()
      render(<Picker label="Região" options={regioes} defaultValue="us-east-1" />)
      await user.click(screen.getByRole('combobox'))
      await expectNoA11yViolations(document.body)
    })

    it('não possui violações (erro e desabilitado)', async () => {
      const { container } = render(
        <div>
          <Picker label="Visibilidade" options={visibilidade} error="Obrigatório." required />
          <Picker label="Região" options={regioes} disabled />
        </div>,
      )
      await expectNoA11yViolations(container)
    })
  })
})
