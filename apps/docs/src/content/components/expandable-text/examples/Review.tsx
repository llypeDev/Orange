import { ExpandableText } from '@orangesys/ui'

export default function Review() {
  return (
    <article style={{ maxWidth: 440, padding: 20, border: '1px solid var(--or-color-border)' }}>
      <p className="or-eyebrow" style={{ margin: '0 0 8px' }}>
        Avaliação verificada · 5 de 5
      </p>
      <ExpandableText>
        Comprei para o escritório e a equipe se adaptou rápido. A bateria dura o dia inteiro, o teclado é silencioso e a tela
        tem ótimo brilho mesmo perto da janela. O único ponto negativo é o carregador, que esquenta bastante depois de algumas
        horas de uso contínuo. Ainda assim, recomendo para quem trabalha em trânsito e precisa de um equipamento leve.
      </ExpandableText>
    </article>
  )
}
