import { Icon } from '@orange/ui'
import type { ReactNode } from 'react'
import { useLang, type Localized } from '../../i18n'
import { DocPage } from '../../kit'
import { REPO_URL } from '../registry'
import '../../styles/changelog.css'

type Kind = 'new' | 'improved' | 'fixed'

interface Entry {
  date: string
  version: string
  unreleased?: boolean
  title: Localized<string>
  summary: Localized<string>
  items: { kind: Kind; text: Localized<ReactNode> }[]
}

const kindLabel: Record<Kind, Localized<string>> = {
  new: { pt: 'Novo', en: 'New' },
  improved: { pt: 'Melhoria', en: 'Improved' },
  fixed: { pt: 'Correção', en: 'Fixed' },
}

/** Histórico real do projeto (ver `git log`). */
const entries: Entry[] = [
  {
    date: '2026-11-05',
    version: 'v0.4.0',
    unreleased: true,
    title: {
      pt: 'Gráficos, reordenação, tour guiado, painéis redimensionáveis e Listbox',
      en: 'Charts, reordering, guided tours, resizable panels and Listbox',
    },
    summary: {
      pt: 'A segunda leva da pesquisa comparativa: os padrões que ficaram de fora da v0.3.0, todos operáveis sem mouse e sem depender só de cor.',
      en: 'The second batch from the comparative research: the patterns left out of v0.3.0, all operable without a mouse and never relying on color alone.',
    },
    items: [
      { kind: 'new', text: { pt: 'BarChart, LineChart e Sparkline em SVG puro, com tabela de dados alternativa e exploração por teclado.', en: 'BarChart, LineChart and Sparkline in plain SVG, with an alternative data table and keyboard exploration.' } },
      { kind: 'new', text: { pt: 'Tokens de visualização de dados (categórico, sequencial e divergente) nos dois temas, com contraste testado.', en: 'Data-visualization tokens (categorical, sequential and diverging) in both themes, with tested contrast.' } },
      { kind: 'new', text: { pt: 'SortableList: reordene arrastando, pelo teclado ou com os botões "Mover para cima/baixo" (WCAG 2.5.7).', en: 'SortableList: reorder by dragging, by keyboard or with "Move up/down" buttons (WCAG 2.5.7).' } },
      { kind: 'new', text: { pt: 'Tour: passo a passo com destaque no elemento, foco gerenciado e painel inferior no celular.', en: 'Tour: step-by-step walkthrough with a spotlight on the element, managed focus and a bottom sheet on phones.' } },
      { kind: 'new', text: { pt: 'Splitter: painéis redimensionáveis no padrão APG Window Splitter, com recolher pelo Enter.', en: 'Splitter: resizable panels following the APG Window Splitter pattern, with Enter to collapse.' } },
      { kind: 'new', text: { pt: 'Listbox: lista de seleção única ou múltipla, com grupos, busca ao digitar e integração com o Form.', en: 'Listbox: single or multiple selection list, with groups, type-ahead and Form integration.' } },
    ],
  },
  {
    date: '2026-11-05',
    version: 'v0.3.0',
    title: {
      pt: 'Dez componentes que faltavam: layout, estrutura de página, formulários e mídia',
      en: 'Ten missing components: layout, page structure, forms and media',
    },
    summary: {
      pt: 'Escolhidos por uma pesquisa comparativa: o catálogo do component.gallery (cerca de 100 design systems) cruzado com Primer, Atlassian e Carbon. Entraram os que quase todos têm e que o Orange não tinha.',
      en: 'Chosen through comparative research: the component.gallery catalogue (around 100 design systems) cross-checked with Primer, Atlassian and Carbon. In came the ones nearly all of them ship and Orange lacked.',
    },
    items: [
      { kind: 'new', text: { pt: 'Stack, Grid e Container: primitivas de layout responsivas só com CSS, incluindo a grade com linhas de 1px do zop.dev.', en: 'Stack, Grid and Container: CSS-only responsive layout primitives, including the zop.dev 1px-line grid.' } },
      { kind: 'new', text: { pt: 'PageHeader, AppShell e Footer: título de página com trilha e ações, esqueleto de app com navegação recolhível que vira gaveta no celular, e rodapé em mapa do site.', en: 'PageHeader, AppShell and Footer: page title with breadcrumbs and actions, an app scaffold with collapsible navigation that becomes a drawer on phones, and a sitemap footer.' } },
      { kind: 'new', text: { pt: 'Form: validação no envio com resumo de erros focado e links para os campos, no padrão do GOV.UK.', en: 'Form: submit-time validation with a focused error summary linking to each field, following the GOV.UK pattern.' } },
      { kind: 'new', text: { pt: 'DateRangePicker e RangeCalendar: período com dois meses, atalhos como "Últimos 7 dias" e limites de duração.', en: 'DateRangePicker and RangeCalendar: date ranges across two months, presets such as "Last 7 days" and length limits.' } },
      { kind: 'new', text: { pt: 'Carousel no padrão APG, com pausa como primeiro controle, e Image com proporção fixa, carregamento lento e fallback.', en: 'Carousel following the APG pattern, with pause as the first control, and Image with fixed aspect ratio, lazy loading and fallback.' } },
      { kind: 'fixed', text: { pt: 'Títulos longos de página quebram em 320px em vez de estourar a largura da tela.', en: 'Long page titles wrap at 320px instead of overflowing the screen.' } },
    ],
  },
  {
    date: '2026-11-04',
    version: 'v0.2.0',
    title: {
      pt: 'Motion em todo o sistema, com a linguagem do zop.dev',
      en: 'Motion across the system, in the zop.dev language',
    },
    summary: {
      pt: 'Tokens de movimento, saídas animadas em todas as sobreposições e uma seção Movimento em cada página de componente. Tudo desliga com prefers-reduced-motion.',
      en: 'Motion tokens, animated exits on every overlay and a Motion section on every component page. Everything turns off with prefers-reduced-motion.',
    },
    items: [
      { kind: 'new', text: { pt: 'Tokens press, reveal e loop, curva bounce, distâncias e stagger.', en: 'press, reveal and loop tokens, bounce curve, distances and stagger.' } },
      { kind: 'new', text: { pt: 'Hooks usePresence, useInView, useCountUp e useScrollDirection; componente Reveal.', en: 'usePresence, useInView, useCountUp and useScrollDirection hooks; Reveal component.' } },
      { kind: 'improved', text: { pt: 'Popovers, menus, tooltips, toasts e listboxes animam também ao fechar.', en: 'Popovers, menus, tooltips, toasts and listboxes now animate on close too.' } },
      { kind: 'improved', text: { pt: 'Indicadores deslizantes em abas, segmentos e switch; checks desenhados; cartões que sobem.', en: 'Sliding indicators in tabs, segments and switch; drawn checks; lifting cards.' } },
      { kind: 'improved', text: { pt: 'Site: cabeçalho que se esconde ao rolar, revelação das seções e botão "Pausar animações".', en: 'Site: header that hides on scroll, section reveals and a "Pause animations" button.' } },
      { kind: 'fixed', text: { pt: 'Estados desabilitados expõem aria-disabled no contêiner do campo.', en: 'Disabled states expose aria-disabled on the field container.' } },
      { kind: 'fixed', text: { pt: 'Paginator importa os estilos de controle que usava.', en: 'Paginator now imports the control styles it relied on.' } },
    ],
  },
  {
    date: '2026-11-03',
    version: 'v0.1.0',
    title: { pt: 'Primeira versão do Orange', en: 'First release of Orange' },
    summary: {
      pt: 'Tokens, biblioteca React, documentação bilíngue e Storybook — construídos em paralelo e testados com axe-core desde o primeiro componente.',
      en: 'Tokens, React library, bilingual docs and Storybook — built in parallel and tested with axe-core from the very first component.',
    },
    items: [
      { kind: 'new', text: { pt: '85 componentes acessíveis em 8 categorias, com testes e stories.', en: '85 accessible components in 8 categories, with tests and stories.' } },
      { kind: 'new', text: { pt: 'Temas claro e escuro com contraste validado em testes.', en: 'Light and dark themes with contrast validated in tests.' } },
      { kind: 'new', text: { pt: 'Documentação PT/EN: guidelines, guias de uso e uma página por componente.', en: 'PT/EN docs: guidelines, usage guides and one page per component.' } },
      { kind: 'new', text: { pt: 'Storybook 9 com painel de acessibilidade, temas e idiomas.', en: 'Storybook 9 with accessibility panel, themes and languages.' } },
    ],
  },
]

