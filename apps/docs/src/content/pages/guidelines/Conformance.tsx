import { Tag, type TagTone } from '@orangesys/ui'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { T, useLang, type Localized } from '../../../i18n'
import { Bullets, Callout, Code, DocPage, Prose, Section } from '../../../kit'
import { Checklist, Segmented, Stats, TableWrap } from '../_shared/Blocks'
import '../../../styles/conformance.css'

/* ---------------------------------------------------------------------------
 * Relatório de conformidade (estilo VPAT/ACR) — autoavaliação do Orange frente
 * a todos os critérios A e AA da WCAG 2.2. Não substitui a auditoria externa
 * prevista para a 1.0: prepara o material que a pessoa auditora vai precisar.
 * ------------------------------------------------------------------------- */

type Status = 'supports' | 'partial' | 'na' | 'verify' | 'app'

const statusMeta: Record<Status, { label: Localized<string>; tone: TagTone }> = {
  supports: { label: { pt: 'Suporta', en: 'Supports' }, tone: 'success' },
  partial: { label: { pt: 'Suporta parcialmente', en: 'Partially supports' }, tone: 'warning' },
  na: { label: { pt: 'Não se aplica', en: 'Not applicable' }, tone: 'neutral' },
  verify: { label: { pt: 'A verificar', en: 'To verify' }, tone: 'info' },
  app: { label: { pt: 'Responsabilidade da aplicação', en: 'App responsibility' }, tone: 'accent' },
}

const statusOrder: Status[] = ['supports', 'partial', 'na', 'verify', 'app']

interface Criterion {
  id: string
  name: Localized<string>
  level: 'A' | 'AA'
  status: Status
  how: Localized<string>
  evidence: Localized<string>
}

