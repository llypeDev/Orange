import { Code } from '../../../kit'
import { TemplateDocPage } from '../_shared/TemplateDocPage'
import Dashboard from './Dashboard'
import DashboardCss from './Dashboard.css?raw'
import DashboardCode from './Dashboard?raw'
import DataCode from './data?raw'

export default function DashboardTemplatePage() {
  return (
    <TemplateDocPage
      path="/templates/dashboard"
      title={{ pt: 'Painel', en: 'Dashboard' }}
      lead={{
        pt: 'Visão geral de uma loja: AppShell com cabeçalho e menu lateral, filtro de período, indicadores com tendência, dois gráficos e a tabela de pedidos recentes com paginação.',
        en: "A store overview: AppShell with a header and side menu, a date range filter, KPIs with trends, two charts and the recent orders table with pagination.",
      }}
      embedTitle="Painel · Aurora"
      template={<Dashboard />}
      overview={{
        pt: (
          <p>
            Um painel junta muita informação em pouco espaço. A estrutura vem pronta do <Code>AppShell</Code> — landmarks,
            link de atalho, barra lateral que vira painel no celular — e o conteúdo segue uma ordem de leitura simples:
            título e filtro, números, gráficos, detalhes. O período escolhido filtra a tabela de pedidos de verdade; os
            indicadores e gráficos usam dados fixos de exemplo.
          </p>
        ),
        en: (
          <p>
            A dashboard packs a lot of information into little space. The structure comes ready from{' '}
            <Code>AppShell</Code> — landmarks, skip link, a sidebar that becomes a panel on phones — and the content
            follows a simple reading order: title and filter, numbers, charts, details. The chosen period really filters
            the orders table; KPIs and charts use fixed sample data.
          </p>
        ),
      }}
      components={[
        {
          slug: 'app-shell',
          why: {
            pt: 'Estrutura da página: cabeçalho fixo, barra lateral (painel abaixo de 1024px), conteúdo e o link "Pular para o conteúdo principal".',
            en: 'Page structure: sticky header, sidebar (a panel below 1024px), content and the "Skip to main content" link.',
          },
        },
        {
          slug: 'app-header',
          why: {
            pt: 'Marca com o AppShellNavToggle, notificações e avatar.',
            en: 'Brand with AppShellNavToggle, notifications and avatar.',
          },
        },
        {
          slug: 'side-nav',
          why: {
            pt: 'Navegação do produto com grupo recolhível, contador e seção; a página atual tem aria-current.',
            en: 'Product navigation with a collapsible group, a counter and a section; the current page has aria-current.',
          },
        },
        {
          slug: 'page-header',
          why: {
            pt: 'Título, contexto (loja) e resumo do período, com o filtro e a ação principal à direita — que descem para baixo do título em telas estreitas.',
            en: 'Title, context (store) and period summary, with the filter and main action on the right — they wrap below the title on narrow screens.',
          },
        },
        {
          slug: 'date-range-picker',
          why: {
            pt: 'Filtro de período com atalhos (últimos 7 e 30 dias, este mês, mês passado) e limite em hoje.',
            en: 'Period filter with presets (last 7 and 30 days, this month, last month) capped at today.',
          },
        },
        {
          slug: 'grid',
          why: {
            pt: 'Indicadores em grade com bordas e minItemWidth (quantas colunas couberem, sem media query); gráficos lado a lado a partir de 1280px.',
            en: 'KPIs in a bordered grid with minItemWidth (as many columns as fit, no media query); charts side by side from 1280px.',
          },
        },
        {
          slug: 'stat',
          why: {
            pt: 'Cada número com rótulo, variação e contexto. Em "Cancelamentos", a queda é boa notícia (deltaTone="positive").',
            en: 'Each number with a label, change and context. In "Cancelamentos", a drop is good news (deltaTone="positive").',
          },
        },
        {
          slug: 'sparkline',
          why: {
            pt: 'Tendência de 14 dias com a conclusão em palavras como texto alternativo.',
            en: '14-day trend with the takeaway in words as alternative text.',
          },
        },
        {
          slug: 'bar-chart',
          why: {
            pt: 'Receita por canal, com resumo, fonte e tabela de dados acessível.',
            en: 'Revenue by channel, with a summary, source and accessible data table.',
          },
        },
        {
          slug: 'line-chart',
          why: {
            pt: 'Pedidos por dia comparando duas semanas: cor, traço e marcador diferentes por série.',
            en: 'Orders per day comparing two weeks: different color, dash and marker per series.',
          },
        },
        {
          slug: 'table',
          why: {
            pt: 'Pedidos com cabeçalho de linha, ordenação controlada (manualSort, sobre a lista inteira) e estado vazio.',
            en: 'Orders with a row header, controlled sorting (manualSort, over the whole list) and an empty state.',
          },
        },
        {
          slug: 'badge',
          why: {
            pt: 'Ponto de status ao lado do texto na tabela e contador sobre o botão de notificações.',
            en: 'Status dot next to the text in the table and a counter on the notifications button.',
          },
        },
        {
          slug: 'paginator',
          why: {
            pt: 'Paginação com "1–6 de 30"; volta para a página 1 quando o filtro ou a ordem mudam.',
            en: 'Pagination with "1–6 of 30"; goes back to page 1 when the filter or sort order changes.',
          },
        },
      ]}
      tryIt={[
        {
          pt: 'Escolha "Últimos 7 dias" no calendário: a tabela, a contagem e a paginação acompanham o período.',
          en: 'Pick "Last 7 days" in the calendar: the table, the count and the pagination follow the period.',
        },
        {
          pt: 'Ordene por Total e navegue pelas páginas: a ordem vale para a lista inteira.',
          en: 'Sort by Total and page through: the order applies to the whole list.',
        },
        {
          pt: 'Troque para Tablet ou Celular: a barra lateral vira um painel aberto pelo botão de menu, os indicadores se reorganizam e a tabela rola dentro da própria moldura.',
          en: 'Switch to Tablet or Phone: the sidebar becomes a panel opened by the menu button, KPIs reflow and the table scrolls inside its own frame.',
        },
      ]}
      docsAdjustments={[
        {
          pt: (
            <>
              <Code>{'<AppShell mainElement="div">'}</Code>: a documentação já tem o seu <Code>&lt;main&gt;</Code>. Em um
              app, remova a prop.
            </>
          ),
          en: (
            <>
              <Code>{'<AppShell mainElement="div">'}</Code>: the docs already have their own <Code>&lt;main&gt;</Code>. In
              an app, remove the prop.
            </>
          ),
        },
        {
          pt: (
            <>
              <Code>{'<PageHeader headingLevel={2}>'}</Code> e seções em <Code>h3</Code>; em um app, o título é{' '}
              <Code>h1</Code> (o padrão) e as seções, <Code>h2</Code>.
            </>
          ),
          en: (
            <>
              <Code>{'<PageHeader headingLevel={2}>'}</Code> and sections in <Code>h3</Code>; in an app, the title is{' '}
              <Code>h1</Code> (the default) and sections are <Code>h2</Code>.
            </>
          ),
        },
      ]}
      files={[
        { name: 'Dashboard.tsx', code: DashboardCode, language: 'tsx' },
        { name: 'data.ts', code: DataCode, language: 'ts' },
        { name: 'Dashboard.css', code: DashboardCss, language: 'css' },
      ]}
      a11y={[
        {
          topic: { pt: 'Landmarks', en: 'Landmarks' },
          criteria: '1.3.1 · 2.4.1',
          description: {
            pt: 'Cabeçalho (AppHeader), navegação nomeada (SideNav), conteúdo principal e o link "Pular para o conteúdo principal" como primeiro foco. A paginação é outro <nav>, com nome próprio.',
            en: 'Header (AppHeader), named navigation (SideNav), main content and the "Skip to main content" link as the first focus stop. Pagination is another <nav>, with its own name.',
          },
        },
        {
          topic: { pt: 'Ordem dos títulos', en: 'Heading order' },
          criteria: '1.3.1 · 2.4.6',
          description: {
            pt: '"Visão geral" e, abaixo dele, uma seção por assunto: Indicadores, Vendas e Pedidos recentes, cada uma nomeada pelo seu título. Os gráficos são <figure> com legenda, não títulos.',
            en: '"Visão geral" and, below it, one section per topic: Indicadores, Vendas and Pedidos recentes, each named by its heading. Charts are <figure>s with captions, not headings.',
          },
        },
        {
          topic: { pt: 'Ordem do foco', en: 'Focus order' },
          criteria: '2.4.3',
          description: {
            pt: 'Atalho → menu e marca → notificações → navegação lateral → filtro de período → Novo pedido → gráficos → cabeçalhos ordenáveis → paginação. No celular, o menu abre um painel modal que prende o foco e o devolve ao botão.',
            en: 'Skip link → menu and brand → notifications → side navigation → period filter → Novo pedido → charts → sortable headers → pagination. On phones, the menu opens a modal panel that traps focus and returns it to the button.',
          },
        },
        {
          topic: { pt: 'Erros e estados', en: 'Errors and states' },
          criteria: '3.3.1 · 4.1.3',
          description: {
            pt: 'Datas inválidas no filtro aparecem na mensagem do próprio campo. A contagem de pedidos é anunciada (aria-live) quando o período muda, e um período sem pedidos mostra um estado vazio com o que fazer.',
            en: 'Invalid dates in the filter show up in the field’s own message. The order count is announced (aria-live) when the period changes, and a period with no orders shows an empty state saying what to do.',
          },
        },
        {
          topic: { pt: 'Cor e gráficos', en: 'Color and charts' },
          criteria: '1.1.1 · 1.4.1',
          description: {
            pt: 'Status com texto ao lado do ponto colorido; sparklines com a conclusão em palavras; gráficos com resumo, tabela de dados e séries que diferem também por traço e marcador.',
            en: 'Statuses with text next to the colored dot; sparklines with the takeaway in words; charts with a summary, a data table and series that also differ by dash and marker.',
          },
        },
        {
          topic: { pt: 'Refluxo', en: 'Reflow' },
          criteria: '1.4.10',
          description: {
            pt: 'Em 390px não há rolagem horizontal da página: a navegação vai para o painel, os indicadores empilham e só a tabela rola, dentro da própria região focável.',
            en: 'At 390px there is no horizontal page scrolling: navigation moves to the panel, KPIs stack and only the table scrolls, inside its own focusable region.',
          },
        },
      ]}
    />
  )
}
