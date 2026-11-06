import { Prose } from '@orangesys/ui'

// HTML que veio do CMS. Ele já chega aqui SANITIZADO pelo servidor
// (ex.: DOMPurify ou sanitize-html) — o Prose só aplica a tipografia.
// O renderizador também adicionou tabindex="0" ao <pre> para a rolagem
// horizontal funcionar pelo teclado.
const notasDaVersao = `
<h2>Novidades da versão 3.8</h2>
<p>Esta versão traz a <strong>exportação agendada</strong> de relatórios e corrige a paginação da busca de pedidos.</p>
<h3>Novo</h3>
<ul>
  <li>Agende exportações diárias ou semanais em <code>Relatórios › Agendamentos</code>.</li>
  <li>Filtro por canal de venda nos relatórios de estoque.</li>
</ul>
<h3>Corrigido</h3>
<ul>
  <li>A busca de pedidos voltava para a primeira página ao trocar o filtro.</li>
</ul>
<pre tabindex="0"><code>{
  "formato": "csv",
  "frequencia": "semanal",
  "dia": "segunda-feira"
}</code></pre>
<hr>
<p><small>Publicado em 4 de novembro de 2026.</small></p>
`

export default function CmsHtml() {
  return <Prose dangerouslySetInnerHTML={{ __html: notasDaVersao }} />
}