const principles: { title: Localized<string>; criteria: Criterion[] }[] = [
  {
    title: { pt: '1. Perceptível', en: '1. Perceivable' },
    criteria: [
      {
        id: '1.1.1',
        name: { pt: 'Conteúdo não textual', en: 'Non-text Content' },
        level: 'A',
        status: 'supports',
        how: {
          pt: 'Ícones são decorativos (aria-hidden) até receberem label; botões só com ícone exigem nome; Image e Avatar recebem alt; gráficos têm nome e a tabela “Ver dados”.',
          en: 'Icons are decorative (aria-hidden) until given a label; icon-only buttons require a name; Image and Avatar take alt; charts have a name and a “View data” table.',
        },
        evidence: {
          pt: 'axe (testes unitários e varredura do Storybook). Icon, IconButton, Image, Avatar, BarChart, LineChart, Sparkline. O alt do conteúdo é da aplicação.',
          en: 'axe (unit tests and Storybook sweep). Icon, IconButton, Image, Avatar, BarChart, LineChart, Sparkline. Content alt text belongs to the app.',
        },
      },
      ...(
        [
          [
            '1.2.1',
            'Apenas áudio e apenas vídeo (pré-gravado)',
            'Audio-only and Video-only (Prerecorded)',
            'A',
          ],
          ['1.2.2', 'Legendas (pré-gravado)', 'Captions (Prerecorded)', 'A'],
          [
            '1.2.3',
            'Audiodescrição ou mídia alternativa (pré-gravado)',
            'Audio Description or Media Alternative (Prerecorded)',
            'A',
          ],
          ['1.2.4', 'Legendas (ao vivo)', 'Captions (Live)', 'AA'],
          ['1.2.5', 'Audiodescrição (pré-gravado)', 'Audio Description (Prerecorded)', 'AA'],
        ] as const
      ).map(([id, pt, en, level]): Criterion => ({
        id,
        name: { pt, en },
        level,
        status: 'na',
        how: {
          pt: 'O Orange não tem player de áudio ou vídeo. Mídia colocada em Tour, Card ou Carousel é conteúdo da aplicação, com legendas e descrições por conta dela.',
          en: 'Orange has no audio or video player. Media placed in Tour, Card or Carousel is app content, with captions and descriptions owned by the app.',
        },
        evidence: { pt: 'Inventário de componentes.', en: 'Component inventory.' },
      })),
      {
        id: '1.3.1',
        name: { pt: 'Informações e relações', en: 'Info and Relationships' },
        level: 'A',
        status: 'supports',
        how: {
          pt: 'HTML semântico primeiro; o Field liga rótulo, descrição e erro (for, aria-describedby, aria-invalid); Fieldset com legend; Table com cabeçalhos; widgets compostos seguem o APG.',
          en: 'Semantic HTML first; Field wires label, description and error (for, aria-describedby, aria-invalid); Fieldset with legend; Table with headers; composite widgets follow the APG.',
        },
        evidence: {
          pt: 'axe nos testes (label, aria-*, list, th) e consultas getByRole em todas as suítes. Field, Fieldset, Form, Table, Tabs, Listbox, TreeView.',
          en: 'axe in tests (label, aria-*, list, th) and getByRole queries in every suite. Field, Fieldset, Form, Table, Tabs, Listbox, TreeView.',
        },
      },
      {
        id: '1.3.2',
        name: { pt: 'Sequência com significado', en: 'Meaningful Sequence' },
        level: 'A',
        status: 'verify',
        how: {
          pt: 'A ordem do DOM segue a ordem visual nos componentes. Camadas (Popover, HoverCard, Toggletip, Tooltip) vão para um Portal no fim do body: o foco é gerenciado, mas a leitura linear não foi conferida.',
          en: 'DOM order follows visual order inside components. Layers (Popover, HoverCard, Toggletip, Tooltip) go to a Portal at the end of body: focus is managed, but linear reading was not checked.',
        },
        evidence: {
          pt: 'Testes de foco (abrir/fechar devolve o foco). Falta leitura linear com NVDA/VoiceOver.',
          en: 'Focus tests (open/close returns focus). Linear reading with NVDA/VoiceOver is missing.',
        },
      },
      {
        id: '1.3.3',
        name: { pt: 'Características sensoriais', en: 'Sensory Characteristics' },
        level: 'A',
        status: 'app',
        how: {
          pt: 'As mensagens internas do Orange (dicionário ptBR/enUS) não dependem de forma, posição ou som. Instruções das telas são conteúdo da aplicação.',
          en: 'Orange internal messages (ptBR/enUS dictionary) do not rely on shape, position or sound. Screen instructions are app content.',
        },
        evidence: {
          pt: 'Revisão de providers/messages.ts.',
          en: 'Review of providers/messages.ts.',
        },
      },
      {
        id: '1.3.4',
        name: { pt: 'Orientação', en: 'Orientation' },
        level: 'AA',
        status: 'supports',
        how: {
          pt: 'Nenhum componente trava a orientação; BottomNavigation e o Tour (painel inferior) se adaptam ao celular nas duas orientações.',
          en: 'No component locks orientation; BottomNavigation and Tour (bottom sheet) adapt to phones in both orientations.',
        },
        evidence: {
          pt: 'Revisão de CSS (sem media de orientação restritiva).',
          en: 'CSS review (no restrictive orientation queries).',
        },
      },
      {
        id: '1.3.5',
        name: { pt: 'Identificar o propósito da entrada', en: 'Identify Input Purpose' },
        level: 'AA',
        status: 'app',
        how: {
          pt: 'Os campos repassam autoComplete ao input; PasswordField define current-password/new-password e PinInput, one-time-code. O propósito de cada campo só a aplicação conhece.',
          en: 'Fields forward autoComplete to the input; PasswordField sets current-password/new-password and PinInput, one-time-code. Only the app knows each field’s purpose.',
        },
        evidence: {
          pt: 'TextField, PasswordField, PinInput, CurrencyField.',
          en: 'TextField, PasswordField, PinInput, CurrencyField.',
        },
      },
      {
        id: '1.4.1',
        name: { pt: 'Uso de cor', en: 'Use of Color' },
        level: 'A',
        status: 'supports',
        how: {
          pt: 'Estado nunca só por cor: seleção com check, barra ou preenchimento; erro com ícone e texto; linhas de gráfico com forma de marcador e traço próprios, além da tabela de dados.',
          en: 'State is never color alone: selection with a check, bar or fill; errors with icon and text; chart lines with their own marker shape and dash, plus the data table.',
        },
        evidence: {
          pt: 'Regra do CONTRIBUTING; capturas em forced-colors (sem as cores do autor). Checkbox, Tabs, Stepper, Alert, LineChart.',
          en: 'CONTRIBUTING rule; forced-colors screenshots (without author colors). Checkbox, Tabs, Stepper, Alert, LineChart.',
        },
      },
      {
        id: '1.4.2',
        name: { pt: 'Controle de áudio', en: 'Audio Control' },
        level: 'A',
        status: 'na',
        how: { pt: 'Nenhum componente toca áudio.', en: 'No component plays audio.' },
        evidence: { pt: 'Inventário de componentes.', en: 'Component inventory.' },
      },
      {
        id: '1.4.3',
        name: { pt: 'Contraste (mínimo)', en: 'Contrast (Minimum)' },
        level: 'AA',
        status: 'supports',
        how: {
          pt: 'Pares de texto/fundo dos tokens com 4.5:1 nos dois temas. Cores fora dos tokens são da aplicação.',
          en: 'Token text/background pairs at 4.5:1 in both themes. Colors outside the tokens belong to the app.',
        },
        evidence: {
          pt: 'Testes de contraste em packages/tokens; varredura axe com layout real nos quatro temas: nenhuma violação em 2.604 execuções (as 2 da avaliação anterior, em stories com provider aninhado, foram corrigidas).',
          en: 'Contrast tests in packages/tokens; axe sweep with real layout in the four themes: no violations in 2,604 runs (the 2 from the previous assessment, in stories with a nested provider, were fixed).',
        },
      },
      {
        id: '1.4.4',
        name: { pt: 'Redimensionar texto', en: 'Resize Text' },
        level: 'AA',
        status: 'verify',
        how: {
          pt: 'Tamanhos e alturas em rem (tokens), sem texto em imagem. Zoom de texto a 200% ainda não foi testado sistematicamente.',
          en: 'Sizes and heights in rem (tokens), no text in images. 200% text zoom has not been tested systematically yet.',
        },
        evidence: {
          pt: 'Revisão de tokens. Teste manual pendente.',
          en: 'Token review. Manual test pending.',
        },
      },
      {
        id: '1.4.5',
        name: { pt: 'Imagens de texto', en: 'Images of Text' },
        level: 'AA',
        status: 'supports',
        how: {
          pt: 'Nenhum componente usa imagem para texto; ícones são SVG e rótulos são texto real.',
          en: 'No component uses images for text; icons are SVG and labels are real text.',
        },
        evidence: { pt: 'Inventário de componentes.', en: 'Component inventory.' },
      },
      {
        id: '1.4.10',
        name: { pt: 'Refluxo', en: 'Reflow' },
        level: 'AA',
        status: 'partial',
        how: {
          pt: 'Componentes pensados para 320px (BottomNavigation, Tour em painel, RangeCalendar, SegmentedControl). Table, CodeBlock, gráficos e o DateRangePicker de dois meses rolam na horizontal dentro de uma região focável.',
          en: 'Components designed for 320px (BottomNavigation, Tour sheet, RangeCalendar, SegmentedControl). Table, CodeBlock, charts and the two-month DateRangePicker scroll horizontally inside a focusable region.',
        },
        evidence: {
          pt: 'Revisão de CSS. Varredura a 320px/400% pendente; rolagem 2D é exceção aceita para tabelas e código, a confirmar para gráficos e calendário.',
          en: 'CSS review. 320px/400% sweep pending; 2D scrolling is an accepted exception for tables and code, to be confirmed for charts and calendar.',
        },
      },
      {
        id: '1.4.11',
        name: { pt: 'Contraste não textual', en: 'Non-text Contrast' },
        level: 'AA',
        status: 'supports',
        how: {
          pt: 'Bordas de campos, anel de foco e acento como gráfico com 3:1; cores de visualização testadas sobre os fundos dos gráficos. Em alto contraste, os estados usam cores do sistema.',
          en: 'Field borders, focus ring and the accent as a graphic at 3:1; visualization colors tested against chart backgrounds. In high contrast, states use system colors.',
        },
        evidence: {
          pt: 'Testes de contraste dos tokens; guarda forcedColors.test.ts + capturas Playwright com forcedColors.',
          en: 'Token contrast tests; forcedColors.test.ts guard + Playwright screenshots with forcedColors.',
        },
      },
      {
        id: '1.4.12',
        name: { pt: 'Espaçamento de texto', en: 'Text Spacing' },
        level: 'AA',
        status: 'verify',
        how: {
          pt: 'Sem alturas fixas em blocos de texto corrido; Tag, Badge e controles têm altura mínima em rem. O teste com o bookmarklet de espaçamento não foi feito.',
          en: 'No fixed heights on running text; Tag, Badge and controls have a rem min-height. The text-spacing bookmarklet test has not been run.',
        },
        evidence: { pt: 'Teste manual pendente.', en: 'Manual test pending.' },
      },
      {
        id: '1.4.13',
        name: { pt: 'Conteúdo em hover ou foco', en: 'Content on Hover or Focus' },
        level: 'AA',
        status: 'supports',
        how: {
          pt: 'Tooltip, HoverCard e a dica dos gráficos fecham com Escape sem mover o foco, ficam abertos sob o ponteiro e não somem sozinhos; Toggletip abre por clique.',
          en: 'Tooltip, HoverCard and the chart tooltip close with Escape without moving focus, stay open under the pointer and do not disappear on their own; Toggletip opens on click.',
        },
        evidence: {
          pt: 'Testes de teclado (Escape) em Tooltip, HoverCard e BarChart.',
          en: 'Keyboard tests (Escape) in Tooltip, HoverCard and BarChart.',
        },
      },
    ],
  },
  {
    title: { pt: '2. Operável', en: '2. Operable' },
    criteria: [
      {
        id: '2.1.1',
        name: { pt: 'Teclado', en: 'Keyboard' },
        level: 'A',
        status: 'supports',
        how: {
          pt: 'Todos os componentes interativos seguem o padrão APG de teclado; arrastar sempre tem alternativa (SortableList, Splitter, Slider, Table) e gráficos são exploráveis com setas.',
          en: 'Every interactive component follows the APG keyboard pattern; dragging always has an alternative (SortableList, Splitter, Slider, Table) and charts are explorable with arrows.',
        },
        evidence: {
          pt: 'Testes com user-event (Tab, setas, Home/End, Escape) em 92 suítes; testes de layout com teclado em Chromium, Firefox e WebKit; tabela de teclado em cada página da documentação.',
          en: 'user-event tests (Tab, arrows, Home/End, Escape) in 92 suites; keyboard-driven layout tests in Chromium, Firefox and WebKit; keyboard table on every docs page.',
        },
      },
      {
        id: '2.1.2',
        name: { pt: 'Sem bloqueio do teclado', en: 'No Keyboard Trap' },
        level: 'A',
        status: 'supports',
        how: {
          pt: 'Só diálogos prendem o foco (Modal, Drawer, ConfirmDialog, CommandPalette, Tour) e todos fecham com Escape, devolvendo o foco a quem abriu.',
          en: 'Only dialogs trap focus (Modal, Drawer, ConfirmDialog, CommandPalette, Tour) and all close with Escape, returning focus to the trigger.',
        },
        evidence: {
          pt: 'Testes de foco e Escape nas suítes de sobreposição.',
          en: 'Focus and Escape tests in the overlay suites.',
        },
      },
      {
        id: '2.1.4',
        name: { pt: 'Atalhos de tecla de caractere', en: 'Character Key Shortcuts' },
        level: 'A',
        status: 'supports',
        how: {
          pt: 'Atalhos globais usam modificador (Ctrl/Cmd+K na CommandPalette). Busca por digitação só funciona com o foco dentro da lista ou menu.',
          en: 'Global shortcuts use a modifier (Ctrl/Cmd+K in CommandPalette). Type-ahead only works with focus inside the list or menu.',
        },
        evidence: {
          pt: 'Testes de CommandPalette, Listbox e Dropdown.',
          en: 'CommandPalette, Listbox and Dropdown tests.',
        },
      },
      {
        id: '2.2.1',
        name: { pt: 'Tempo ajustável', en: 'Timing Adjustable' },
        level: 'A',
        status: 'supports',
        how: {
          pt: 'Toast pausa com hover, foco e aba oculta; a duração é configurável e toasts com ação não somem sozinhos. Carousel automático tem pausa.',
          en: 'Toast pauses on hover, focus and hidden tab; duration is configurable and toasts with an action do not dismiss on their own. Autoplay Carousel has a pause control.',
        },
        evidence: { pt: 'Testes de Toast e Carousel.', en: 'Toast and Carousel tests.' },
      },
      {
        id: '2.2.2',
        name: { pt: 'Pausar, parar, ocultar', en: 'Pause, Stop, Hide' },
        level: 'A',
        status: 'supports',
        how: {
          pt: 'Carousel automático tem botão de pausa, para no hover/foco e não roda com movimento reduzido. Loops infinitos só em indicadores de carregamento.',
          en: 'Autoplay Carousel has a pause button, stops on hover/focus and does not run with reduced motion. Infinite loops only in loading indicators.',
        },
        evidence: {
          pt: 'Testes de Carousel; tokens de movimento zerados em reduced motion.',
          en: 'Carousel tests; motion tokens zeroed in reduced motion.',
        },
      },
      {
        id: '2.3.1',
        name: { pt: 'Três flashes ou abaixo do limite', en: 'Three Flashes or Below Threshold' },
        level: 'A',
        status: 'supports',
        how: {
          pt: 'Nenhuma animação pisca; pulsos (or-pulse, Spinner em movimento reduzido) têm ciclo de 2s ou mais.',
          en: 'No animation flashes; pulses (or-pulse, Spinner in reduced motion) have a cycle of 2s or longer.',
        },
        evidence: { pt: 'Revisão dos tokens de duração.', en: 'Duration token review.' },
      },
      {
        id: '2.4.1',
        name: { pt: 'Ignorar blocos', en: 'Bypass Blocks' },
        level: 'A',
        status: 'app',
        how: {
          pt: 'O Orange fornece o mecanismo — SkipLink e os landmarks do AppShell (header, nav, main, aside, footer) —; usá-lo é da aplicação.',
          en: 'Orange provides the mechanism — SkipLink and AppShell landmarks (header, nav, main, aside, footer) —; using it is up to the app.',
        },
        evidence: { pt: 'Testes de SkipLink e AppShell.', en: 'SkipLink and AppShell tests.' },
      },
      {
        id: '2.4.2',
        name: { pt: 'Página com título', en: 'Page Titled' },
        level: 'A',
        status: 'app',
        how: { pt: 'O <title> é definido pela aplicação.', en: 'The <title> is set by the app.' },
        evidence: { pt: '—', en: '—' },
      },
      {
        id: '2.4.3',
        name: { pt: 'Ordem do foco', en: 'Focus Order' },
        level: 'A',
        status: 'supports',
        how: {
          pt: 'Sem tabindex positivo; roving tabindex em widgets compostos; sobreposições levam o foco para dentro e o devolvem ao fechar.',
          en: 'No positive tabindex; roving tabindex in composite widgets; overlays move focus inside and return it on close.',
        },
        evidence: {
          pt: 'Testes de foco (useRovingFocus, useFocusTrap) em Tabs, Toolbar, RadioGroup, Modal, Popover, Tour.',
          en: 'Focus tests (useRovingFocus, useFocusTrap) in Tabs, Toolbar, RadioGroup, Modal, Popover, Tour.',
        },
      },
      {
        id: '2.4.4',
        name: { pt: 'Finalidade do link (em contexto)', en: 'Link Purpose (In Context)' },
        level: 'A',
        status: 'app',
        how: {
          pt: 'Os links internos dos componentes têm nome (Breadcrumb, Paginator “Próxima página”); o texto dos links de conteúdo é da aplicação.',
          en: 'Component internal links have names (Breadcrumb, Paginator “Next page”); content link text belongs to the app.',
        },
        evidence: { pt: 'axe (link-name) nos testes.', en: 'axe (link-name) in tests.' },
      },
      {
        id: '2.4.5',
        name: { pt: 'Várias formas', en: 'Multiple Ways' },
        level: 'AA',
        status: 'app',
        how: {
          pt: 'Requisito do site. O Orange oferece Search, CommandPalette, SideNav e Breadcrumb para compor.',
          en: 'A site requirement. Orange offers Search, CommandPalette, SideNav and Breadcrumb to build it.',
        },
        evidence: { pt: '—', en: '—' },
      },
      {
        id: '2.4.6',
        name: { pt: 'Cabeçalhos e rótulos', en: 'Headings and Labels' },
        level: 'AA',
        status: 'app',
        how: {
          pt: 'Rótulos sempre visíveis e associados (Field); títulos de diálogo ligados por aria-labelledby. Se descrevem bem o conteúdo, é texto da aplicação.',
          en: 'Labels are always visible and associated (Field); dialog titles linked via aria-labelledby. Whether they describe the content well is app text.',
        },
        evidence: { pt: 'axe (label, aria-dialog-name).', en: 'axe (label, aria-dialog-name).' },
      },
      {
        id: '2.4.7',
        name: { pt: 'Foco visível', en: 'Focus Visible' },
        level: 'AA',
        status: 'supports',
        how: {
          pt: 'Contorno de 2px em --or-color-focus (3:1 nos dois temas) em :focus-visible; em alto contraste, todo foco desenhado com sombra ou fundo ganha contorno em cor do sistema.',
          en: '2px outline in --or-color-focus (3:1 in both themes) on :focus-visible; in high contrast, every focus drawn with a shadow or background gets a system-color outline.',
        },
        evidence: {
          pt: 'Teste de contraste do foco; guarda forcedColors.test.ts; capturas com Tab em todas as 562 stories da v0.4.0 (modo forced-colors, avaliação de 5/11/2026 — a refazer na auditoria).',
          en: 'Focus contrast test; forcedColors.test.ts guard; Tab screenshots of all 562 v0.4.0 stories (forced-colors mode, November 5, 2026 assessment — to be redone in the audit).',
        },
      },
      {
        id: '2.4.11',
        name: { pt: 'Foco não obscurecido (mínimo)', en: 'Focus Not Obscured (Minimum)' },
        level: 'AA',
        status: 'partial',
        how: {
          pt: 'Componentes não cobrem o elemento focado, mas AppHeader fixo, BackToTop e a região de Toast podem cobrir se a aplicação não reservar espaço (scroll-padding-top).',
          en: 'Components do not cover the focused element, but a sticky AppHeader, BackToTop and the Toast region can if the app does not reserve space (scroll-padding-top).',
        },
        evidence: {
          pt: 'A documentação usa scroll-padding-top. Table com cabeçalho fixo mede o cabeçalho e aplica scroll-padding-top (1.2.1); teste de layout em Chromium, Firefox e WebKit confere que o foco subindo nunca fica sob ele. Verificação manual pendente.',
          en: 'The docs use scroll-padding-top. Table with a sticky header measures the header and applies scroll-padding-top (1.2.1); a layout test in Chromium, Firefox and WebKit checks that focus moving up is never under it. Manual check pending.',
        },
      },
      {
        id: '2.5.1',
        name: { pt: 'Gestos de ponteiro', en: 'Pointer Gestures' },
        level: 'A',
        status: 'supports',
        how: {
          pt: 'Nenhuma ação exige gesto de caminho ou multiponto: Carousel tem botões, Splitter e Slider aceitam clique e teclado.',
          en: 'No action needs a path-based or multipoint gesture: Carousel has buttons, Splitter and Slider accept click and keyboard.',
        },
        evidence: {
          pt: 'Testes de Carousel, Splitter e Slider.',
          en: 'Carousel, Splitter and Slider tests.',
        },
      },
      {
        id: '2.5.2',
        name: { pt: 'Cancelamento do ponteiro', en: 'Pointer Cancellation' },
        level: 'A',
        status: 'supports',
        how: {
          pt: 'Ações disparam no clique (evento de soltar) de botões nativos; arrastar na SortableList pode ser cancelado com Escape ou soltando no lugar.',
          en: 'Actions fire on click (up event) of native buttons; dragging in SortableList can be cancelled with Escape or by dropping in place.',
        },
        evidence: { pt: 'Testes de SortableList.', en: 'SortableList tests.' },
      },
      {
        id: '2.5.3',
        name: { pt: 'Rótulo no nome', en: 'Label in Name' },
        level: 'A',
        status: 'supports',
        how: {
          pt: 'O nome acessível vem do rótulo visível (Field com for, texto do botão). Ao sobrescrever com aria-label, a aplicação deve manter o texto visível no início.',
          en: 'The accessible name comes from the visible label (Field with for, button text). When overriding with aria-label, the app must keep the visible text at the start.',
        },
        evidence: {
          pt: 'axe e getByRole({ name }) nos testes.',
          en: 'axe and getByRole({ name }) in tests.',
        },
      },
      {
        id: '2.5.4',
        name: { pt: 'Atuação por movimento', en: 'Motion Actuation' },
        level: 'A',
        status: 'na',
        how: {
          pt: 'Nenhum componente usa movimento do dispositivo.',
          en: 'No component uses device motion.',
        },
        evidence: { pt: 'Inventário de componentes.', en: 'Component inventory.' },
      },
      {
        id: '2.5.7',
        name: { pt: 'Movimentos de arrastar', en: 'Dragging Movements' },
        level: 'AA',
        status: 'supports',
        how: {
          pt: 'SortableList tem botões “Mover para cima/baixo” e teclado; Slider aceita clique no trilho; Splitter, setas e Enter; FileUploader, botão de escolher arquivo; Table (colunas redimensionáveis), clique duplo para ajustar ao conteúdo e setas.',
          en: 'SortableList has “Move up/down” buttons and keyboard; Slider accepts track clicks; Splitter, arrows and Enter; FileUploader, a choose-file button; Table (resizable columns), double-click to fit the content and arrow keys.',
        },
        evidence: {
          pt: 'Testes de SortableList, Slider, Splitter, FileUploader e Table.',
          en: 'SortableList, Slider, Splitter, FileUploader and Table tests.',
        },
      },
      {
        id: '2.5.8',
        name: { pt: 'Tamanho do alvo (mínimo)', en: 'Target Size (Minimum)' },
        level: 'AA',
        status: 'supports',
        how: {
          pt: 'Controles começam em 32px; Checkbox e Radio têm área de 24×24px; o Splitter tem área de toque própria.',
          en: 'Controls start at 32px; Checkbox and Radio have a 24×24px area; Splitter has its own hit area.',
        },
        evidence: {
          pt: 'Regra target-size do axe (wcag22aa) na varredura do Storybook: 0 violações.',
          en: 'axe target-size rule (wcag22aa) in the Storybook sweep: 0 violations.',
        },
      },
    ],
  },
  {
    title: { pt: '3. Compreensível', en: '3. Understandable' },
    criteria: [
      {
        id: '3.1.1',
        name: { pt: 'Idioma da página', en: 'Language of Page' },
        level: 'A',
        status: 'app',
        how: {
          pt: 'O lang do <html> é definido pela aplicação.',
          en: 'The <html> lang is set by the app.',
        },
        evidence: { pt: '—', en: '—' },
      },
      {
        id: '3.1.2',
        name: { pt: 'Idioma das partes', en: 'Language of Parts' },
        level: 'AA',
        status: 'app',
        how: {
          pt: 'As mensagens internas seguem o locale do OrangeProvider; ele deve coincidir com o idioma da página. Trechos em outro idioma no conteúdo pedem lang da aplicação.',
          en: 'Internal messages follow the OrangeProvider locale; it must match the page language. Passages in another language need an app-set lang.',
        },
        evidence: { pt: 'Testes de i18n do provider.', en: 'Provider i18n tests.' },
      },
      {
        id: '3.2.1',
        name: { pt: 'Em foco', en: 'On Focus' },
        level: 'A',
        status: 'supports',
        how: {
          pt: 'Receber foco nunca muda o contexto; só exibe dicas (Tooltip, HoverCard) que fecham com Escape.',
          en: 'Receiving focus never changes context; it only shows hints (Tooltip, HoverCard) that close with Escape.',
        },
        evidence: { pt: 'Testes de foco.', en: 'Focus tests.' },
      },
      {
        id: '3.2.2',
        name: { pt: 'Em entrada', en: 'On Input' },
        level: 'A',
        status: 'supports',
        how: {
          pt: 'Mudar um valor não envia formulário nem navega; a seleção que segue o foco (Listbox, Tabs) fica dentro do próprio widget.',
          en: 'Changing a value does not submit or navigate; selection following focus (Listbox, Tabs) stays within the widget.',
        },
        evidence: {
          pt: 'Testes de Select, Listbox, Tabs e Form.',
          en: 'Select, Listbox, Tabs and Form tests.',
        },
      },
      {
        id: '3.2.3',
        name: { pt: 'Navegação consistente', en: 'Consistent Navigation' },
        level: 'AA',
        status: 'app',
        how: { pt: 'Requisito do site.', en: 'A site requirement.' },
        evidence: { pt: '—', en: '—' },
      },
      {
        id: '3.2.4',
        name: { pt: 'Identificação consistente', en: 'Consistent Identification' },
        level: 'AA',
        status: 'supports',
        how: {
          pt: 'Mesma função, mesmo nome e ícone em toda a biblioteca: rótulos internos vêm de um único dicionário (Fechar, Próxima página, Remover…).',
          en: 'Same function, same name and icon across the library: internal labels come from a single dictionary (Close, Next page, Remove…).',
        },
        evidence: { pt: 'providers/messages.ts.', en: 'providers/messages.ts.' },
      },
      {
        id: '3.2.6',
        name: { pt: 'Ajuda consistente', en: 'Consistent Help' },
        level: 'A',
        status: 'app',
        how: {
          pt: 'Posição dos links de ajuda é decisão do site.',
          en: 'Help link placement is a site decision.',
        },
        evidence: { pt: '—', en: '—' },
      },
      {
        id: '3.3.1',
        name: { pt: 'Identificação de erro', en: 'Error Identification' },
        level: 'A',
        status: 'supports',
        how: {
          pt: 'Field mostra o erro em texto com ícone, marca aria-invalid e liga a mensagem por aria-describedby; ErrorSummary lista e leva a cada campo.',
          en: 'Field shows the error as text with an icon, sets aria-invalid and links the message via aria-describedby; ErrorSummary lists and links to each field.',
        },
        evidence: {
          pt: 'Testes de Field, Form e ErrorSummary.',
          en: 'Field, Form and ErrorSummary tests.',
        },
      },
      {
        id: '3.3.2',
        name: { pt: 'Rótulos ou instruções', en: 'Labels or Instructions' },
        level: 'A',
        status: 'supports',
        how: {
          pt: 'Todo controle de formulário aceita label (visível), description e required (indicado e anunciado).',
          en: 'Every form control takes a (visible) label, description and required (shown and announced).',
        },
        evidence: {
          pt: 'axe e testes de Field em todos os campos.',
          en: 'axe and Field tests on every field.',
        },
      },
      {
        id: '3.3.3',
        name: { pt: 'Sugestão de erro', en: 'Error Suggestion' },
        level: 'AA',
        status: 'app',
        how: {
          pt: 'Field e ErrorSummary exibem a sugestão; o texto dela é da aplicação. Regras embutidas (requisitos do PasswordField, e-mail do TagInput) já dizem como corrigir.',
          en: 'Field and ErrorSummary display the suggestion; its wording belongs to the app. Built-in rules (PasswordField requirements, TagInput email) already say how to fix.',
        },
        evidence: {
          pt: 'Testes de PasswordField e TagInput.',
          en: 'PasswordField and TagInput tests.',
        },
      },
      {
        id: '3.3.4',
        name: {
          pt: 'Prevenção de erros (legais, financeiros, dados)',
          en: 'Error Prevention (Legal, Financial, Data)',
        },
        level: 'AA',
        status: 'app',
        how: {
          pt: 'O fluxo é da aplicação; o ConfirmDialog oferece a confirmação antes de ações destrutivas.',
          en: 'The flow belongs to the app; ConfirmDialog offers confirmation before destructive actions.',
        },
        evidence: { pt: 'Testes de ConfirmDialog.', en: 'ConfirmDialog tests.' },
      },
      {
        id: '3.3.7',
        name: { pt: 'Entrada redundante', en: 'Redundant Entry' },
        level: 'A',
        status: 'app',
        how: {
          pt: 'Depende do fluxo de várias etapas da aplicação.',
          en: 'Depends on the app’s multi-step flow.',
        },
        evidence: { pt: '—', en: '—' },
      },
      {
        id: '3.3.8',
        name: { pt: 'Autenticação acessível (mínimo)', en: 'Accessible Authentication (Minimum)' },
        level: 'AA',
        status: 'supports',
        how: {
          pt: 'PasswordField permite colar e gerenciadores de senha (autocomplete correto) e mostra a senha; PinInput aceita colar o código inteiro e usa one-time-code.',
          en: 'PasswordField allows pasting and password managers (correct autocomplete) and can show the password; PinInput accepts pasting the whole code and uses one-time-code.',
        },
        evidence: {
          pt: 'Testes de PasswordField e PinInput (colar).',
          en: 'PasswordField and PinInput tests (paste).',
        },
      },
    ],
  },
  {
    title: { pt: '4. Robusto', en: '4. Robust' },
    criteria: [
      {
        id: '4.1.2',
        name: { pt: 'Nome, função, valor', en: 'Name, Role, Value' },
        level: 'A',
        status: 'verify',
        how: {
          pt: 'HTML nativo primeiro e ARIA conforme o APG; estados (aria-checked, aria-selected, aria-expanded, aria-valuenow…) atualizados pelos componentes. Nunca testado com leitores de tela reais.',
          en: 'Native HTML first and ARIA per the APG; states (aria-checked, aria-selected, aria-expanded, aria-valuenow…) kept up to date by components. Never tested with real screen readers.',
        },
        evidence: {
          pt: 'axe nos testes e no Storybook (0 violações de ARIA); getByRole em todas as suítes. Falta NVDA/JAWS/VoiceOver/TalkBack.',
          en: 'axe in tests and Storybook (0 ARIA violations); getByRole in every suite. NVDA/JAWS/VoiceOver/TalkBack missing.',
        },
      },
      {
        id: '4.1.3',
        name: { pt: 'Mensagens de status', en: 'Status Messages' },
        level: 'AA',
        status: 'verify',
        how: {
          pt: 'Regiões role="status"/role="alert" já presentes antes da mudança: Toast, Search, Combobox (contagem), SortableList (anúncios de movimento), gráficos (valor em foco), Form.',
          en: 'role="status"/role="alert" regions present before the change: Toast, Search, Combobox (count), SortableList (move announcements), charts (focused value), Form.',
        },
        evidence: {
          pt: 'Testes verificam o texto das regiões; o anúncio real em leitores de tela não foi verificado.',
          en: 'Tests check the region text; the actual announcement in screen readers was not verified.',
        },
      },
    ],
  },
]

