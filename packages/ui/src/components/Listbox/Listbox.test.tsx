import { act, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { Button } from '../Button'
import { Form } from '../Form'
import {
  Listbox,
  ListboxGroup,
  ListboxOption,
  type ListboxItemGroup,
  type ListboxMultipleProps,
  type ListboxSingleProps,
} from './Listbox'

/** jsdom não tem AnimationEvent: dispara um animationend com o nome informado. */
function endAnimation(element: Element, animationName: string) {
  const event = new Event('animationend', { bubbles: true })
  Object.defineProperty(event, 'animationName', { value: animationName })
  act(() => {
    element.dispatchEvent(event)
  })
}

/** Opção apontada por aria-activedescendant. */
function activeOption(listbox: HTMLElement) {
  const id = listbox.getAttribute('aria-activedescendant')
  return id ? document.getElementById(id) : null
}

function selectedNames(listbox: HTMLElement) {
  return within(listbox)
    .getAllByRole('option')
    .filter((option) => option.getAttribute('aria-selected') === 'true')
    .map((option) => option.querySelector('.or-listbox-option__label')?.textContent)
}

function PlanList(props: Partial<ListboxSingleProps>) {
  return (
    <Listbox label="Plano" {...props}>
      <ListboxOption value="gratuito" description="Até 3 projetos">
        Gratuito
      </ListboxOption>
      <ListboxOption value="essencial" description="Até 20 projetos">
        Essencial
      </ListboxOption>
      <ListboxOption value="profissional">Profissional</ListboxOption>
      <ListboxOption value="empresarial" disabled>
        Empresarial
      </ListboxOption>
      <ListboxOption value="parceiro">Parceiro</ListboxOption>
    </Listbox>
  )
}

const categoryValues = ['hortifruti', 'padaria', 'laticinios', 'bebidas', 'limpeza', 'pet']

function CategoryList(props: Partial<ListboxMultipleProps>) {
  return (
    <Listbox label="Categorias" selectionMode="multiple" {...props}>
      <ListboxOption value="hortifruti">Hortifrúti</ListboxOption>
      <ListboxOption value="padaria">Padaria</ListboxOption>
      <ListboxOption value="laticinios">Laticínios</ListboxOption>
      <ListboxOption value="bebidas" disabled>
        Bebidas
      </ListboxOption>
      <ListboxOption value="limpeza">Limpeza</ListboxOption>
      <ListboxOption value="pet">Pet</ListboxOption>
    </Listbox>
  )
}

const typeaheadOptions = ['Cafés', 'Carnes', 'Cereais', 'Chás', 'Doces', 'Pão de forma', 'Pão de queijo', 'Peixes']

function TypeaheadList(props: Partial<ListboxSingleProps>) {
  return (
    <Listbox label="Seção" {...props}>
      {typeaheadOptions.map((label) => (
        <ListboxOption key={label} value={label}>
          {label}
        </ListboxOption>
      ))}
    </Listbox>
  )
}

afterEach(() => {
  vi.useRealTimers()
})

describe('Listbox', () => {
  describe('papéis e estados', () => {
    it('renderiza um listbox nomeado pelo rótulo, focável e de seleção única', () => {
      const ref = createRef<HTMLDivElement>()
      render(
        <>
          <PlanList />
          <Listbox ref={ref} aria-label="Outra">
            <ListboxOption value="a">A</ListboxOption>
          </Listbox>
        </>,
      )
      expect(screen.getByRole('listbox', { name: 'Outra' })).toBe(ref.current)
      const listbox = screen.getByRole('listbox', { name: 'Plano' })
      expect(listbox).toHaveAttribute('tabindex', '0')
      expect(listbox).toHaveAttribute('aria-multiselectable', 'false')
      expect(listbox).toHaveAttribute('aria-orientation', 'vertical')
      expect(listbox).not.toHaveAttribute('aria-activedescendant')
      const options = within(listbox).getAllByRole('option')
      expect(options).toHaveLength(5)
      options.forEach((option) => expect(option).toHaveAttribute('aria-selected', 'false'))
      expect(screen.getByRole('option', { name: 'Empresarial' })).toHaveAttribute('aria-disabled', 'true')
    })

    it('liga a descrição da opção com aria-describedby e usa só o rótulo como nome', () => {
      render(<PlanList />)
      const option = screen.getByRole('option', { name: 'Gratuito' })
      expect(option).toHaveAccessibleDescription('Até 3 projetos')
      expect(screen.getByRole('option', { name: 'Profissional' })).not.toHaveAttribute('aria-describedby')
    })

    it('modo múltiplo expõe aria-multiselectable e aria-selected em todas as opções', () => {
      render(<CategoryList defaultValue={['padaria', 'pet']} />)
      const listbox = screen.getByRole('listbox', { name: 'Categorias' })
      expect(listbox).toHaveAttribute('aria-multiselectable', 'true')
      expect(selectedNames(listbox)).toEqual(['Padaria', 'Pet'])
      within(listbox)
        .getAllByRole('option')
        .forEach((option) => expect(option).toHaveAttribute('aria-selected'))
    })

    it('agrupa opções em role="group" nomeado pelo título', () => {
      render(
        <Listbox label="Categorias" selectionMode="multiple">
          <ListboxGroup label="Alimentos">
            <ListboxOption value="padaria">Padaria</ListboxOption>
            <ListboxOption value="hortifruti">Hortifrúti</ListboxOption>
          </ListboxGroup>
          <ListboxGroup label="Casa">
            <ListboxOption value="limpeza">Limpeza</ListboxOption>
          </ListboxGroup>
        </Listbox>,
      )
      const food = screen.getByRole('group', { name: 'Alimentos' })
      expect(within(food).getAllByRole('option')).toHaveLength(2)
      expect(within(screen.getByRole('group', { name: 'Casa' })).getByRole('option', { name: 'Limpeza' })).toBeInTheDocument()
    })

    it('gera opções e grupos a partir da prop options', () => {
      const options: ListboxItemGroup[] = [
        { label: 'Sudeste', options: [{ value: 'sp', label: 'São Paulo', description: 'CD Cajamar' }] },
        { label: 'Sul', options: [{ value: 'rs', label: 'Rio Grande do Sul', disabled: true }] },
      ]
      render(<Listbox label="Região" options={options} />)
      expect(screen.getByRole('group', { name: 'Sudeste' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'São Paulo' })).toHaveAccessibleDescription('CD Cajamar')
      expect(screen.getByRole('option', { name: 'Rio Grande do Sul' })).toHaveAttribute('aria-disabled', 'true')
    })

    it('ListboxOption fora de um Listbox lança um erro claro', () => {
      vi.spyOn(console, 'error').mockImplementation(() => {})
      expect(() => render(<ListboxOption value="x">X</ListboxOption>)).toThrow(/dentro de <Listbox>/)
    })
  })

  describe('foco (aria-activedescendant)', () => {
    it('ao receber foco sem seleção, a primeira opção fica ativa e o foco permanece no listbox', async () => {
      const user = userEvent.setup()
      render(<PlanList />)
      await user.tab()
      const listbox = screen.getByRole('listbox')
      expect(listbox).toHaveFocus()
      expect(activeOption(listbox)).toBe(screen.getByRole('option', { name: 'Gratuito' }))
      expect(activeOption(listbox)).toHaveAttribute('data-active')
    })

    it('ao receber foco com seleção, a opção selecionada fica ativa', async () => {
      const user = userEvent.setup()
      render(<PlanList defaultValue="profissional" />)
      await user.tab()
      expect(activeOption(screen.getByRole('listbox'))).toBe(screen.getByRole('option', { name: 'Profissional' }))
    })

    it('modo múltiplo: a primeira opção selecionada fica ativa', async () => {
      const user = userEvent.setup()
      render(<CategoryList defaultValue={['pet', 'laticinios']} />)
      await user.tab()
      expect(activeOption(screen.getByRole('listbox'))).toBe(screen.getByRole('option', { name: 'Laticínios' }))
    })

    it('ao perder o foco, remove a opção ativa', async () => {
      const user = userEvent.setup()
      render(
        <>
          <PlanList />
          <button type="button">Depois</button>
        </>,
      )
      await user.tab()
      await user.tab()
      expect(screen.getByRole('listbox')).not.toHaveAttribute('aria-activedescendant')
      expect(document.querySelector('[data-active]')).toBeNull()
    })

    it('clicar no rótulo foca a lista', async () => {
      const user = userEvent.setup()
      render(<PlanList />)
      await user.click(screen.getByText('Plano'))
      expect(screen.getByRole('listbox')).toHaveFocus()
    })
  })

  describe('teclado', () => {
    it('↓/↑ movem a opção ativa sem dar a volta; Home/End vão às pontas', async () => {
      const user = userEvent.setup()
      render(<PlanList />)
      await user.tab()
      const listbox = screen.getByRole('listbox')
      await user.keyboard('{ArrowDown}')
      expect(activeOption(listbox)).toHaveAccessibleName('Essencial')
      await user.keyboard('{ArrowUp}{ArrowUp}')
      expect(activeOption(listbox)).toHaveAccessibleName('Gratuito')
      await user.keyboard('{End}')
      expect(activeOption(listbox)).toHaveAccessibleName('Parceiro')
      await user.keyboard('{ArrowDown}')
      expect(activeOption(listbox)).toHaveAccessibleName('Parceiro')
      await user.keyboard('{Home}')
      expect(activeOption(listbox)).toHaveAccessibleName('Gratuito')
    })

    it('opções desabilitadas são focáveis, mas não selecionáveis', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<PlanList onChange={onChange} />)
      await user.tab()
      await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}')
      const listbox = screen.getByRole('listbox')
      expect(activeOption(listbox)).toHaveAccessibleName('Empresarial')
      await user.keyboard(' ')
      await user.keyboard('{Enter}')
      expect(onChange).not.toHaveBeenCalled()
      expect(screen.getByRole('option', { name: 'Empresarial' })).toHaveAttribute('aria-selected', 'false')
    })

    it('seleção única: Espaço e Enter selecionam a opção ativa', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<PlanList onChange={onChange} />)
      await user.tab()
      await user.keyboard('{ArrowDown} ')
      expect(onChange).toHaveBeenLastCalledWith('essencial')
      expect(screen.getByRole('option', { name: 'Essencial' })).toHaveAttribute('aria-selected', 'true')
      await user.keyboard('{ArrowDown}{Enter}')
      expect(onChange).toHaveBeenLastCalledWith('profissional')
      expect(screen.getByRole('option', { name: 'Essencial' })).toHaveAttribute('aria-selected', 'false')
      // Navegar sem selecionar não muda a seleção.
      await user.keyboard('{ArrowUp}')
      expect(onChange).toHaveBeenCalledTimes(2)
    })

    it('seleção única com selectionFollowsFocus: as setas selecionam, pulando a seleção de desabilitadas', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<PlanList selectionFollowsFocus onChange={onChange} />)
      await user.tab()
      expect(onChange).not.toHaveBeenCalled()
      await user.keyboard('{ArrowDown}')
      expect(onChange).toHaveBeenLastCalledWith('essencial')
      await user.keyboard('{ArrowDown}{ArrowDown}')
      // Empresarial (desabilitada) fica ativa, mas a seleção continua em Profissional.
      expect(onChange).toHaveBeenLastCalledWith('profissional')
      expect(screen.getByRole('option', { name: 'Profissional' })).toHaveAttribute('aria-selected', 'true')
      await user.keyboard('{End}')
      expect(onChange).toHaveBeenLastCalledWith('parceiro')
    })

    it('orientação horizontal usa ←/→ e ignora ↑/↓', async () => {
      const user = userEvent.setup()
      render(<PlanList orientation="horizontal" />)
      await user.tab()
      const listbox = screen.getByRole('listbox')
      expect(listbox).toHaveAttribute('aria-orientation', 'horizontal')
      await user.keyboard('{ArrowDown}')
      expect(activeOption(listbox)).toHaveAccessibleName('Gratuito')
      await user.keyboard('{ArrowRight}{ArrowRight}')
      expect(activeOption(listbox)).toHaveAccessibleName('Profissional')
      await user.keyboard('{ArrowLeft}')
      expect(activeOption(listbox)).toHaveAccessibleName('Essencial')
    })

    // Digitação com relógio falso: fireEvent é síncrono (o user-event espera timers reais).
    function setupTypeahead(props: Partial<ListboxSingleProps> = {}) {
      vi.useFakeTimers()
      render(<TypeaheadList {...props} />)
      const listbox = screen.getByRole('listbox')
      act(() => listbox.focus())
      const type = (text: string) => {
        for (const key of text) fireEvent.keyDown(listbox, { key })
      }
      const wait = (ms: number) => act(() => vi.advanceTimersByTime(ms))
      return { listbox, type, wait }
    }

    it('digitação: uma letra vai para a próxima opção que começa com ela e repetir percorre as opções', () => {
      const { listbox, type, wait } = setupTypeahead()
      expect(activeOption(listbox)).toHaveAccessibleName('Cafés')
      type('c')
      // Começa na próxima: Cafés está ativa, então vai para Carnes.
      expect(activeOption(listbox)).toHaveAccessibleName('Carnes')
      type('c')
      expect(activeOption(listbox)).toHaveAccessibleName('Cereais')
      type('c')
      expect(activeOption(listbox)).toHaveAccessibleName('Chás')
      wait(600)
      type('d')
      expect(activeOption(listbox)).toHaveAccessibleName('Doces')
    })

    it('digitação: várias letras em sequência refinam a busca (sem acentos, com espaço) e o buffer expira em 500ms', () => {
      const { listbox, type, wait } = setupTypeahead()
      type('cha')
      expect(activeOption(listbox)).toHaveAccessibleName('Chás')
      wait(600)
      type('pao de q')
      expect(activeOption(listbox)).toHaveAccessibleName('Pão de queijo')
      // O espaço da busca não selecionou nada.
      expect(selectedNames(listbox)).toEqual([])
      // Ainda dentro do tempo limite, a busca continua ("pao de qu").
      wait(400)
      type('u')
      expect(activeOption(listbox)).toHaveAccessibleName('Pão de queijo')
      wait(500)
      // Depois do tempo limite, a busca recomeça: "p" vai para a próxima com P.
      type('p')
      expect(activeOption(listbox)).toHaveAccessibleName('Peixes')
    })

    it('digitação com selectionFollowsFocus seleciona a opção encontrada', () => {
      const onChange = vi.fn()
      const { type } = setupTypeahead({ selectionFollowsFocus: true, onChange })
      type('do')
      expect(onChange).toHaveBeenLastCalledWith('Doces')
    })

    describe('seleção múltipla', () => {
      it('Espaço alterna a opção ativa; as setas só movem o foco', async () => {
        const user = userEvent.setup()
        const onChange = vi.fn()
        render(<CategoryList onChange={onChange} />)
        await user.tab()
        const listbox = screen.getByRole('listbox')
        await user.keyboard(' ')
        expect(onChange).toHaveBeenLastCalledWith(['hortifruti'])
        await user.keyboard('{ArrowDown}{ArrowDown}')
        expect(onChange).toHaveBeenCalledTimes(1)
        await user.keyboard(' ')
        expect(onChange).toHaveBeenLastCalledWith(['hortifruti', 'laticinios'])
        await user.keyboard('{ArrowUp}{ArrowUp} ')
        expect(onChange).toHaveBeenLastCalledWith(['laticinios'])
        expect(selectedNames(listbox)).toEqual(['Laticínios'])
      })

      it('Shift+↓/↑ estendem a seleção a partir da âncora (e voltar encolhe a faixa)', async () => {
        const user = userEvent.setup()
        const onChange = vi.fn()
        render(<CategoryList onChange={onChange} />)
        await user.tab()
        const listbox = screen.getByRole('listbox')
        await user.keyboard('{Shift>}{ArrowDown}{ArrowDown}{/Shift}')
        expect(onChange).toHaveBeenLastCalledWith(['hortifruti', 'padaria', 'laticinios'])
        expect(activeOption(listbox)).toHaveAccessibleName('Laticínios')
        await user.keyboard('{Shift>}{ArrowUp}{/Shift}')
        expect(onChange).toHaveBeenLastCalledWith(['hortifruti', 'padaria'])
        // A faixa passa pela opção desabilitada sem selecioná-la.
        await user.keyboard('{Shift>}{ArrowDown}{ArrowDown}{ArrowDown}{/Shift}')
        expect(onChange).toHaveBeenLastCalledWith(['hortifruti', 'padaria', 'laticinios', 'limpeza'])
        expect(selectedNames(listbox)).toEqual(['Hortifrúti', 'Padaria', 'Laticínios', 'Limpeza'])
      })

      it('Shift+↓ depois de navegar começa uma nova faixa e mantém a seleção anterior', async () => {
        const user = userEvent.setup()
        const onChange = vi.fn()
        render(<CategoryList onChange={onChange} />)
        await user.tab()
        await user.keyboard(' ')
        await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}')
        await user.keyboard('{Shift>}{ArrowDown}{/Shift}')
        expect(onChange).toHaveBeenLastCalledWith(['hortifruti', 'limpeza', 'pet'])
      })

      it('Shift+Espaço seleciona a faixa contígua da última opção marcada até a ativa', async () => {
        const user = userEvent.setup()
        const onChange = vi.fn()
        render(<CategoryList onChange={onChange} />)
        await user.tab()
        await user.keyboard('{ArrowDown} ')
        expect(onChange).toHaveBeenLastCalledWith(['padaria'])
        await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{Shift>} {/Shift}')
        expect(onChange).toHaveBeenLastCalledWith(['padaria', 'laticinios', 'limpeza'])
        expect(await screen.findByText('3 itens selecionados')).toBeInTheDocument()
      })

      it('Ctrl+A seleciona todas as habilitadas; de novo, desmarca todas', async () => {
        const user = userEvent.setup()
        const onChange = vi.fn()
        render(<CategoryList onChange={onChange} />)
        await user.tab()
        await user.keyboard('{Control>}a{/Control}')
        expect(onChange).toHaveBeenLastCalledWith(categoryValues.filter((v) => v !== 'bebidas'))
        expect(screen.getByRole('status')).toHaveTextContent('5 itens selecionados')
        await user.keyboard('{Control>}a{/Control}')
        expect(onChange).toHaveBeenLastCalledWith([])
        expect(screen.getByRole('status')).toHaveTextContent('Nenhum item selecionado')
      })

      it('Cmd+A (meta) também seleciona tudo', async () => {
        const user = userEvent.setup()
        const onChange = vi.fn()
        render(<CategoryList onChange={onChange} />)
        await user.tab()
        await user.keyboard('{Meta>}a{/Meta}')
        expect(onChange).toHaveBeenLastCalledWith(categoryValues.filter((v) => v !== 'bebidas'))
      })

      it('Ctrl+Shift+Home/End selecionam da opção ativa até as pontas e movem o foco', async () => {
        const user = userEvent.setup()
        const onChange = vi.fn()
        render(<CategoryList onChange={onChange} />)
        await user.tab()
        const listbox = screen.getByRole('listbox')
        await user.keyboard('{ArrowDown}{ArrowDown}{Control>}{Shift>}{End}{/Shift}{/Control}')
        expect(onChange).toHaveBeenLastCalledWith(['laticinios', 'limpeza', 'pet'])
        expect(activeOption(listbox)).toHaveAccessibleName('Pet')
        await user.keyboard('{ArrowUp}{ArrowUp}{ArrowUp}{ArrowUp}')
        expect(activeOption(listbox)).toHaveAccessibleName('Padaria')
        await user.keyboard('{Control>}{Shift>}{Home}{/Shift}{/Control}')
        expect(onChange).toHaveBeenLastCalledWith(['hortifruti', 'padaria', 'laticinios', 'limpeza', 'pet'])
        expect(activeOption(listbox)).toHaveAccessibleName('Hortifrúti')
      })

      it('Ctrl+A no modo único não faz nada', async () => {
        const user = userEvent.setup()
        const onChange = vi.fn()
        render(<PlanList onChange={onChange} />)
        await user.tab()
        await user.keyboard('{Control>}a{/Control}')
        expect(onChange).not.toHaveBeenCalled()
      })
    })
  })

  describe('ponteiro', () => {
    it('seleção única: clicar seleciona e torna a opção ativa', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<PlanList onChange={onChange} />)
      await user.click(screen.getByRole('option', { name: 'Profissional' }))
      const listbox = screen.getByRole('listbox')
      expect(onChange).toHaveBeenLastCalledWith('profissional')
      expect(listbox).toHaveFocus()
      expect(activeOption(listbox)).toHaveAccessibleName('Profissional')
      // Clicar na descrição também seleciona a opção.
      await user.click(screen.getByText('Até 20 projetos'))
      expect(onChange).toHaveBeenLastCalledWith('essencial')
    })

    it('clicar numa opção desabilitada a torna ativa sem selecionar', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<PlanList onChange={onChange} />)
      await user.click(screen.getByRole('option', { name: 'Empresarial' }))
      expect(onChange).not.toHaveBeenCalled()
      expect(activeOption(screen.getByRole('listbox'))).toHaveAccessibleName('Empresarial')
    })

    it('seleção múltipla: clicar alterna e Shift+clique seleciona a faixa', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<CategoryList onChange={onChange} />)
      await user.click(screen.getByRole('option', { name: 'Padaria' }))
      expect(onChange).toHaveBeenLastCalledWith(['padaria'])
      await user.keyboard('{Shift>}')
      await user.click(screen.getByRole('option', { name: 'Pet' }))
      await user.keyboard('{/Shift}')
      expect(onChange).toHaveBeenLastCalledWith(['padaria', 'laticinios', 'limpeza', 'pet'])
      // Shift+clique de novo ajusta a mesma faixa (encolhe).
      await user.keyboard('{Shift>}')
      await user.click(screen.getByRole('option', { name: 'Laticínios' }))
      await user.keyboard('{/Shift}')
      expect(onChange).toHaveBeenLastCalledWith(['padaria', 'laticinios'])
      await user.click(screen.getByRole('option', { name: 'Padaria' }))
      expect(onChange).toHaveBeenLastCalledWith(['laticinios'])
    })

    it('lista desabilitada: fora da ordem de Tab e ignora cliques', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<PlanList disabled onChange={onChange} name="plano" defaultValue="gratuito" />)
      const listbox = screen.getByRole('listbox')
      expect(listbox).toHaveAttribute('aria-disabled', 'true')
      expect(listbox).not.toHaveAttribute('tabindex')
      await user.click(screen.getByRole('option', { name: 'Essencial' }))
      expect(onChange).not.toHaveBeenCalled()
      expect(document.querySelector('input[name="plano"]')).toBeDisabled()
    })
  })

  describe('estado controlado e não controlado', () => {
    it('não controlado usa defaultValue e atualiza sozinho', async () => {
      const user = userEvent.setup()
      render(<PlanList defaultValue="gratuito" />)
      expect(screen.getByRole('option', { name: 'Gratuito' })).toHaveAttribute('aria-selected', 'true')
      await user.click(screen.getByRole('option', { name: 'Parceiro' }))
      expect(screen.getByRole('option', { name: 'Parceiro' })).toHaveAttribute('aria-selected', 'true')
      expect(screen.getByRole('option', { name: 'Gratuito' })).toHaveAttribute('aria-selected', 'false')
    })

    it('controlado só muda quando o pai atualiza value', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      const { rerender } = render(<PlanList value="gratuito" onChange={onChange} />)
      await user.click(screen.getByRole('option', { name: 'Essencial' }))
      expect(onChange).toHaveBeenLastCalledWith('essencial')
      expect(screen.getByRole('option', { name: 'Gratuito' })).toHaveAttribute('aria-selected', 'true')
      rerender(<PlanList value={null} onChange={onChange} />)
      expect(selectedNames(screen.getByRole('listbox'))).toEqual([])
    })

    it('controlado (múltiplo) com estado no pai', async () => {
      const user = userEvent.setup()
      function Controlled() {
        const [value, setValue] = useState<string[]>(['pet'])
        return (
          <>
            <CategoryList value={value} onChange={setValue} />
            <output>{value.join(', ')}</output>
          </>
        )
      }
      render(<Controlled />)
      await user.click(screen.getByRole('option', { name: 'Hortifrúti' }))
      // Os valores saem na ordem das opções, não na ordem dos cliques.
      expect(document.querySelector('output')).toHaveTextContent('hortifruti, pet')
      expect(screen.getByRole('option', { name: 'Hortifrúti' })).toHaveAttribute('aria-selected', 'true')
    })
  })

  describe('formulário', () => {
    it('name renderiza um input oculto por valor selecionado', async () => {
      const user = userEvent.setup()
      const { container } = render(<CategoryList name="categorias" defaultValue={['padaria', 'pet']} />)
      const inputs = () =>
        Array.from(container.querySelectorAll<HTMLInputElement>('input[type="hidden"][name="categorias"]:not(:disabled)'))
      expect(inputs().map((input) => input.value)).toEqual(['padaria', 'pet'])
      await user.click(screen.getByRole('option', { name: 'Padaria' }))
      await user.click(screen.getByRole('option', { name: 'Pet' }))
      expect(inputs()).toHaveLength(0)
      // Sem seleção, fica só um marcador desabilitado (não enviado) para o Form achar o campo.
      expect(container.querySelector('input[name="categorias"]')).toBeDisabled()
    })

    it('Form recebe os valores no envio', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(
        <Form aria-label="Assinatura" onSubmit={onSubmit}>
          <PlanList name="plano" defaultValue="essencial" />
          <CategoryList name="categorias" defaultValue={['padaria', 'limpeza']} />
          <Listbox label="Extras" name="extras" selectionMode="multiple">
            <ListboxOption value="suporte">Suporte prioritário</ListboxOption>
          </Listbox>
          <Button type="submit">Assinar</Button>
        </Form>,
      )
      await user.click(screen.getByRole('button', { name: 'Assinar' }))
      expect(onSubmit).toHaveBeenCalledTimes(1)
      expect(onSubmit.mock.calls[0][0]).toEqual({ plano: 'essencial', categorias: ['padaria', 'limpeza'] })
    })

    it('Form com validação: o erro aparece no Field, o resumo foca a lista e o erro some ao escolher', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(
        <Form
          aria-label="Assinatura"
          validate={(values) => ({ plano: values.plano ? undefined : 'Escolha um plano.' })}
          onSubmit={onSubmit}
        >
          {({ errors }) => (
            <>
              <PlanList name="plano" required error={errors.plano} />
              <Button type="submit">Assinar</Button>
            </>
          )}
        </Form>,
      )
      await user.click(screen.getByRole('button', { name: 'Assinar' }))
      expect(onSubmit).not.toHaveBeenCalled()
      const listbox = screen.getByRole('listbox', { name: 'Plano' })
      expect(listbox).toHaveAttribute('aria-invalid', 'true')
      expect(listbox).toHaveAccessibleDescription('Escolha um plano.')
      await user.click(screen.getByRole('link', { name: 'Escolha um plano.' }))
      expect(listbox).toHaveFocus()
      await user.keyboard('{ArrowDown} ')
      expect(listbox).not.toHaveAttribute('aria-invalid')
      await user.click(screen.getByRole('button', { name: 'Assinar' }))
      expect(onSubmit.mock.calls[0][0]).toEqual({ plano: 'essencial' })
    })
  })

  describe('Field', () => {
    it('liga descrição e erro, marca inválido e obrigatório', () => {
      render(<PlanList description="Você pode trocar depois." error="Escolha um plano." required />)
      const listbox = screen.getByRole('listbox', { name: /Plano/ })
      expect(listbox).toHaveAccessibleDescription('Você pode trocar depois. Escolha um plano.')
      expect(listbox).toHaveAttribute('aria-invalid', 'true')
      expect(listbox).toHaveAttribute('aria-required', 'true')
    })

    it('treme uma vez quando o erro surge', () => {
      const { rerender } = render(<PlanList />)
      const listbox = screen.getByRole('listbox')
      expect(listbox).not.toHaveClass('or-forms-shake')
      rerender(<PlanList error="Escolha um plano." />)
      expect(listbox).toHaveClass('or-forms-shake')
      endAnimation(listbox, 'or-shake')
      expect(listbox).not.toHaveClass('or-forms-shake')
    })

    it('aplica maxHeight como estilo e aceita aria-label sem rótulo visível', () => {
      render(
        <Listbox aria-label="Armazém" maxHeight={240}>
          <ListboxOption value="cajamar">Cajamar</ListboxOption>
        </Listbox>,
      )
      expect(screen.getByRole('listbox', { name: 'Armazém' })).toHaveStyle({ maxHeight: '240px' })
    })
  })

  describe('acessibilidade', () => {
    it('não possui violações (único, focado)', async () => {
      const user = userEvent.setup()
      const { container } = render(<PlanList description="Cobrança mensal." defaultValue="essencial" />)
      await user.tab()
      await expectNoA11yViolations(container)
    })

    it('não possui violações (múltiplo, grupos, erro, desabilitado)', async () => {
      const { container } = render(
        <div>
          <Listbox
            label="Categorias"
            selectionMode="multiple"
            error="Escolha ao menos uma categoria."
            name="categorias"
            defaultValue={['padaria']}
          >
            <ListboxGroup label="Alimentos">
              <ListboxOption value="padaria" description="Pães e bolos">
                Padaria
              </ListboxOption>
              <ListboxOption value="hortifruti" disabled>
                Hortifrúti
              </ListboxOption>
            </ListboxGroup>
            <ListboxGroup label="Casa">
              <ListboxOption value="limpeza">Limpeza</ListboxOption>
            </ListboxGroup>
          </Listbox>
          <PlanList disabled orientation="horizontal" />
        </div>,
      )
      await expectNoA11yViolations(container)
    })
  })
})
