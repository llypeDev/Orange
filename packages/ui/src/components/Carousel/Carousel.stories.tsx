import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Image } from '../Image'
import { Carousel, CarouselSlide, type CarouselProps } from './Carousel'

const svg = (viewBox: string, body: string) =>
  'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${body}</svg>`)

const scene = (accent: string, shapes: string) =>
  svg('0 0 320 180', `<rect width="320" height="180" fill="#0f0f12"/><path d="M0 45h320M0 90h320M0 135h320" stroke="#2a2a30"/>${shapes.replace(/ACC/g, accent)}`)

const highlights = [
  {
    id: 'frete',
    title: 'Frete grátis acima de R$ 199',
    text: 'Para todo o Brasil, em pedidos de qualquer categoria.',
    image: scene('#f58549', '<rect x="40" y="70" width="140" height="70" fill="ACC"/><rect x="180" y="96" width="64" height="44" fill="#3a3a42"/><circle cx="84" cy="146" r="16" fill="#f0ebdb"/><circle cx="212" cy="146" r="16" fill="#f0ebdb"/>'),
  },
  {
    id: 'inverno',
    title: 'Coleção de inverno',
    text: 'Jaquetas, mantas e meias térmicas com até 30% de desconto.',
    image: scene('#8da2ea', '<path d="M100 150l60-110 60 110z" fill="ACC"/><path d="M140 77l20-37 20 37z" fill="#f0ebdb"/><rect x="230" y="40" width="40" height="40" fill="#f58549"/>'),
  },
  {
    id: 'cupom',
    title: 'Cupom de boas-vindas',
    text: '10% na primeira compra pelo aplicativo.',
    image: scene('#e8c15a', '<rect x="80" y="50" width="160" height="80" fill="ACC"/><circle cx="80" cy="90" r="16" fill="#0f0f12"/><circle cx="240" cy="90" r="16" fill="#0f0f12"/><path d="M130 110l60-40" stroke="#0f0f12" stroke-width="8"/>'),
  },
  {
    id: 'troca',
    title: 'Troca fácil em 30 dias',
    text: 'Devolva em qualquer loja física ou agende a coleta.',
    image: scene('#a6d16a', '<path d="M90 90a70 70 0 0 1 120-50" fill="none" stroke="ACC" stroke-width="12"/><path d="M230 90a70 70 0 0 1-120 50" fill="none" stroke="#f58549" stroke-width="12"/>'),
  },
  {
    id: 'retire',
    title: 'Retire na loja',
    text: 'Compre on-line e retire em até 2 horas, sem custo.',
    image: scene('#f58549', '<rect x="100" y="60" width="120" height="90" fill="#3a3a42"/><path d="M90 60l70-30 70 30z" fill="ACC"/><rect x="146" y="104" width="28" height="46" fill="#f0ebdb"/>'),
  },
]

const products = ['Mochila Urbana', 'Tênis Pace', 'Garrafa Térmica', 'Fone Studio', 'Relógio Minimal', 'Luminária', 'Caneca Esmaltada', 'Boné Aba Curva']
const productImage = (i: number) =>
  svg(
    '0 0 240 240',
    `<rect width="240" height="240" fill="#f0ebdb"/><rect y="188" width="240" height="52" fill="#e2ddcd"/><rect x="${60 + (i % 3) * 10}" y="${70 - (i % 2) * 10}" width="${110 - (i % 3) * 20}" height="${118 + (i % 2) * 10}" fill="${i % 2 ? '#f58549' : '#2a2a30'}"/><rect x="80" y="120" width="80" height="12" fill="${i % 2 ? '#2a2a30' : '#f58549'}"/>`,
  )

const Highlights = (args: Partial<CarouselProps>) => (
  <Carousel label="Destaques da loja" {...args}>
    {highlights.map((item) => (
      <CarouselSlide key={item.id} aria-labelledby={`story-${item.id}`}>
        <Image src={item.image} alt="" ratio="16/9" bordered />
        <h3 id={`story-${item.id}`} style={{ margin: '16px 0 4px', fontFamily: 'var(--or-font-display)' }}>
          {item.title}
        </h3>
        <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>{item.text}</p>
      </CarouselSlide>
    ))}
  </Carousel>
)

const meta = {
  title: 'Componentes/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Carrossel acessível (padrão Carousel do WAI-ARIA APG) com `CarouselSlide`. Trilho com scroll-snap nativo (swipe), anterior/próximo, seletor em abas (uma parada de Tab, setas, Home/End) e rotação opcional: o botão Pausar é o primeiro controle, pausa no hover, para com o foco do teclado e nunca começa com movimento reduzido. Slides fora da vista ficam inertes.',
      },
    },
  },
  argTypes: {
    slidesPerView: { control: { type: 'number', min: 1, max: 5, step: 0.1 } },
    gap: { control: 'select', options: [0, 1, 2, 3, 4, 5, 6, 8] },
    loop: { control: 'boolean' },
    controls: { control: 'inline-radio', options: ['bottom', 'top'] },
    picker: { control: 'inline-radio', options: ['dots', 'counter', 'none'] },
    autoplay: { control: 'boolean' },
    onIndexChange: { action: 'indexChange' },
  },
  args: {
    label: 'Destaques da loja',
    slidesPerView: 1,
    gap: 4,
    loop: false,
    controls: 'bottom',
    picker: 'dots',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 640 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Carousel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => <Highlights {...args} />,
}

export const Autoplay: Story = {
  args: { autoplay: { interval: 5000 }, loop: true },
  render: (args) => <Highlights {...args} />,
}

export const ProductRail: Story = {
  args: { label: 'Mais vendidos', slidesPerView: { base: 1.4, sm: 2.4, lg: 3.2 }, controls: 'top', picker: 'counter' },
  render: (args) => (
    <Carousel {...args}>
      {products.map((name, i) => (
        <CarouselSlide key={name} label={name}>
          <Image src={productImage(i)} alt={name} ratio="1/1" bordered />
          <p style={{ margin: '8px 0 0', fontFamily: 'var(--or-font-display)', fontWeight: 700 }}>{name}</p>
        </CarouselSlide>
      ))}
    </Carousel>
  ),
}

export const Peek: Story = {
  args: { slidesPerView: 1.2, gap: 3 },
  render: (args) => <Highlights {...args} />,
}

export const ControlsTop: Story = {
  args: { controls: 'top', picker: 'counter' },
  render: (args) => <Highlights {...args} />,
}

export const Controlled: Story = {
  render: (args) => {
    const [index, setIndex] = useState(2)
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <p style={{ margin: 0 }}>Posição atual: {index + 1}</p>
        <Highlights {...args} index={index} onIndexChange={setIndex} />
      </div>
    )
  },
}
