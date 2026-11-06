import { Icon } from '@orangesys/ui'
import type { ReactNode } from 'react'
import { useLang, type Localized } from '../../i18n'
import { DocPage } from '../../kit'
import { isUnreleased } from '../../version'
import { REPO_URL } from '../registry'
import '../../styles/changelog.css'

type Kind = 'new' | 'improved' | 'fixed'

interface Entry {
  date: string
  version: string
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
    date: '2026-11-06',
    version: 'v1.3.1',
    title: {
      pt: 'NumberField com passos minúsculos exatos',
      en: 'NumberField with exact tiny steps',
    },
    summary: {
      pt: 'Uma correção no NumberField e uma limpeza interna: a contagem de casas decimais agora vem de um único lugar.',
      en: 'A NumberField fix and an internal cleanup: decimal-place counting now comes from a single place.',
    },
    items: [
      { kind: 'fixed', text: { pt: 'NumberField: step={1.5e-7} era arredondado para 0.0000002; agora o passo é exato (as casas da mantissa somam ao expoente).', en: 'NumberField: step={1.5e-7} was rounded to 0.0000002; the step is now exact (mantissa digits add to the exponent).' } },
      { kind: 'improved', text: { pt: 'NumberField, Slider e os eixos dos gráficos usam o mesmo utilitário interno de casas decimais e arredondamento — antes eram três cópias.', en: 'NumberField, Slider and the chart axes share one internal decimal-places and rounding utility — previously three copies.' } },
    ],
  },
  {
    date: '2026-11-06',
    version: 'v1.3.0',
    title: {
      pt: 'useScrollSpy: o índice com o seu visual',
      en: 'useScrollSpy: the index with your own look',
    },
    summary: {
      pt: 'O mecanismo que decide a seção atual do TableOfContents virou um hook público, para índices "Nesta página" com qualquer visual.',
      en: 'The mechanism that picks TableOfContents’ current section became a public hook, for “On this page” indexes with any look.',
    },
    items: [
      { kind: 'new', text: { pt: 'useScrollSpy(ids, { root, rootMargin }) devolve { activeId, setActiveId }: primeiro título na faixa, o que já passou entre dois títulos e o último à vista no fim da rolagem; setActiveId segura a marca do clique durante o salto.', en: 'useScrollSpy(ids, { root, rootMargin }) returns { activeId, setActiveId }: the first heading in the band, the one already passed between two headings, and the last one in view at the end of the scroll; setActiveId holds the click’s mark during the jump.' } },
      { kind: 'improved', text: { pt: 'TableOfContents e o índice desta documentação usam o hook — uma única implementação.', en: 'TableOfContents and these docs’ index use the hook — a single implementation.' } },
    ],
  },
  {
    date: '2026-11-06',
    version: 'v1.2.1',
    title: {
      pt: 'O fim da faixa sempre ao alcance',
      en: 'The end of the range always within reach',
    },
    summary: {
      pt: 'Uma revisão dos componentes em busca do mesmo defeito: o último item, seção, valor ou opção que não ficava visível ou não era alcançável.',
      en: 'A review of the components hunting the same defect: the last item, section, value or option that was not visible or not reachable.',
    },
    items: [
      { kind: 'fixed', text: { pt: 'TableOfContents e o índice desta documentação marcam a última seção no fim da rolagem, a seção certa ao subir e mantêm o item clicado.', en: 'TableOfContents and these docs’ index mark the last section at the end of the scroll, the right section when scrolling up, and keep the clicked item.' } },
      { kind: 'fixed', text: { pt: 'Reveal e useInView: o que fica nos últimos pixels da página aparece no fim da rolagem; esconder é instantâneo e appear volta a animar.', en: 'Reveal and useInView: content in the last pixels of the page shows up at the end of the scroll; hiding is instant and appear animates again.' } },
      { kind: 'fixed', text: { pt: 'Combobox, MultiSelect, Picker, Dropdown, ContextMenu, SplitButton e CommandPalette mantêm à vista a opção ou o item ativo nas pontas (↑, End, PageDown, volta das setas), inclusive com movimento reduzido.', en: 'Combobox, MultiSelect, Picker, Dropdown, ContextMenu, SplitButton and CommandPalette keep the active option or item in view at the ends (↑, End, PageDown, wrapping), including with reduced motion.' } },
      { kind: 'fixed', text: { pt: 'Tabs revela a aba cortada numa lista com rolagem; Table com cabeçalho fixo não esconde o foco sob ele (WCAG 2.4.11); Stepper compacto mostra o rótulo da última etapa ao concluir.', en: 'Tabs reveals a clipped tab in a scrolling list; Table with a sticky header no longer hides focus under it (WCAG 2.4.11); compact Stepper shows the last step’s label when finished.' } },
      { kind: 'fixed', text: { pt: 'Slider: saída, polegar e aria-valuenow concordam quando o passo não divide a faixa; min decimal e passos em notação exponencial funcionam; marks não perde a última marca.', en: 'Slider: output, thumb and aria-valuenow agree when the step does not divide the range; decimal min and exponent-notation steps work; marks keeps the last tick.' } },
      { kind: 'fixed', text: { pt: 'ProgressBar, ProgressCircle e FileUploader só mostram 100% ao concluir (99,6% era exibido como 100%).', en: 'ProgressBar, ProgressCircle and FileUploader only show 100% when complete (99.6% used to show as 100%).' } },
    ],
  },
  {
    date: '2026-11-06',
    version: 'v1.2.0',
    title: {
      pt: 'NavigationMenu, DateTimePicker, Chat e mais',
      en: 'NavigationMenu, DateTimePicker, Chat and more',
    },
    summary: {
      pt: 'A segunda leva da pesquisa de lacunas: menus de navegação com painéis, data e hora num campo, conversas, consentimento de cookies (LGPD), checklists de configuração, autosave e linhas expansíveis na Table.',
      en: 'The second batch from the gap research: navigation menus with panels, date and time in one field, conversations, cookie consent (LGPD), setup checklists, autosave and expandable rows in Table.',
    },
    items: [
      { kind: 'new', text: { pt: 'NavigationMenu (padrão APG de navegação por disclosure) e submenus no AppHeader, com seções sanfonadas no celular.', en: 'NavigationMenu (APG disclosure navigation pattern) and AppHeader submenus, with collapsible sections on mobile.' } },
      { kind: 'new', text: { pt: 'DateTimePicker: data e hora num campo só, com calendário, limites e defaultTime.', en: 'DateTimePicker: date and time in one field, with calendar, limits and defaultTime.' } },
      { kind: 'new', text: { pt: 'ChatThread, ChatMessage e ChatComposer: assistentes, suporte e comentários, com rolagem que respeita a leitura e anúncios sem ruído.', en: 'ChatThread, ChatMessage and ChatComposer: assistants, support and comments, with scrolling that respects reading and quiet announcements.' } },
      { kind: 'new', text: { pt: 'ConsentBanner: consentimento de cookies para a LGPD, com escolhas de mesmo peso e categorias granulares.', en: 'ConsentBanner: cookie consent for LGPD, with equally weighted choices and granular categories.' } },
      { kind: 'new', text: { pt: 'TaskList e SaveStatus: checklist de configuração com progresso e indicador de autosave.', en: 'TaskList and SaveStatus: setup checklist with progress and an autosave indicator.' } },
      { kind: 'improved', text: { pt: 'Table: linhas expansíveis com painel de detalhes; exemplo de colunas visíveis com Dropdown.', en: 'Table: expandable rows with a detail panel; visible-columns example with Dropdown.' } },
    ],
  },
  {
    date: '2026-11-06',
    version: 'v1.1.0',
    title: {
      pt: 'Oito componentes novos: Picker, ActionBar, ListView e mais',
      en: 'Eight new components: Picker, ActionBar, ListView and more',
    },
    summary: {
      pt: 'Comparamos o catálogo com shadcn/ui, Chakra, Mantine, React Aria, Carbon, Polaris, Atlassian e GOV.UK e preenchemos as lacunas mais usadas em apps: seleção rica, ações em lote, listas interativas, gráficos de participação e conteúdo de CMS.',
      en: 'We compared the catalog with shadcn/ui, Chakra, Mantine, React Aria, Carbon, Polaris, Atlassian and GOV.UK and filled the gaps apps use most: rich selection, bulk actions, interactive lists, share charts and CMS content.',
    },
    items: [
      { kind: 'new', text: { pt: 'Picker: select customizado com ícones, descrições e grupos (padrão APG select-only combobox), integrado ao Form.', en: 'Picker: custom select with icons, descriptions and groups (APG select-only combobox), integrated with Form.' } },
      { kind: 'new', text: { pt: 'ActionBar: ações em lote sobre uma seleção, com contagem anunciada e foco que nunca se perde.', en: 'ActionBar: bulk actions on a selection, with an announced count and focus that is never lost.' } },
      { kind: 'new', text: { pt: 'ListView: lista interativa com seleção, onAction e ações por linha (padrão APG Grid).', en: 'ListView: interactive list with selection, onAction and row actions (APG Grid pattern).' } },
      { kind: 'new', text: { pt: 'DonutChart e BarList: participação no todo e ranking, com tabela de dados e teclado como os outros gráficos.', en: 'DonutChart and BarList: share of a whole and rankings, with a data table and keyboard like the other charts.' } },
      { kind: 'new', text: { pt: 'Disclosure, Prose e Blockquote: mostrar/ocultar avulso, tipografia para HTML de CMS/Markdown e citações.', en: 'Disclosure, Prose and Blockquote: standalone show/hide, typography for CMS/Markdown HTML and quotations.' } },
      { kind: 'improved', text: { pt: 'CheckboxGroup ganha variant="card", igual ao RadioGroup.', en: 'CheckboxGroup gets variant="card", like RadioGroup.' } },
      { kind: 'fixed', text: { pt: 'Accordion: o conteúdo que fecha fica inert já durante a animação de saída.', en: 'Accordion: closing content becomes inert during the exit animation.' } },
      { kind: 'improved', text: { pt: 'Documentação: o selo “Novo” fica só para os componentes desta versão; os anteriores à 1.0 passam a estáveis.', en: 'Docs: the “New” badge is kept for this version’s components; everything before 1.0 is now stable.' } },
    ],
  },
  {
    date: '2026-11-06',
    version: 'v1.0.0',
    title: {
      pt: 'Orange 1.0: API estável',
      en: 'Orange 1.0: stable API',
    },
    summary: {
      pt: 'A API pública congela: daqui em diante, mudanças incompatíveis só numa nova major, sempre depois de uma depreciação. Saem os 14 nomes depreciados na 0.6.',
      en: 'The public API freezes: from now on, breaking changes only in a new major, always after a deprecation. The 14 names deprecated in 0.6 are removed.',
    },
    items: [
      { kind: 'improved', text: { pt: 'Removidas as props antigas: fullWidth (SegmentedControl), onValueChange (DropdownRadioGroup), onFilesChange (FileUploader), onSelectionChange (Table), visible (LoadingOverlay), onClose (Toast), type (ChipGroup e ToggleButtonGroup), activeStep (Stepper) e navBreakpoint (AppShell).', en: 'Removed the old props: fullWidth (SegmentedControl), onValueChange (DropdownRadioGroup), onFilesChange (FileUploader), onSelectionChange (Table), visible (LoadingOverlay), onClose (Toast), type (ChipGroup and ToggleButtonGroup), activeStep (Stepper) and navBreakpoint (AppShell).' } },
      { kind: 'improved', text: { pt: 'clamp, range, setRef e getFocusableElements saem da API pública; cx, mergeRefs, composeEventHandlers e interpolate continuam.', en: 'clamp, range, setRef and getFocusableElements leave the public API; cx, mergeRefs, composeEventHandlers and interpolate stay.' } },
      { kind: 'improved', text: { pt: 'O site acompanha a versão publicada sozinho: selo, versão atual e “em desenvolvimento” vêm do package.json.', en: 'The site follows the published version on its own: badge, current version and “unreleased” come from package.json.' } },
    ],
  },
  {
    date: '2026-11-06',
    version: 'v0.6.0',
    title: {
      pt: 'Revisão da API antes da 1.0: nomes consistentes',
      en: 'API review before 1.0: consistent names',
    },
    summary: {
      pt: 'Revisamos as props dos 157 componentes exportados e alinhamos dez nomes que fugiam das convenções da biblioteca. Os nomes antigos continuam funcionando até a v1.0, com aviso no console.',
      en: 'We reviewed the props of all 157 exported components and aligned ten names that strayed from the library conventions. The old names keep working until v1.0, with a console warning.',
    },
    items: [
      { kind: 'improved', text: { pt: 'SegmentedControl: fullWidth vira block, como no Button.', en: 'SegmentedControl: fullWidth becomes block, as in Button.' } },
      { kind: 'improved', text: { pt: 'DropdownRadioGroup: onValueChange vira onChange, e FileUploader: onFilesChange vira onChange — o par de value/defaultValue, como nos outros campos.', en: 'DropdownRadioGroup: onValueChange becomes onChange, and FileUploader: onFilesChange becomes onChange — the pair of value/defaultValue, as in other fields.' } },
      { kind: 'improved', text: { pt: 'Table: onSelectionChange vira onSelectedRowsChange, fechando o trio com selectedRows e defaultSelectedRows.', en: 'Table: onSelectionChange becomes onSelectedRowsChange, completing the trio with selectedRows and defaultSelectedRows.' } },
      { kind: 'improved', text: { pt: 'LoadingOverlay: visible vira open, e Toast: onClose vira onDismiss — os mesmos nomes das outras sobreposições e avisos.', en: 'LoadingOverlay: visible becomes open, and Toast: onClose becomes onDismiss — the same names as other overlays and notices.' } },
      { kind: 'improved', text: { pt: 'ChipGroup e ToggleButtonGroup: type vira selectionMode, como em Listbox e TreeView. Stepper: activeStep vira step, como no Tour. AppShell: navBreakpoint vira navDrawerBelow.', en: 'ChipGroup and ToggleButtonGroup: type becomes selectionMode, as in Listbox and TreeView. Stepper: activeStep becomes step, as in Tour. AppShell: navBreakpoint becomes navDrawerBelow.' } },
      { kind: 'new', text: { pt: 'invalid (estado inválido sem mensagem) em Field, CheckboxGroup, RadioGroup, ColorField, DatePicker, DateRangePicker, TimeField, Rating e FileUploader — agora todo campo com error também aceita invalid. Field passa a repassar ref.', en: 'invalid (invalid state without a message) on Field, CheckboxGroup, RadioGroup, ColorField, DatePicker, DateRangePicker, TimeField, Rating and FileUploader — every field with error now also accepts invalid. Field now forwards its ref.' } },
      { kind: 'improved', text: { pt: 'Os utilitários genéricos clamp, range, setRef e getFocusableElements saem da API pública na v1.0; cx, mergeRefs, composeEventHandlers e interpolate continuam.', en: 'The generic utilities clamp, range, setRef and getFocusableElements leave the public API in v1.0; cx, mergeRefs, composeEventHandlers and interpolate stay.' } },
      { kind: 'improved', text: { pt: 'As tabelas de props mostram as props depreciadas com selo, substituto e versão de remoção.', en: 'Props tables show deprecated props with a badge, replacement and removal version.' } },
    ],
  },
  {
    date: '2026-11-05',
    version: 'v0.5.1',
    title: {
      pt: '@orangesys/tokens também em CommonJS',
      en: '@orangesys/tokens in CommonJS too',
    },
    summary: {
      pt: 'Os tokens agora funcionam com require(), além de import — e é a primeira versão publicada pelo CI com trusted publishing, sem token do npm.',
      en: 'The tokens now work with require() as well as import — and this is the first version published from CI with trusted publishing, with no npm token.',
    },
    items: [
      { kind: 'fixed', text: { pt: "require('@orangesys/tokens'), /contrast e /dtcg funcionam em projetos CommonJS (configs, Jest, Node sem require de ESM, TypeScript com module node16), que antes davam ERR_REQUIRE_ESM ou TS1479.", en: "require('@orangesys/tokens'), /contrast and /dtcg work in CommonJS projects (configs, Jest, Node without require of ESM, TypeScript with module node16), which used to fail with ERR_REQUIRE_ESM or TS1479." } },
      { kind: 'improved', text: { pt: 'O build dos tokens confere o pacote antes de publicar: arquivos de cada entrada, CommonJS de verdade e os mesmos exports em ESM e CJS.', en: 'The tokens build checks the package before publishing: files for every entry point, real CommonJS and the same exports in ESM and CJS.' } },
      { kind: 'improved', text: { pt: 'Publicação no npm por trusted publishing (OIDC), com provenance e sem token guardado no repositório.', en: 'npm publishing through trusted publishing (OIDC), with provenance and no token stored in the repository.' } },
    ],
  },
  {
    date: '2026-11-05',
    version: 'v0.5.0',
    title: {
      pt: 'Roadmap 0.2 e 0.3 concluídos: alto contraste, modelos de página e publicação no npm',
      en: 'Roadmap 0.2 and 0.3 done: high contrast, page templates and npm publishing',
    },
    summary: {
      pt: 'Tudo o que a página Sobre prometia para as versões 0.2 e 0.3, mais a base da 1.0: política de depreciação e relatório de conformidade para a auditoria externa.',
      en: 'Everything the About page promised for versions 0.2 and 0.3, plus the groundwork for 1.0: a deprecation policy and a conformance report for the external audit.',
    },
    items: [
      { kind: 'new', text: { pt: 'Temas de alto contraste dark-hc e light-hc (AAA), com o modo Auto seguindo prefers-contrast: more.', en: 'High-contrast themes dark-hc and light-hc (AAA), with Auto following prefers-contrast: more.' } },
      { kind: 'new', text: { pt: 'Modelos de página inteira: Entrar, Painel e Configurações, com prévia em três larguras.', en: 'Full-page templates: Sign in, Dashboard and Settings, previewed at three widths.' } },
      { kind: 'new', text: { pt: 'Tokens no formato DTCG por modo e o script figma:sync para as variáveis do Figma.', en: 'Per-mode DTCG tokens and the figma:sync script for Figma variables.' } },
      { kind: 'new', text: { pt: 'Pacotes @orangesys/tokens e @orangesys/ui no npm, publicados pelo CI com changesets, changelog automático e provenance; regressão visual dos dois temas no CI.', en: '@orangesys/tokens and @orangesys/ui on npm, published from CI with changesets, an automated changelog and provenance; visual regression for both themes in CI.' } },
      { kind: 'new', text: { pt: 'Política de versionamento e depreciação, e relatório de conformidade WCAG 2.2 para auditores.', en: 'Versioning and deprecation policy, and a WCAG 2.2 conformance report for auditors.' } },
      { kind: 'improved', text: { pt: 'forced-colors (contraste do Windows) em todos os componentes, com teste que impede regressões.', en: 'forced-colors (Windows contrast themes) in every component, with a test that prevents regressions.' } },
      { kind: 'fixed', text: { pt: 'SortableList: o arraste agora alcança a última posição.', en: 'SortableList: dragging now reaches the last position.' } },
      { kind: 'fixed', text: { pt: 'AppShell: o cabeçalho fixo não esconde mais o elemento em foco ao rolar.', en: 'AppShell: the sticky header no longer hides the focused element when scrolling.' } },
      { kind: 'fixed', text: { pt: 'OrangeProvider aninhado só para o idioma agora herda o tema de fora.', en: 'A nested OrangeProvider used only for the locale now inherits the outer theme.' } },
    ],
  },
  {
    date: '2026-11-05',
    version: 'v0.4.0',
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
              {isUnreleased(entry.version) && (
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
