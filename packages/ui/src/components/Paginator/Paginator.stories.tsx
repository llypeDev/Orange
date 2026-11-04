import type { Meta, StoryObj } from '@storybook/react-vite'
import { Paginator } from './Paginator'

const meta = {
  title: 'Componentes/Paginator',
  component: Paginator,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Paginação para listas e tabelas longas. Página atual com `aria-current="page"`, reticências calculadas por `siblingCount`/`boundaryCount`, variante `compact` e seletor opcional de itens por página.',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'compact'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    siblingCount: { control: { type: 'number', min: 0, max: 3 } },
    boundaryCount: { control: { type: 'number', min: 0, max: 3 } },
    showFirstLast: { control: 'boolean' },
    onPageChange: { action: 'pageChange' },
    onPageSizeChange: { action: 'pageSizeChange' },
  },
  args: {
    totalPages: 12,
    defaultPage: 3,
    variant: 'default',
    size: 'md',
    siblingCount: 1,
    boundaryCount: 1,
    showFirstLast: false,
  },
} satisfies Meta<typeof Paginator>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const FirstAndLast: Story = {
  args: { showFirstLast: true, totalPages: 40, defaultPage: 20 },
}

export const Compact: Story = {
  args: { variant: 'compact', showFirstLast: true },
}

export const WithPageSize: Story = {
  args: { totalPages: undefined, totalItems: 240, pageSizeOptions: [10, 20, 50, 100], defaultPage: 1 },
}

export const Small: Story = {
  args: { size: 'sm' },
}

export const AsLinks: Story = {
  args: { getPageHref: (page: number) => `?pagina=${page}` },
}