const allCriteria = principles.flatMap((p) => p.criteria)

const riskComponents: { name: string; check: Localized<string> }[] = [
  {
    name: 'Tour',
    check: {
      pt: 'Anúncio do diálogo a cada passo, foco no título, leitura do contador “1 de 3”, recorte (spotlight) em alto contraste e o painel inferior no celular.',
      en: 'Dialog announcement on every step, focus on the title, reading of the “1 of 3” counter, spotlight in high contrast and the bottom sheet on phones.',
    },
  },
  {
    name: 'SortableList',
    check: {
      pt: 'Pegar/soltar com Espaço, anúncios de posição (role="status"), cancelar com Escape e os botões mover para cima/baixo com TalkBack e VoiceOver no iOS.',
      en: 'Grab/drop with Space, position announcements (role="status"), cancel with Escape and the move up/down buttons with TalkBack and iOS VoiceOver.',
    },
  },
  {
    name: 'Splitter',
    check: {
      pt: 'role="separator" com aria-valuenow, setas, Home/End, Enter para recolher e o anúncio do tamanho em NVDA/JAWS.',
      en: 'role="separator" with aria-valuenow, arrows, Home/End, Enter to collapse and size announcements in NVDA/JAWS.',
    },
  },
  {
    name: 'BarChart / LineChart / Sparkline',
    check: {
      pt: 'Nome do gráfico, exploração por setas com o valor anunciado, a tabela “Ver dados” e as séries em alto contraste.',
      en: 'Chart name, arrow-key exploration with the value announced, the “View data” table and the series in high contrast.',
    },
  },
  {
    name: 'DateRangePicker / RangeCalendar',
    check: {
      pt: 'Grade de datas (setas, Page Up/Down), anúncio de início/fim e do período, digitação nos campos, presets e o diálogo em modo de navegação do leitor.',
      en: 'Date grid (arrows, Page Up/Down), start/end and range announcements, typing in the fields, presets and the dialog in screen-reader browse mode.',
    },
  },
  {
    name: 'Combobox / MultiSelect',
    check: {
      pt: 'aria-activedescendant, anúncio da contagem de resultados, opções desabilitadas, remoção de chips e o comportamento no modo de navegação (NVDA/JAWS) e no rotor do VoiceOver.',
      en: 'aria-activedescendant, result-count announcements, disabled options, chip removal and behavior in browse mode (NVDA/JAWS) and the VoiceOver rotor.',
    },
  },
  {
    name: 'Carousel',
    check: {
      pt: 'Rótulos “slide X de Y”, pausa do automático, aria-live só quando parado, seletor de slides e gestos no celular.',
      en: '“Slide X of Y” labels, autoplay pause, aria-live only when paused, slide picker and gestures on phones.',
    },
  },
]

