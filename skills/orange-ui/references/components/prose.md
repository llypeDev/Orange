# Prose

Aplica a tipografia do Orange a conteúdo rico que a aplicação não controla: HTML de CMS, Markdown, artigos e termos de uso.

- Categoria: Exibição de dados · Status: novo
- Importação: `import { Prose } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/prose (em inglês: https://orange.llypedev.com.br/en/components/prose)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-prose--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Prose

## Boas práticas

- Use para conteúdo que não é montado componente por componente: artigos da central de ajuda, termos de uso, notas de versão, HTML de um CMS ou Markdown convertido. Nas telas do produto, use Heading, Text, List e os demais componentes.
- Passe o HTML pronto com `dangerouslySetInnerHTML` no próprio Prose, não em um `div` interno: assim a margem do primeiro e do último bloco é cortada.
- Componentes do Orange dentro do Prose mantêm o próprio estilo. Para um trecho que não deve receber a tipografia (botões, um widget de terceiros), use `className="or-not-prose"`.
- Mantenha `measure` ligado em textos longos (linhas de até ~68 caracteres). Desligue em colunas que já têm largura própria, como cartões e painéis laterais.
- A hierarquia de títulos é do conteúdo: se a página já tem um h1, o artigo começa no h2.

> **Sanitize o HTML** O Prose só aplica a tipografia: ele não limpa nem valida o HTML. Conteúdo de CMS, Markdown ou escrito por usuários precisa ser sanitizado pela aplicação — de preferência no servidor, com DOMPurify ou sanitize-html — antes de chegar ao dangerouslySetInnerHTML. Sem isso, um <script> ou um atributo onerror no conteúdo vira XSS.

```tsx
import DOMPurify from 'isomorphic-dompurify'

// No servidor (ou no loader da rota), antes de chegar ao componente:
const html = DOMPurify.sanitize(artigo.corpoHtml)

<Prose as="article" dangerouslySetInnerHTML={{ __html: html }} />
```

## Elementos estilizados

- **Títulos h1–h6** — Space Grotesk na escala do Heading: no tamanho md, h1 = 4xl … h6 = md. sm desce um degrau e lg sobe um.
- **Texto** — p, strong (semibold), em, small (texto secundário), sub e sup (sem abrir a entrelinha).
- **Links** — O visual do Link: sublinhado laranja de 1px que engrossa e se aproxima do texto no hover e no foco, com contorno de foco de 2px.
- **Listas** — ul com o quadrado laranja e ol com a numeração "01" da List, usando marcadores nativos (::marker). ol com type="a" ou "i" mantém o tipo pedido.
- **Listas de definição** — dt em semibold e dd recuado.
- **Citações** — blockquote com a barra de acento do Blockquote. Em <figure><blockquote/><figcaption/></figure>, a legenda vira a fonte, com travessão.
- **Código** — code e samp em linha com moldura de 1px; kbd com o visual do Kbd (inclusive combinações <kbd><kbd>Ctrl</kbd>+<kbd>K</kbd></kbd>); pre na superfície escura do CodeBlock, com rolagem horizontal.
- **Tabelas** — Bordas, legenda e cabeçalho em caixa alta do Table. Tabelas largas rolam dentro delas mesmas; o alinhamento do Markdown (align="right") é respeitado.
- **Mídia** — img e video com largura máxima de 100%; figcaption em texto secundário, como no Image.
- **Divisor e marca** — hr como a linha de 1px do Divider; mark com o fundo e o sublinhado do Highlight.

Ritmo vertical: os blocos são separados por 16, 20 ou 24px (sm, md, lg); títulos ganham mais espaço acima do que abaixo; a primeira e a última margem são cortadas. Todos os seletores usam `:where()` e pesam o mesmo que uma classe — vencem resets globais, mas nunca o estilo de um componente. Elementos com classe do Orange (`or-*`) e tudo dentro de `.or-not-prose` ficam de fora.

```css
/* Todo seletor do Prose pesa (0,1,0): vence resets como p { margin: 0 }, nunca uma classe. */
.or-prose :where(h2):not(:where([class^='or-'], [class*=' or-'], .or-not-prose *)) {
  font-family: var(--or-font-display);
}
```

## Exemplos

### Artigo da central de ajuda

Como article, nomeado pelo h1. Títulos, lista numerada, atalho de teclado, figura, tabela e citação.

```tsx
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
```

### HTML de um CMS

Notas de versão vindas do CMS, já sanitizadas no servidor, passadas com dangerouslySetInnerHTML.

```tsx
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
```

### Termos de uso em tamanho sm

Texto de 13px para conteúdo denso. A sublista com type="a" mantém as letras.

```tsx
import { Prose } from '@orangesys/ui'

