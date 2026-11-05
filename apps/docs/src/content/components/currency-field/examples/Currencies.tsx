import { CurrencyField } from '@orangesys/ui'

export default function Currencies() {
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 320 }}>
      <CurrencyField label="Assinatura em dólar" currency="USD" locale="en-US" defaultValue={49} />
      <CurrencyField
        label="Hospedagem em Lisboa"
        currency="EUR"
        locale="pt-PT"
        defaultValue={1280.5}
      />
      <CurrencyField
        label="Fornecedor no Japão"
        currency="JPY"
        locale="ja-JP"
        defaultValue={158000}
      />
      <CurrencyField
        label="Valor em código ISO"
        currency="BRL"
        currencyDisplay="code"
        defaultValue={89.9}
        size="sm"
      />
    </div>
  )
}
