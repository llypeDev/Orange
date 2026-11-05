import { Highlight } from '@orangesys/ui'

export default function Literal() {
  return (
    <div style={{ display: 'grid', gap: 8, maxWidth: 520 }}>
      <Highlight as="p" query="(R$ 49,90)" style={{ margin: 0 }}>
        Plano Essencial (R$ 49,90) por mês, com até 5 usuários.
      </Highlight>
      <Highlight as="p" query="*.csv" style={{ margin: 0 }}>
        Arraste arquivos *.csv ou *.xlsx para importar os lançamentos.
      </Highlight>
      <Highlight as="p" query="API" caseSensitive style={{ margin: 0 }}>
        A API pública tem limite de 100 requisições por minuto; a rápida integração usa a mesma chave.
      </Highlight>
    </div>
  )
}
