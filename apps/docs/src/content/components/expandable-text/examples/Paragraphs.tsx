import { ExpandableText } from '@orangesys/ui'

export default function Paragraphs() {
  return (
    <section aria-labelledby="sobre-evento" style={{ maxWidth: 520 }}>
      <h3 id="sobre-evento" style={{ margin: '0 0 8px', fontSize: 18 }}>
        Sobre o evento
      </h3>
      <ExpandableText lines={4}>
        <p>
          O Encontro Orange reúne equipes de produto, design e engenharia para um dia de palestras sobre sistemas de design,
          acessibilidade e desenvolvimento de interfaces.
        </p>
        <p>
          A programação tem oito palestras, duas oficinas práticas e um painel com equipes que adotaram o Orange em aplicativos
          financeiros e de varejo. Todas as sessões terão intérprete de Libras e legendas ao vivo.
        </p>
        <p>O credenciamento abre às 8h30 e o almoço está incluso para todas as pessoas inscritas.</p>
      </ExpandableText>
    </section>
  )
}
