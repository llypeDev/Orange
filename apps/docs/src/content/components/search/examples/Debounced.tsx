import { Search } from '@orange/ui'
import { useMemo, useState } from 'react'

const artigos = [
  'Como emitir a segunda via do boleto',
  'Alterar a forma de pagamento',
  'Cancelar a assinatura',
  'Trocar o e-mail de acesso',
  'Redefinir a senha',
  'Configurar a autenticação em dois fatores',
  'Exportar notas fiscais',
  'Adicionar pessoas à equipe',
]

const normalizar = (texto: string) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export default function Debounced() {
  const [termo, setTermo] = useState('')
  const resultados = useMemo(
    () => artigos.filter((a) => normalizar(a).includes(normalizar(termo))),
    [termo],
  )

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 420 }}>
      <Search
        label="Buscar na central de ajuda"
        hideLabel={false}
        description="Os resultados são filtrados enquanto você digita."
        placeholder="Ex.: boleto, senha, equipe"
        debounce={250}
        onChange={setTermo}
      />
      <p role="status" style={{ margin: 0, fontSize: 13, color: 'var(--or-color-text-subtle)' }}>
        {resultados.length} {resultados.length === 1 ? 'artigo encontrado' : 'artigos encontrados'}
      </p>
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14 }}>
        {resultados.map((artigo) => (
          <li key={artigo}>{artigo}</li>
        ))}
      </ul>
    </div>
  )
}
