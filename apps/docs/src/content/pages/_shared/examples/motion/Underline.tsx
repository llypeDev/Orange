export default function SublinhadoAnimado() {
  const itens = ['Visão geral', 'Pedidos', 'Clientes', 'Relatórios']
  return (
    <nav aria-label="Seções do painel">
      <ul className="guide-underline-nav">
        {itens.map((item, i) => (
          <li key={item}>
            {/* or-underline: o traço cresce da esquerda no hover, no foco e em aria-current */}
            <a href="#sublinhado" className="or-underline" aria-current={i === 1 ? 'page' : undefined}>
              {item}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