function formatDate(date: string, lang: 'pt' | 'en') {
  return new Intl.DateTimeFormat(lang === 'pt' ? 'pt-BR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`))
}

export default function Changelog() {
  const { t, lang } = useLang()
  return (
    <DocPage
      hero={{
        align: 'center',
        actions: (
          <a href={`${REPO_URL}/commits`} target="_blank" rel="noreferrer" className="chg-link or-nudge">
            {t({ pt: 'Histórico completo no GitHub', en: 'Full history on GitHub' })}{' '}
            <Icon name="arrow-up-right" size="sm" className="or-nudge__icon" />
            <span className="or-visually-hidden">{t({ pt: '(abre em nova aba)', en: '(opens in a new tab)' })}</span>
          </a>
        ),
      }}
      eyebrow={{ pt: 'Orange', en: 'Orange' }}
      title={{ pt: 'Novidades', en: 'Changelog' }}
      lead={{
        pt: 'Cada versão, cada melhoria, cada correção — em ordem, do mais recente para o mais antigo.',
        en: 'Every release, every improvement, every fix — in order, newest first.',
      }}
      toc={false}
    >
      <ol className="chg-list">
        {entries.map((entry) => (
          <li key={entry.version} className="chg-entry">
            <div className="chg-entry__meta">
              <time className="chg-entry__date" dateTime={entry.date}>
                {formatDate(entry.date, lang)}
              </time>
              <span className="chg-entry__version">{entry.version}</span>
              {entry.unreleased && (
                <span className="chg-entry__status">{t({ pt: 'Em desenvolvimento', en: 'Unreleased' })}</span>
              )}
            </div>
            <div className="chg-entry__body">
              <h2 className="chg-entry__title">{t(entry.title)}</h2>
              <p className="chg-entry__summary">{t(entry.summary)}</p>
              <ul className="chg-items">
                {entry.items.map((item, i) => (
                  <li key={i} className="chg-item">
                    <span className={`chg-tag chg-tag--${item.kind}`}>{t(kindLabel[item.kind])}</span>
                    <span>{t(item.text)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </DocPage>
  )
}
