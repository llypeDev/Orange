import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type CSSProperties, type ReactNode } from 'react'
import { Button } from '../Button'
import { ConsentBanner, type ConsentCategory, type ConsentValue } from './ConsentBanner'

const categories: ConsentCategory[] = [
  {
    id: 'necessarios',
    label: 'Necessários',
    description:
      'Mantêm o site funcionando: login, segurança, carrinho e a sua escolha sobre cookies.',
    required: true,
  },
  {
    id: 'desempenho',
    label: 'Desempenho e analytics',
    description:
      'Contam visitas e medem o carregamento das páginas, em dados agregados, para melhorarmos o site.',
  },
  {
    id: 'funcionalidade',
    label: 'Funcionalidade',
    description: 'Lembram preferências como região de entrega e produtos vistos recentemente.',
  },
  {
    id: 'publicidade',
    label: 'Publicidade',
    description:
      'Permitem que parceiros mostrem anúncios mais relevantes para você em outros sites.',
  },
]

const meta = {
  title: 'Componentes/ConsentBanner',
  component: ConsentBanner,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Banner de consentimento de cookies (LGPD): uma região nomeada com título, texto, link da política e três ações com o mesmo peso — "Aceitar todos", "Rejeitar opcionais" e "Personalizar", que abre um Modal com um CheckboxGroup em cartões, uma caixa por categoria (as obrigatórias ficam marcadas e travadas, "Sempre ativos"). Caixas, não switches: a escolha só vale ao salvar. Não prende nem rouba o foco. `onDecision(consent, source)` é chamado a cada decisão e o banner fecha; **quem guarda a escolha é o app** — o componente não lê nem grava cookies ou localStorage. Por padrão fica fixo no rodapé da janela; `placement="inline"` o coloca no fluxo.',
      },
    },
  },
  argTypes: {
    placement: { control: 'inline-radio', options: ['bottom', 'top', 'inline'] },
    title: { control: 'text' },
    policyHref: { control: 'text' },
    headingLevel: { control: 'inline-radio', options: [2, 3, 4, 5, 6] },
    onDecision: { action: 'decision' },
    onChange: { action: 'change' },
    onOpenChange: { action: 'openChange' },
  },
  args: {
    categories,
    placement: 'inline',
    policyHref: '#politica-de-cookies',
  },
} satisfies Meta<typeof ConsentBanner>

export default meta
type Story = StoryObj<typeof meta>

/** Aberto e no fluxo (`placement="inline"`) — determinístico para a regressão visual. */
export const Default: Story = {}

const pageStyle: CSSProperties = {
  minHeight: 480,
  padding: 24,
  color: 'var(--or-color-text-muted)',
  fontFamily: 'var(--or-font-body)',
}

function Page({ children }: { children?: ReactNode }) {
  return (
    <div style={pageStyle}>
      <h1
        style={{
          marginTop: 0,
          color: 'var(--or-color-text)',
          fontFamily: 'var(--or-font-display)',
        }}
      >
        Loja Aurora
      </h1>
      <p>Cafés especiais torrados toda semana, com entrega para todo o Brasil.</p>
      {children}
    </div>
  )
}

/** Padrão: fixo no rodapé da janela, em portal no início do `<body>` — o primeiro na ordem do Tab. */
export const Bottom: Story = {
  args: { placement: 'bottom' },
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <>
      <ConsentBanner {...args} />
      <Page />
    </>
  ),
}

export const Top: Story = {
  args: { placement: 'top' },
  parameters: { layout: 'fullscreen' },
  render: Bottom.render,
}

/** Preferências abertas: obrigatórias marcadas e travadas, opcionais desmarcadas. */
export const Preferences: Story = {
  args: { defaultPreferencesOpen: true },
}

/** Texto e título próprios, com o link da política no roteador (`renderLink`). */
export const CustomText: Story = {
  args: {
    title: 'Sua privacidade na Loja Aurora',
    children: (
      <p>
        Usamos cookies para manter o seu carrinho e, se você permitir, para entender como o site é
        usado e mostrar ofertas de café do seu interesse. Recusar não muda os preços nem o frete.
      </p>
    ),
    policyHref: '/privacidade/cookies',
    // Em um app real: renderLink={({ href, ...props }) => <RouterLink to={href} {...props} />}
    renderLink: ({ href, ...props }) => <a href={`#/app${href}`} {...props} />,
  },
}

/** 320px: as ações empilham na largura toda. */
export const Narrow: Story = {
  render: (args) => (
    <div style={{ width: 320, maxWidth: '100%' }}>
      <ConsentBanner {...args} />
    </div>
  ),
}

function summary(consent: ConsentValue | null) {
  if (!consent) return 'Nenhuma decisão ainda.'
  const accepted = categories.filter((category) => consent[category.id]).map((c) => c.label)
  return `Aceitos: ${accepted.join(', ')}.`
}

/**
 * Fluxo completo: o app guarda a decisão (aqui, em memória) e um link no
 * rodapé reabre as preferências a qualquer momento.
 */
export const Revisit: Story = {
  render: (args) => {
    const [consent, setConsent] = useState<ConsentValue | null>(null)
    const [open, setOpen] = useState(true)
    const [preferencesOpen, setPreferencesOpen] = useState(false)
    return (
      <div style={{ display: 'grid', gap: 16 }}>
        <ConsentBanner
          {...args}
          open={open}
          onOpenChange={setOpen}
          value={consent ?? {}}
          onChange={setConsent}
          preferencesOpen={preferencesOpen}
          onPreferencesOpenChange={setPreferencesOpen}
          onDecision={(value, source) => {
            setConsent(value)
            args.onDecision?.(value, source)
          }}
        />
        <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>{summary(consent)}</p>
        <footer style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {/* Abre direto as preferências: o foco entra no diálogo e volta para cá. */}
          <Button variant="ghost" size="sm" onClick={() => setPreferencesOpen(true)}>
            Preferências de cookies
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
            Mostrar o banner de novo
          </Button>
        </footer>
      </div>
    )
  },
}
