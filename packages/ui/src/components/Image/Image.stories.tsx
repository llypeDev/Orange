import type { Meta, StoryObj } from '@storybook/react-vite'
import { Image } from './Image'

const svg = (viewBox: string, body: string) =>
  'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${body}</svg>`)

const vitrine = svg(
  '0 0 480 270',
  '<rect width="480" height="270" fill="#f0ebdb"/><rect y="214" width="480" height="56" fill="#e2ddcd"/><rect x="40" y="40" width="400" height="8" fill="#2a2a30"/><rect x="40" y="128" width="400" height="8" fill="#2a2a30"/><rect x="40" y="206" width="400" height="8" fill="#2a2a30"/><rect x="64" y="72" width="40" height="56" fill="#f58549"/><rect x="116" y="88" width="56" height="40" fill="#3a3a42"/><rect x="200" y="60" width="32" height="68" fill="#2a2a30"/><circle cx="292" cy="104" r="24" fill="#f58549"/><rect x="340" y="80" width="72" height="48" fill="#55555e"/><rect x="72" y="160" width="64" height="46" fill="#2a2a30"/><rect x="168" y="150" width="40" height="56" fill="#e8c15a"/><rect x="236" y="168" width="96" height="38" fill="#f58549"/><rect x="356" y="146" width="48" height="60" fill="#3a3a42"/>',
)

const retrato = svg(
  '0 0 300 400',
  '<rect width="300" height="400" fill="#1c1c21"/><rect y="320" width="300" height="80" fill="#2a2a30"/><circle cx="150" cy="96" r="44" fill="#f58549"/><rect x="128" y="132" width="44" height="40" fill="#55555e"/><path d="M70 320c4-80 36-150 80-150s76 70 80 150z" fill="#f0ebdb"/>',
)

const logotipo = svg(
  '0 0 216 72',
  '<rect width="72" height="72" fill="#f58549"/><rect x="18" y="18" width="36" height="36" fill="#75757f"/><rect x="92" y="14" width="44" height="44" fill="#75757f"/><rect x="148" y="14" width="12" height="44" fill="#75757f"/><rect x="172" y="14" width="44" height="12" fill="#75757f"/><rect x="172" y="46" width="44" height="12" fill="#f58549"/>',
)

const meta = {
  title: 'Componentes/Image',
  component: Image,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Imagem robusta: `alt` obrigatório (`""` só para decorativas), proporção reservada com `ratio` (sem CLS), `loading="lazy"` e `decoding="async"` por padrão, skeleton até carregar e fade-in. Em erro tenta `fallbackSrc` uma vez e depois mostra um substituto acessível. `caption` envolve em `<figure>`.',
      },
    },
  },
  argTypes: {
    ratio: { control: 'inline-radio', options: ['1/1', '4/3', '3/2', '16/9', '21/9'] },
    fit: { control: 'inline-radio', options: ['cover', 'contain'] },
    position: { control: 'text' },
    bordered: { control: 'boolean' },
    caption: { control: 'text' },
  },
  args: {
    src: vitrine,
    alt: 'Prateleiras da loja com mochilas, garrafas e acessórios',
    ratio: '16/9',
    fit: 'cover',
    bordered: false,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Image>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Ratios: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
      {(['1/1', '4/3', '16/9', '21/9'] as const).map((ratio) => (
        <Image key={ratio} {...args} ratio={ratio} bordered />
      ))}
    </div>
  ),
}

export const FitAndPosition: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      <Image src={retrato} alt="Retrato da gerente da loja" ratio="1/1" bordered />
      <Image src={retrato} alt="Retrato da gerente da loja" ratio="1/1" position="top" bordered />
      <Image src={logotipo} alt="Laranja Store" ratio="1/1" fit="contain" bordered />
    </div>
  ),
}

export const WithCaption: Story = {
  args: { caption: 'Nova vitrine da loja do centro, organizada por categoria.', bordered: true },
}

export const FallbackSrc: Story = {
  args: { src: '/inexistente/vitrine.jpg', fallbackSrc: vitrine, ratio: '4/3' },
}

export const ErrorFallback: Story = {
  args: { src: '/inexistente/mochila.jpg', alt: 'Mochila Urbana 22 L', ratio: '4/3', bordered: true },
}

export const CustomFallback: Story = {
  args: {
    src: '/inexistente/mapa.png',
    alt: 'Mapa da loja do centro',
    ratio: '4/3',
    bordered: true,
    fallback: <span style={{ fontSize: 14 }}>Mapa indisponível no momento.</span>,
  },
}

export const Decorative: Story = {
  args: { alt: '', ratio: '21/9' },
}