const environments: { at: Localized<string> | string; browser: string; os: string }[] = [
  { at: 'NVDA', browser: 'Firefox, Chrome', os: 'Windows 11' },
  { at: 'JAWS', browser: 'Chrome, Edge', os: 'Windows 11' },
  { at: 'Narrator', browser: 'Edge', os: 'Windows 11' },
  { at: 'VoiceOver', browser: 'Safari', os: 'macOS' },
  { at: 'VoiceOver', browser: 'Safari', os: 'iOS / iPadOS' },
  { at: 'TalkBack', browser: 'Chrome', os: 'Android' },
  {
    at: { pt: 'Temas de contraste', en: 'Contrast themes' },
    browser: 'Edge, Chrome, Firefox',
    os: 'Windows 11',
  },
  {
    at: { pt: 'Zoom 200–400% · 320px', en: 'Zoom 200–400% · 320px' },
    browser: 'Chrome, Safari',
    os: 'Desktop, mobile',
  },
]

function StatusTag({ status }: { status: Status }) {
  const { t } = useLang()
  return (
    <Tag tone={statusMeta[status].tone} size="sm">
      {t(statusMeta[status].label)}
    </Tag>
  )
}

const columns = {
  criterion: { pt: 'Critério', en: 'Criterion' },
  level: { pt: 'Nível', en: 'Level' },
  status: { pt: 'Status', en: 'Status' },
  how: { pt: 'Como o Orange atende', en: 'How Orange addresses it' },
  evidence: { pt: 'Evidências', en: 'Evidence' },
} satisfies Record<string, Localized<string>>

