import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { TaskList, TaskListItem, type TaskListStatus } from './TaskList'

const meta = {
  title: 'Componentes/TaskList',
  component: TaskList,
  subcomponents: { TaskListItem },
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Lista de tarefas com status (padrão "Task list" do GOV.UK) para onboarding e configurações longas que a pessoa conclui em qualquer ordem. Cada `TaskListItem` traz o nome (link com `href` ou botão com `onClick` — a linha inteira é o alvo), uma descrição opcional e o status em texto + tag. O link é descrito pela descrição e pelo status (`aria-describedby`); tarefas `cannot-start` nunca são links. Com `title`, mostra o resumo "3 de 5 concluídas" com uma `ProgressBar`.',
      },
    },
  },
  argTypes: {
    title: { control: 'text' },
    headingLevel: { control: 'inline-radio', options: [2, 3, 4, 5, 6] },
    showProgress: { control: 'boolean' },
    completed: { control: { type: 'number', min: 0, step: 1 } },
    total: { control: { type: 'number', min: 0, step: 1 } },
  },
  args: {
    title: 'Configure sua loja',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 640 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TaskList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <TaskList {...args}>
      <TaskListItem
        href="#/empresa"
        status="complete"
        description="Razão social, endereço e logotipo"
      >
        Dados da empresa
      </TaskListItem>
      <TaskListItem
        href="#/pagamentos"
        status="in-progress"
        description="Pix, boleto e cartão de crédito"
      >
        Formas de pagamento
      </TaskListItem>
      <TaskListItem href="#/frete" status="not-started">
        Frete e entrega
      </TaskListItem>
      <TaskListItem href="#/catalogo" status="error" description="2 produtos estão sem preço">
        Catálogo de produtos
      </TaskListItem>
      <TaskListItem status="cannot-start" statusLabel="Disponível após o frete">
        Domínio próprio
      </TaskListItem>
    </TaskList>
  ),
}

export const Statuses: Story = {
  args: { title: undefined, 'aria-label': 'Status das tarefas' },
  render: (args) => (
    <TaskList {...args}>
      <TaskListItem href="#" status="complete">
        Concluída
      </TaskListItem>
      <TaskListItem href="#" status="in-progress">
        Em andamento
      </TaskListItem>
      <TaskListItem href="#" status="not-started">
        Não iniciada
      </TaskListItem>
      <TaskListItem href="#" status="error">
        Com erro
      </TaskListItem>
      <TaskListItem href="#" status="cannot-start">
        Bloqueada por outra tarefa
      </TaskListItem>
    </TaskList>
  ),
}

/** Seções ao estilo GOV.UK: várias listas sob headings da página, sem resumo próprio. */
export const Sections: Story = {
  args: { title: undefined },
  render: () => (
    <div style={{ display: 'grid', gap: 32 }}>
      <section aria-labelledby="secao-loja">
        <h2 id="secao-loja" className="or-eyebrow" style={{ margin: '0 0 12px' }}>
          1. Sua loja
        </h2>
        <TaskList aria-labelledby="secao-loja">
          <TaskListItem href="#/empresa" status="complete">
            Dados da empresa
          </TaskListItem>
          <TaskListItem href="#/marca" status="complete">
            Marca e cores
          </TaskListItem>
        </TaskList>
      </section>
      <section aria-labelledby="secao-vendas">
        <h2 id="secao-vendas" className="or-eyebrow" style={{ margin: '0 0 12px' }}>
          2. Vendas
        </h2>
        <TaskList aria-labelledby="secao-vendas">
          <TaskListItem href="#/pagamentos" status="in-progress">
            Formas de pagamento
          </TaskListItem>
          <TaskListItem href="#/frete" status="not-started">
            Frete e entrega
          </TaskListItem>
        </TaskList>
      </section>
    </div>
  ),
}

/** Com `onClick`, as tarefas viram botões (ex.: abrem um diálogo). Clique para avançar o status. */
export const WithButtons: Story = {
  args: { title: 'Prepare a equipe' },
  render: function Render(args) {
    const order: TaskListStatus[] = ['not-started', 'in-progress', 'complete']
    const [tasks, setTasks] = useState([
      { name: 'Convidar vendedores', status: 'complete' as TaskListStatus },
      { name: 'Definir permissões', status: 'in-progress' as TaskListStatus },
      { name: 'Configurar metas do mês', status: 'not-started' as TaskListStatus },
    ])
    const advance = (index: number) =>
      setTasks((list) =>
        list.map((task, i) =>
          i === index
            ? { ...task, status: order[(order.indexOf(task.status) + 1) % order.length] }
            : task,
        ),
      )
    return (
      <TaskList {...args}>
        {tasks.map((task, i) => (
          <TaskListItem key={task.name} status={task.status} onClick={() => advance(i)}>
            {task.name}
          </TaskListItem>
        ))}
      </TaskList>
    )
  },
}

export const AllComplete: Story = {
  args: { title: 'Configuração concluída' },
  render: (args) => (
    <TaskList {...args}>
      <TaskListItem href="#/empresa" status="complete">
        Dados da empresa
      </TaskListItem>
      <TaskListItem href="#/pagamentos" status="complete">
        Formas de pagamento
      </TaskListItem>
      <TaskListItem href="#/frete" status="complete">
        Frete e entrega
      </TaskListItem>
    </TaskList>
  ),
}

/** Em 320px o status desce para baixo do nome quando não cabe ao lado. */
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 288 }}>
        <Story />
      </div>
    ),
  ],
  render: Default.render,
}
