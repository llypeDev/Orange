import { Button, EmptyState } from '@orangesys/ui'

export default function Compact() {
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 480 }}>
      <section aria-labelledby="equipe" style={{ border: '1px solid var(--or-color-border)' }}>
        <h3
          id="equipe"
          style={{
            margin: 0,
            padding: '12px 20px',
            borderBottom: '1px solid var(--or-color-border)',
            fontFamily: 'var(--or-font-display)',
          }}
        >
          Equipe do projeto
        </h3>
        <EmptyState
          variant="compact"
          headingLevel={4}
          icon="users"
          title="Ninguém foi convidado"
          description="Convide colegas para comentar e editar este projeto."
          action={
            <Button size="sm" variant="outline">
              Convidar pessoas
            </Button>
          }
        />
      </section>
      <section aria-labelledby="anexos" style={{ border: '1px solid var(--or-color-border)' }}>
        <h3
          id="anexos"
          style={{
            margin: 0,
            padding: '12px 20px',
            borderBottom: '1px solid var(--or-color-border)',
            fontFamily: 'var(--or-font-display)',
          }}
        >
          Anexos
        </h3>
        <EmptyState
          variant="compact"
          headingLevel={4}
          icon="file"
          title="Sem anexos"
          description="Arraste arquivos para cá ou use o botão Enviar."
        />
      </section>
    </div>
  )
}
