import { Prose } from '@orangesys/ui'
import exportarRelatorio from './media/exportar-relatorio.svg'

export default function HelpArticle() {
  return (
    <Prose as="article" aria-labelledby="ajuda-exportar">
      <h1 id="ajuda-exportar">Como exportar relatórios de vendas</h1>
      <p>
        Você pode exportar qualquer relatório do painel em <strong>CSV</strong>,{' '}
        <strong>XLSX</strong> ou <strong>PDF</strong>. A exportação respeita os filtros aplicados na
        tela — período, loja e canal de venda. Para receber o arquivo toda semana, veja{' '}
        <a href="#agendamentos">exportações agendadas</a>.
      </p>

      <h2>Passo a passo</h2>
      <ol>
        <li>
          Abra <em>Relatórios › Vendas</em> e escolha o período.
        </li>
        <li>
          Pressione{' '}
          <kbd>
            <kbd>Ctrl</kbd> + <kbd>E</kbd>
          </kbd>{' '}
          ou clique em <mark>Exportar</mark>.
        </li>
        <li>
          Escolha o formato e confirme. O arquivo chega como <code>vendas-2026-11.csv</code>.
        </li>
      </ol>

      <figure>
        <img
          src={exportarRelatorio}
          alt="Janela Exportar relatório com o seletor de formato e o botão Exportar."
          width={640}
          height={280}
        />
        <figcaption>A janela mostra o formato e o período antes de gerar o arquivo.</figcaption>
      </figure>

      <h3>Limites por formato</h3>
      {/* tabIndex: em telas estreitas a tabela rola e precisa ser alcançável pelo teclado. */}
      <table tabIndex={0}>
        <thead>
          <tr>
            <th scope="col">Formato</th>
            <th scope="col">Linhas</th>
            <th scope="col">Melhor para</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>CSV</td>
            <td>1 milhão</td>
            <td>Planilhas e integrações</td>
          </tr>
          <tr>
            <td>XLSX</td>
            <td>500 mil</td>
            <td>Excel com formatação</td>
          </tr>
          <tr>
            <td>PDF</td>
            <td>10 mil</td>
            <td>Impressão e anexos</td>
          </tr>
        </tbody>
      </table>

      <blockquote>
        <p>
          Arquivos ficam disponíveis por 7 dias em Relatórios › Downloads. Depois disso, gere de
          novo.
        </p>
      </blockquote>

      <hr />
      <p>
        <small>Atualizado em 6 de novembro de 2026.</small>
      </p>
    </Prose>
  )
}