function ConformanceTable() {
  const { t } = useLang()
  const [filter, setFilter] = useState<Status | 'all'>('all')
  const visible = (c: Criterion) => filter === 'all' || c.status === filter
  const shown = allCriteria.filter(visible).length
  return (
    <>
      <Segmented
        label={{ pt: 'Filtrar por status', en: 'Filter by status' }}
        value={filter}
        onChange={setFilter}
        options={[
          { value: 'all', label: { pt: 'Todos', en: 'All' } },
          ...statusOrder.map((s) => ({ value: s, label: statusMeta[s].label })),
        ]}
      />
      <p className="guide-muted guide-note" role="status">
        {t({
          pt: `${shown} de ${allCriteria.length} critérios`,
          en: `${shown} of ${allCriteria.length} criteria`,
        })}
      </p>
      <div className="guide-conformance-wrap">
        <TableWrap label={{ pt: 'Critérios WCAG 2.2 A e AA', en: 'WCAG 2.2 A and AA criteria' }}>
          <table className="doc-table guide-conformance">
            <thead>
              <tr>
                <th scope="col">{t(columns.criterion)}</th>
                <th scope="col">{t(columns.level)}</th>
                <th scope="col">{t(columns.status)}</th>
                <th scope="col">{t(columns.how)}</th>
                <th scope="col">{t(columns.evidence)}</th>
              </tr>
            </thead>
            {principles.map((principle) => {
              const rows = principle.criteria.filter(visible)
              if (rows.length === 0) return null
              return (
                <tbody key={principle.title.en}>
                  <tr className="guide-conformance__group">
                    <th scope="rowgroup" colSpan={5}>
                      {t(principle.title)}
                    </th>
                  </tr>
                  {rows.map((c) => (
                    <tr key={c.id} className="guide-conformance__row">
                      <th scope="row" className="guide-conformance__criterion">
                        <span className="guide-conformance__id">{c.id}</span> {t(c.name)}
                      </th>
                      <td className="guide-conformance__level">{c.level}</td>
                      <td className="guide-conformance__status">
                        <StatusTag status={c.status} />
                      </td>
                      <td data-label={t(columns.how)}>{t(c.how)}</td>
                      <td data-label={t(columns.evidence)}>{t(c.evidence)}</td>
                    </tr>
                  ))}
                </tbody>
              )
            })}
          </table>
        </TableWrap>
      </div>
    </>
  )
}

