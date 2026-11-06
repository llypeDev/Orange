import type { Meta, StoryObj } from '@storybook/react-vite'
import { Alert } from '../Alert'
import { Blockquote } from '../Blockquote'
import { Button } from '../Button'
import { Prose } from './Prose'

const svg = (viewBox: string, body: string) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${body}</svg>`)

// Ilustração da janela "Exportar relatório" (determinística, sem rede).
const painelExportar = svg(
  '0 0 640 280',
  '<rect width="640" height="280" fill="#16161a"/><rect x="40" y="32" width="560" height="216" fill="#0f0f12" stroke="#3a3a42"/><rect x="64" y="56" width="180" height="14" fill="#f0ebdb"/><rect x="64" y="96" width="240" height="40" fill="#1c1c21" stroke="#3a3a42"/><rect x="320" y="96" width="256" height="40" fill="#1c1c21" stroke="#3a3a42"/><rect x="64" y="160" width="100" height="10" fill="#9c9588"/><rect x="64" y="180" width="140" height="10" fill="#9c9588"/><rect x="456" y="192" width="120" height="36" fill="#f58549"/><rect x="336" y="192" width="104" height="36" fill="none" stroke="#75757f"/>',
)

const meta = {
  title: 'Componentes/Prose',
  component: Prose,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Aplica a tipografia do Orange a conteúdo rico que a aplicação não controla — HTML de um CMS, Markdown convertido, artigos de ajuda, termos de uso. Seletores de baixa especificidade: componentes do Orange e trechos com `className="or-not-prose"` mantêm o próprio estilo. Para HTML pronto use `dangerouslySetInnerHTML` — **sanitizar o HTML é responsabilidade da aplicação**.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    measure: { control: 'boolean' },
    as: { control: 'select', options: ['div', 'article', 'section'] },
  },
  args: {
    size: 'md',
    measure: true,
  },
} satisfies Meta<typeof Prose>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { as: 'article' },
  render: (args) => (
    <Prose {...args}>
      <h1>Como exportar relatórios de vendas</h1>
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
          ou clique em <mark>Exportar</mark> no canto superior direito.
        </li>
        <li>
          Escolha o formato e confirme. O arquivo chega com o nome <code>vendas-2026-11.csv</code>.
        </li>
      </ol>
      <figure>
        <img
          src={painelExportar}
          alt="Janela Exportar relatório com o seletor de formato e o botão Exportar."
          width={640}
          height={280}
        />
        <figcaption>
          A janela de exportação mostra o formato e o período antes de gerar o arquivo.
        </figcaption>
      </figure>
      <h3>Limites por formato</h3>
      <table>
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
      <h3>Pela API</h3>
      <p>Integrações podem pedir o mesmo arquivo:</p>
      <pre>
        <code>GET /v2/relatorios/vendas?formato=csv&amp;periodo=2026-11</code>
      </pre>
      <ul>
        <li>O arquivo é gerado em segundo plano.</li>
        <li>
          A resposta traz o campo <code>status</code> até ficar <samp>pronto</samp>.
        </li>
      </ul>
      <hr />
      <p>
        <small>Atualizado em 6 de novembro de 2026.</small>
      </p>
    </Prose>
  ),
}

const excerpt = (
  <>
    <h2>Notificações por e-mail</h2>
    <p>
      Escolha quais avisos você recebe. Alertas de <strong>segurança</strong> são sempre enviados e
      não podem ser desligados. <a href="#preferencias">Ajustar preferências</a>.
    </p>
    <ul>
      <li>Resumo semanal de vendas</li>
      <li>Novos comentários em pedidos</li>
    </ul>
  </>
)

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 40 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <section key={size} aria-label={`Tamanho ${size}`}>
          <p className="or-eyebrow" style={{ margin: '0 0 12px' }}>
            {size}
          </p>
          <Prose {...args} size={size}>
            {excerpt}
          </Prose>
        </section>
      ))}
    </div>
  ),
}

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

/** HTML vindo de um CMS. Sanitize no servidor antes de renderizar. */
export const FromHtml: Story = {
  render: (args) => <Prose {...args} dangerouslySetInnerHTML={{ __html: notasDaVersao }} />,
}

export const TermsOfUse: Story = {
  args: { size: 'sm' },
  render: (args) => (
    <Prose {...args}>
      <h2>Termos de uso — 4. Uso da plataforma</h2>
      <p>Ao usar a plataforma, você concorda em:</p>
      <ol>
        <li>
          Manter seus dados de acesso em sigilo e não compartilhar a conta com outras pessoas.
        </li>
        <li>
          Não usar a plataforma para:
          <ol type="a">
            <li>enviar mensagens não solicitadas em massa;</li>
            <li>publicar conteúdo que viole direitos de terceiros.</li>
          </ol>
        </li>
        <li>Comunicar qualquer uso não autorizado assim que tomar conhecimento.</li>
      </ol>
      <dl>
        <dt>Conta</dt>
        <dd>Cadastro individual que dá acesso à plataforma.</dd>
        <dt>Espaço de trabalho</dt>
        <dd>Conjunto de lojas, pessoas e relatórios administrado por uma empresa.</dd>
      </dl>
      <p>
        <small>Versão vigente desde 1º de outubro de 2026.</small>
      </p>
    </Prose>
  ),
}

export const WithComponents: Story = {
  render: (args) => (
    <Prose {...args}>
      <h2>Antes de cancelar a assinatura</h2>
      <p>Componentes do Orange dentro do Prose mantêm o próprio estilo.</p>
      <Alert tone="warning" title="Os dados são apagados em 30 dias">
        Exporte seus relatórios antes de cancelar.
      </Alert>
      <p>O que nossos clientes dizem sobre a migração:</p>
      <Blockquote
        source={
          <>
            Marina Costa, <cite>Loja Ateliê Verde</cite>
          </>
        }
      >
        Levamos uma tarde para importar dois anos de pedidos.
      </Blockquote>
      <div className="or-not-prose" style={{ display: 'flex', gap: 8, marginTop: 24 }}>
        <Button variant="outline">Manter assinatura</Button>
        <Button variant="danger">Cancelar assinatura</Button>
      </div>
    </Prose>
  ),
}

const comandoWebhook = `curl -X POST https://api.exemplo.com.br/v2/webhooks -d '{"evento":"pedido.confirmado"}'`

/** 320px: URLs, palavras e linhas de código longas não alargam a página. */
export const NarrowViewport: Story = {
  render: (args) => (
    <div style={{ width: 320, outline: '1px dashed var(--or-color-border-strong)' }}>
      <Prose {...args}>
        <h3>Integração com o ERP</h3>
        <p>
          Configure o endereço{' '}
          <a href="#webhook">
            https://erp.empresa.com.br/integracoes/webhooks/pedidos-confirmados/v2
          </a>{' '}
          e o parâmetro <code>sincronizacaoAutomaticaDeEstoqueHabilitada</code>.
        </p>
        <pre tabIndex={0}>
          <code>{comandoWebhook}</code>
        </pre>
        <table tabIndex={0}>
          <caption>Eventos enviados</caption>
          <thead>
            <tr>
              <th scope="col">Evento</th>
              <th scope="col">Quando</th>
              <th scope="col">Tentativas</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>pedido.confirmado</code>
              </td>
              <td>Pagamento aprovado</td>
              <td>5</td>
            </tr>
            <tr>
              <td>
                <code>pedido.cancelado</code>
              </td>
              <td>Cancelamento pelo cliente ou pela loja</td>
              <td>5</td>
            </tr>
          </tbody>
        </table>
      </Prose>
    </div>
  ),
}
