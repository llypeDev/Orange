import { Button, ConsentBanner, type ConsentCategory, type ConsentValue } from '@orangesys/ui'
import { useEffect, useState } from 'react'

const categories: ConsentCategory[] = [
  {
    id: 'necessarios',
    label: 'Necessários',
    description: 'Login, segurança, carrinho e esta escolha. Sem eles o site não funciona.',
    required: true,
  },
  {
    id: 'desempenho',
    label: 'Desempenho e analytics',
    description: 'Contam visitas e medem o carregamento das páginas, em dados agregados.',
  },
  {
    id: 'funcionalidade',
    label: 'Funcionalidade',
    description: 'Lembram a região de entrega e os produtos vistos recentemente.',
  },
  {
    id: 'publicidade',
    label: 'Publicidade',
    description: 'Permitem que parceiros mostrem anúncios de acordo com os seus interesses.',
  },
]

const STORAGE_KEY = 'aurora:consentimento-cookies'
// Mude a versão quando a política ou as categorias mudarem: a pessoa decide de novo.
const POLICY_VERSION = '2026-11'

interface StoredConsent {
  consent: ConsentValue
  version: string
  decidedAt: string
}

/** O app guarda a escolha — o ConsentBanner não lê nem grava cookies ou localStorage. */
function readConsent(): StoredConsent | null {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as StoredConsent | null
    return stored?.version === POLICY_VERSION ? stored : null
  } catch {
    return null // armazenamento bloqueado (modo privado) ou valor inválido: pergunta de novo
  }
}

function saveConsent(consent: ConsentValue) {
  const record: StoredConsent = {
    consent,
    version: POLICY_VERSION,
    decidedAt: new Date().toISOString(),
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
  } catch {
    // Sem armazenamento a escolha vale só nesta visita.
  }
}

export default function Persistence() {
  const [consent, setConsent] = useState<ConsentValue>({})
  const [open, setOpen] = useState(false)
  const [preferencesOpen, setPreferencesOpen] = useState(false)

  // Lê depois de montar (seguro com SSR). Sem decisão salva, mostra o banner.
  useEffect(() => {
    const stored = readConsent()
    if (stored) setConsent(stored.consent)
    else setOpen(true)
  }, [])

  // Scripts opcionais só carregam com consentimento, e só depois da decisão:
  // useEffect(() => { if (consent.desempenho) carregarAnalytics() }, [consent.desempenho])

  const forget = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // nada a esquecer
    }
    setConsent({})
    setOpen(true)
  }

  const accepted = categories.filter((category) => consent[category.id])

  return (
    <div style={{ display: 'grid', gap: 16, width: '100%' }}>
      {/* No app, omita placement: o banner fica fixo no rodapé da janela. */}
      <ConsentBanner
        placement="inline"
        categories={categories}
        policyHref="#politica-de-cookies"
        open={open}
        onOpenChange={setOpen}
        preferencesOpen={preferencesOpen}
        onPreferencesOpenChange={setPreferencesOpen}
        value={consent}
        onDecision={(next) => {
          saveConsent(next)
          setConsent(next)
        }}
      />
      <p style={{ margin: 0 }}>
        {open
          ? 'Nenhuma decisão salva neste navegador.'
          : `Salvo neste navegador: ${accepted.map((c) => c.label).join(', ')}.`}
      </p>
      <footer
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          paddingTop: 12,
          borderTop: '1px solid var(--or-color-border)',
        }}
      >
        {/* Revogar ou mudar a escolha precisa ser tão fácil quanto dar o consentimento. */}
        <Button variant="ghost" size="sm" onClick={() => setPreferencesOpen(true)}>
          Preferências de cookies
        </Button>
        <Button variant="ghost" size="sm" onClick={forget}>
          Esquecer decisão (demonstração)
        </Button>
      </footer>
    </div>
  )
}