export default function ConformancePage() {
  const { t, to } = useLang()
  const count = (s: Status) => allCriteria.filter((c) => c.status === s).length

  return (
    <DocPage
      eyebrow={{ pt: 'Design guidelines', en: 'Design guidelines' }}
      title={{ pt: 'Relatório de conformidade', en: 'Conformance report' }}
      lead={{
        pt: 'Autoavaliação do Orange frente a todos os critérios A e AA da WCAG 2.2, no formato de um relatório de conformidade (VPAT/ACR). Ela prepara a auditoria externa prevista no roadmap 1.x — e não a substitui.',
        en: 'Orange’s self-assessment against every WCAG 2.2 A and AA criterion, in the format of a conformance report (VPAT/ACR). It prepares the external audit planned in the 1.x roadmap — and does not replace it.',
      }}
    >
      <Callout
        tone="warning"
        title={{ pt: 'Ainda não auditado por terceiros', en: 'Not yet audited by a third party' }}
      >
        <p>
          <T
            pt="Nenhuma auditoria externa foi feita até agora. Os status abaixo são da equipe do Orange, com base em testes automatizados e revisão de código; “A verificar” marca o que ainda depende de leitores de tela e testes manuais."
            en="No external audit has been done so far. The statuses below come from the Orange team, based on automated tests and code review; “To verify” marks what still depends on screen readers and manual testing."
          />
        </p>
      </Callout>

      <Section title={{ pt: 'Resumo', en: 'Summary' }}>
        <Stats items={statusOrder.map((s) => ({ value: count(s), label: statusMeta[s].label }))} />
        <Prose>
          <p>
            <T
              pt={`${allCriteria.length} critérios avaliados: ${allCriteria.filter((c) => c.level === 'A').length} de nível A e ${allCriteria.filter((c) => c.level === 'AA').length} de nível AA. O 4.1.1 (Análise) foi removido da WCAG 2.2 e não entra na tabela.`}
              en={`${allCriteria.length} criteria assessed: ${allCriteria.filter((c) => c.level === 'A').length} at level A and ${allCriteria.filter((c) => c.level === 'AA').length} at level AA. 4.1.1 (Parsing) was removed from WCAG 2.2 and is not listed.`}
            />
          </p>
        </Prose>
      </Section>

      <Section title={{ pt: 'Escopo e método', en: 'Scope and method' }}>
        <Bullets
          items={[
            {
              pt: (
                <>
                  <strong>Produto:</strong> <Code>@orangesys/ui</Code> 1.3.3 (117 componentes
                  documentados, 29 hooks e estilos) com <Code>@orangesys/tokens</Code> 1.3.3, nos
                  temas escuro, claro e de alto contraste. Reavaliado em 9 de novembro de 2026 (a
                  primeira avaliação, de 5 de novembro, cobria a v0.4.0 com 103 componentes).
                </>
              ),
              en: (
                <>
                  <strong>Product:</strong> <Code>@orangesys/ui</Code> 1.3.3 (117 documented
                  components, 29 hooks and styles) with <Code>@orangesys/tokens</Code> 1.3.3, in the
                  dark, light and high-contrast themes. Reassessed on November 9, 2026 (the first
                  assessment, on November 5, covered v0.4.0 with 103 components).
                </>
              ),
            },
            {
              pt: 'Fora do escopo: telas e conteúdo das aplicações que usam o Orange (textos, imagens, títulos, fluxos) — por isso a coluna “Responsabilidade da aplicação”.',
              en: 'Out of scope: screens and content of the apps that use Orange (copy, images, titles, flows) — hence the “App responsibility” status.',
            },
            {
              pt: (
                <>
                  <strong>axe-core nos testes:</strong> as 122 suítes de componentes chamam{' '}
                  <Code>expectNoA11yViolations()</Code> (jsdom; contraste e região desligados,
                  cobertos abaixo).
                </>
              ),
              en: (
                <>
                  <strong>axe-core in tests:</strong> all 122 component suites call{' '}
                  <Code>expectNoA11yViolations()</Code> (jsdom; contrast and region disabled,
                  covered below).
                </>
              ),
            },
            {
              pt: 'Varredura do Storybook: axe-core 4.14 com layout real (Chromium 153, Playwright) em todas as 651 stories, nos quatro temas (escuro, claro e os dois de alto contraste) — 2.604 execuções com as tags WCAG 2.0/2.1/2.2 A e AA. Resultado: nenhuma violação. As 2 da avaliação anterior (stories “English locale”, provider aninhado) foram corrigidas.',
              en: 'Storybook sweep: axe-core 4.14 with real layout (Chromium 153, Playwright) on all 651 stories, in the four themes (dark, light and both high-contrast themes) — 2,604 runs with the WCAG 2.0/2.1/2.2 A and AA tags. Result: no violations. The 2 from the previous assessment (“English locale” stories, nested provider) were fixed.',
            },
            {
              pt: 'Testes de layout (tests/layout) em Chromium, Firefox e WebKit: listas e menus mantêm o item ativo à vista nas pontas, abas com rolagem revelam a aba focada, o foco nunca fica sob o cabeçalho fixo da Table e o fim da rolagem marca a última seção do índice — 39 execuções por rodada no CI.',
              en: 'Layout tests (tests/layout) in Chromium, Firefox and WebKit: lists and menus keep the active item in view at the ends, scrolling tabs reveal the focused tab, focus never sits under the Table’s sticky header and the end of the scroll marks the index’s last section — 39 runs per CI round.',
            },
            {
              pt: 'Teclado: interações com user-event (Tab, setas, Home/End, Page Up/Down, Escape) em 92 suítes; cada página de componente documenta o mapa de teclado. Verificação manual completa ainda pendente.',
              en: 'Keyboard: user-event interactions (Tab, arrows, Home/End, Page Up/Down, Escape) in 92 suites; every component page documents its keyboard map. A full manual pass is still pending.',
            },
            {
              pt: (
                <>
                  <strong>Contraste:</strong> pares de tokens testados em{' '}
                  <Code>packages/tokens/src/contrast.test.ts</Code> (texto 4.5:1, gráficos e foco
                  3:1).
                </>
              ),
              en: (
                <>
                  <strong>Contrast:</strong> token pairs tested in{' '}
                  <Code>packages/tokens/src/contrast.test.ts</Code> (text 4.5:1, graphics and focus
                  3:1).
                </>
              ),
            },
            {
              pt: (
                <>
                  <strong>Alto contraste:</strong> guarda{' '}
                  <Code>packages/ui/src/test/forcedColors.test.ts</Code> e capturas Playwright com{' '}
                  <Code>forcedColors: 'active'</Code> de todas as stories, antes e depois do foco
                  (ver <Link to={to('/design-guidelines/accessibility')}>Acessibilidade</Link>).
                </>
              ),
              en: (
                <>
                  <strong>High contrast:</strong> the{' '}
                  <Code>packages/ui/src/test/forcedColors.test.ts</Code> guard and Playwright
                  screenshots with <Code>forcedColors: 'active'</Code> of every story, before and
                  after focus (see{' '}
                  <Link to={to('/design-guidelines/accessibility')}>Accessibility</Link>).
                </>
              ),
            },
            {
              pt: 'Lint: eslint-plugin-jsx-a11y em todo o monorepo.',
              en: 'Lint: eslint-plugin-jsx-a11y across the monorepo.',
            },
            {
              pt: 'Não feito: testes com leitores de tela reais, com tecnologias de entrada por voz e com pessoas com deficiência.',
              en: 'Not done: tests with real screen readers, with voice input technologies and with people with disabilities.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Tabela de conformidade', en: 'Conformance table' }}>
        <ConformanceTable />
      </Section>

      <Section title={{ pt: 'Limitações conhecidas', en: 'Known limitations' }}>
        <Bullets
          items={[
            {
              pt: 'Nenhum componente foi testado com NVDA, JAWS, VoiceOver ou TalkBack: os anúncios (4.1.2, 4.1.3) e a ordem de leitura das camadas em Portal (1.3.2) estão “A verificar”.',
              en: 'No component has been tested with NVDA, JAWS, VoiceOver or TalkBack: announcements (4.1.2, 4.1.3) and the reading order of Portal layers (1.3.2) are “To verify”.',
            },
            {
              pt: 'O axe no jsdom não mede contraste nem layout; isso vem dos testes de tokens e da varredura do Storybook, que cobre os estados das stories, não todas as combinações de props.',
              en: 'axe in jsdom measures neither contrast nor layout; that comes from the token tests and the Storybook sweep, which covers the story states, not every prop combination.',
            },
            {
              pt: 'Alto contraste verificado na emulação do Chromium (paletas clara e escura). Firefox e os temas de contraste reais do Windows ainda precisam de checagem.',
              en: 'High contrast verified in Chromium emulation (light and dark palettes). Firefox and real Windows contrast themes still need checking.',
            },
            {
              pt: 'Nos gráficos, as séries mantêm a cor em alto contraste; nas barras agrupadas a distinção é cor + ordem da legenda, com a tabela “Ver dados” como alternativa.',
              en: 'In charts, series keep their color in high contrast; in grouped bars the distinction is color + legend order, with the “View data” table as the alternative.',
            },
            {
              pt: 'Refluxo (1.4.10) tem cobertura parcial: regressão visual a 390px de 12 componentes que mudam de layout e checagem de rolagem horizontal das páginas da documentação a 390 e 320px. Zoom de texto a 200% e espaçamento de texto (1.4.4, 1.4.12) não tiveram varredura sistemática.',
              en: 'Reflow (1.4.10) has partial coverage: visual regression at 390px of 12 layout-changing components and a horizontal-scroll check of the docs pages at 390 and 320px. 200% text zoom and text spacing (1.4.4, 1.4.12) have not had a systematic sweep.',
            },
            {
              pt: 'O seletor de cor usa um controle nativo do navegador: o comportamento com leitores de tela varia por navegador.',
              en: 'The color picker uses a native browser control: its screen-reader behavior varies by browser.',
            },
            {
              pt: 'O TimeField e a hora do DateTimePicker usam segmentos próprios (spinbutton) desde a 1.5; o TimeField tem também uma lista de horários (listbox). A digitação por teclado virtual foi verificada só por emulação de toque no Chromium, não em aparelhos; os anúncios, só por testes automáticos.',
              en: 'TimeField and the DateTimePicker time use their own segments (spinbutton) since 1.5; TimeField also has a list of times (listbox). Virtual-keyboard typing was verified only through touch emulation in Chromium, not on devices; announcements, only through automated tests.',
            },
            {
              pt: 'Elementos fixos (AppHeader, BackToTop, Toast) podem cobrir o foco se a aplicação não reservar espaço (2.4.11).',
              en: 'Fixed elements (AppHeader, BackToTop, Toast) can cover focus if the app does not reserve space (2.4.11).',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Para auditores', en: 'For auditors' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Tudo roda localmente: <Code>pnpm install</Code>, <Code>pnpm storybook</Code> (uma
                  story por estado) e <Code>pnpm dev</Code> (esta documentação, com exemplos ao
                  vivo). Os testes ficam em <Code>pnpm test</Code>.
                </>
              }
              en={
                <>
                  Everything runs locally: <Code>pnpm install</Code>, <Code>pnpm storybook</Code>{' '}
                  (one story per state) and <Code>pnpm dev</Code> (these docs, with live examples).
                  Tests run with <Code>pnpm test</Code>.
                </>
              }
            />
          </p>
        </Prose>
        <Checklist
          label={{ pt: 'Roteiro de testes', en: 'Test plan' }}
          items={[
            {
              pt: 'NVDA + Firefox e JAWS + Chrome (Windows): modo de navegação e de foco em formulários, Combobox, DateRangePicker, Tabs, TreeView e Table selecionável.',
              en: 'NVDA + Firefox and JAWS + Chrome (Windows): browse and focus modes on forms, Combobox, DateRangePicker, Tabs, TreeView and selectable Table.',
            },
            {
              pt: 'VoiceOver + Safari (macOS): rotor de cabeçalhos, landmarks e controles; diálogos (Modal, Drawer, Tour, CommandPalette).',
              en: 'VoiceOver + Safari (macOS): headings, landmarks and controls rotor; dialogs (Modal, Drawer, Tour, CommandPalette).',
            },
            {
              pt: 'VoiceOver (iOS) e TalkBack (Android): gestos de exploração, SortableList, Carousel, Slider, BottomNavigation e o Tour em painel inferior.',
              en: 'VoiceOver (iOS) and TalkBack (Android): exploration gestures, SortableList, Carousel, Slider, BottomNavigation and the Tour bottom sheet.',
            },
            {
              pt: 'Mensagens de status: Toast, contagem do Combobox/Search, anúncios da SortableList e valores dos gráficos (4.1.3).',
              en: 'Status messages: Toast, Combobox/Search counts, SortableList announcements and chart values (4.1.3).',
            },
            {
              pt: 'Teclado sem mouse em todas as stories, incluindo Escape em camadas e a devolução do foco.',
              en: 'Keyboard without a mouse on every story, including Escape on layers and focus return.',
            },
            {
              pt: 'Temas de contraste do Windows (Aquático, Céu noturno) em Edge e Firefox.',
              en: 'Windows contrast themes (Aquatic, Night sky) in Edge and Firefox.',
            },
            {
              pt: 'Zoom 200% e 400%, largura de 320px e o bookmarklet de espaçamento de texto.',
              en: '200% and 400% zoom, 320px width and the text-spacing bookmarklet.',
            },
            {
              pt: 'Entrada por voz (Controle por Voz / Dragon): rótulo no nome (2.5.3) dos botões só com ícone.',
              en: 'Voice input (Voice Control / Dragon): label in name (2.5.3) for icon-only buttons.',
            },
          ]}
        />
        <h3 className="doc-h3" id="maior-risco">
          {t({ pt: 'Componentes de maior risco', en: 'Highest-risk components' })}
        </h3>
        <TableWrap label={{ pt: 'Componentes de maior risco', en: 'Highest-risk components' }}>
          <table className="doc-table">
            <thead>
              <tr>
                <th scope="col">{t({ pt: 'Componente', en: 'Component' })}</th>
                <th scope="col">{t({ pt: 'O que verificar', en: 'What to verify' })}</th>
              </tr>
            </thead>
            <tbody>
              {riskComponents.map((row) => (
                <tr key={row.name}>
                  <th scope="row">{row.name}</th>
                  <td>{t(row.check)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
        <h3 className="doc-h3" id="ambientes">
          {t({ pt: 'Ambientes de teste', en: 'Test environments' })}
        </h3>
        <TableWrap label={{ pt: 'Ambientes de teste', en: 'Test environments' }}>
          <table className="doc-table">
            <thead>
              <tr>
                <th scope="col">{t({ pt: 'Tecnologia assistiva', en: 'Assistive technology' })}</th>
                <th scope="col">{t({ pt: 'Navegador', en: 'Browser' })}</th>
                <th scope="col">{t({ pt: 'Sistema', en: 'System' })}</th>
              </tr>
            </thead>
            <tbody>
              {environments.map((row) => (
                <tr key={`${typeof row.at === 'string' ? row.at : row.at.en}-${row.os}`}>
                  <th scope="row">{typeof row.at === 'string' ? row.at : t(row.at)}</th>
                  <td>{row.browser}</td>
                  <td>{row.os}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
        <p className="guide-muted guide-note">
          <T
            pt="Use as versões estáveis mais recentes na data da auditoria e registre-as no relatório final."
            en="Use the latest stable versions on the audit date and record them in the final report."
          />
        </p>
      </Section>
    </DocPage>
  )
}