export default function TermsOfUse() {
  return (
    <Prose size="sm">
      <h2>4. Uso da plataforma</h2>
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
      <h3>Definições</h3>
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
  )
}
```

### Componentes e or-not-prose

Alert e Blockquote mantêm o próprio estilo; os botões ficam em um trecho or-not-prose.

```tsx
import { Alert, Blockquote, Button, Prose } from '@orangesys/ui'

export default function WithComponents() {
  return (
    <Prose>
      <h2>Antes de cancelar a assinatura</h2>
      <p>Os componentes do Orange dentro do Prose mantêm o próprio estilo.</p>
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
      {/* Fora da tipografia do Prose: margens e layout ficam com a aplicação. */}
      <div
        className="or-not-prose"
        style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 24 }}
      >
        <Button variant="outline">Manter assinatura</Button>
        <Button variant="danger">Cancelar assinatura</Button>
      </div>
    </Prose>
  )
}
```

### Conteúdo largo em 320px

URLs e palavras longas quebram; código e tabelas rolam dentro do próprio bloco, sem alargar a página.

```tsx
import { Prose } from '@orangesys/ui'

const comandoWebhook = `curl -X POST https://api.exemplo.com.br/v2/webhooks -d '{"evento":"pedido.confirmado"}'`

export default function Overflow() {
  return (
    <div
      style={{ width: '100%', maxWidth: 320, outline: '1px dashed var(--or-color-border-strong)' }}
    >
      <Prose>
        <h3>Integração com o ERP</h3>
        <p>
          Configure o endereço{' '}
          <a href="#webhook">
            https://erp.empresa.com.br/integracoes/webhooks/pedidos-confirmados/v2
          </a>{' '}
          e ative <code>sincronizacaoAutomaticaDeEstoqueHabilitada</code>.
        </p>
        {/* tabIndex: a área rolável precisa ser alcançável pelo teclado. */}
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
  )
}
```

## Props

### `Prose`

Aplica a tipografia do Orange a conteúdo rico que a aplicação não controla
— HTML de um CMS, Markdown convertido, artigos de ajuda, termos de uso.
Estiliza os elementos descendentes (títulos, parágrafos, listas, tabelas,
código…) com seletores de baixa especificidade: componentes do Orange e
trechos marcados com `className="or-not-prose"` mantêm o próprio estilo.

Para HTML pronto, passe `dangerouslySetInnerHTML` — **sanitizar o HTML é
responsabilidade da aplicação** (ex.: DOMPurify no servidor).

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `as` | `ElementType` | `div` | Elemento renderizado. Padrão: `div`. Use `article` para um artigo completo. |
| `measure` | `boolean` | `true` | Limita a largura a uma medida confortável de leitura (68 caracteres). Use `false` para ocupar toda a largura do contêiner. Padrão: `true`. |
| `size` | `"sm" \| "md" \| "lg"` | `md` | Tamanho do texto e do ritmo vertical: `sm` (13px), `md` (15px, padrão) ou `lg` (17px). Os títulos seguem a escala do `Heading` — `sm` desce um degrau e `lg` sobe um. |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Acessibilidade

O Prose não muda a semântica do conteúdo: títulos, listas, tabelas e citações continuam sendo o que o HTML diz. As listas usam marcadores nativos ( `::marker`), então o Safari mantém a semântica de lista. Links se distinguem do texto pelo sublinhado, não só pela cor.

**Rolagem horizontal.** Um `pre` ou uma tabela mais largos que a coluna rolam dentro do próprio bloco. Para rolar pelo teclado, a área precisa receber foco — o que o CSS não consegue fazer. O Chrome (130+) e o Firefox tornam essas áreas focáveis sozinhos; para o Safari, adicione `tabindex="0"` ao `pre` e às tabelas largas no seu renderizador de Markdown/HTML (e permita o atributo no sanitizador). As tabelas usam `display: block` para rolar; em combinações antigas de navegador e leitor de tela, isso pode esconder a semântica de tabela. Para tabelas de dados importantes, use o componente **Table** dentro de um trecho `or-not-prose`.

| Teclas | Ação |
| --- | --- |
| `Tab` | Move o foco para os links e para as áreas roláveis focáveis. |
| `←` + `→` | Rolam horizontalmente o pre ou a tabela em foco. |

- **1.3.1** — A semântica do HTML é preservada; listas mantêm marcadores nativos.
- **1.4.1** — Links sublinhados, não identificados só pela cor.
- **1.4.8** — Linhas de até ~68 caracteres com measure e entrelinha de 1,55 a 1,7 (AAA).
- **1.4.10** — Sem rolagem horizontal da página em 320px: palavras longas quebram; código e tabelas rolam no próprio bloco.
- **1.4.12** — Sem alturas fixas: o conteúdo acompanha ajustes de entrelinha e de espaçamento entre letras e parágrafos.
- **2.4.7** — Foco visível de 2px em links, pre e tabelas focáveis.
