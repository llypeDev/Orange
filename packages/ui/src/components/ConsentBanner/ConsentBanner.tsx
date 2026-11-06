import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ElementType,
  type FocusEvent,
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import {
  useControllableState,
  useDisclosure,
  useId,
  useIsomorphicLayoutEffect,
  usePresence,
} from '../../hooks'
import { useLocale, type MessageKey } from '../../providers'
import { canUseDOM, cx, getFocusableElements, mergeRefs } from '../../utils'
import { Button } from '../Button'
import { CheckboxGroup } from '../Checkbox'
import { linkClassName, type RenderLink } from '../Link'
import { Modal, ModalBody, ModalFooter } from '../Modal'
import { focusElement } from '../Modal/overlay'
import { VisuallyHidden } from '../VisuallyHidden'
import './ConsentBanner.css'

/** Uma categoria de cookies (ou de tratamento) que a pessoa pode aceitar ou recusar. */
export interface ConsentCategory {
  /** Chave da categoria no objeto de consentimento: `analytics`. */
  id: string
  /** Nome curto: "Desempenho". */
  label: ReactNode
  /** Para que serve e o que acontece se for recusada. */
  description?: ReactNode
  /**
   * Necessária para o site funcionar: sempre marcada, com a caixa desabilitada
   * e a indicação "Sempre ativos".
   */
  required?: boolean
}

/** Consentimento por categoria: `{ necessarios: true, analytics: false }`. */
export type ConsentValue = Record<string, boolean>

/** Como a decisão foi tomada. */
export type ConsentDecisionSource = 'accept-all' | 'reject' | 'custom'

export type ConsentBannerPlacement = 'bottom' | 'top' | 'inline'

export interface ConsentBannerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title' | 'onChange' | 'defaultValue' | 'children'
> {
  /** Banner visível (controlado). Use com `onOpenChange`. */
  open?: boolean
  /** Banner visível inicialmente (não controlado). Padrão: `true`. */
  defaultOpen?: boolean
  /** Chamado quando o banner pede para abrir ou fechar (fecha após cada decisão). */
  onOpenChange?: (open: boolean) => void
  /** Categorias listadas em "Personalizar", na ordem exibida. */
  categories: ConsentCategory[]
  /**
   * Preferências atuais (controlado), por `id` de categoria. Categorias
   * ausentes contam como recusadas; as `required`, sempre como aceitas.
   */
  value?: ConsentValue
  /** Preferências iniciais (não controlado). Padrão: só as obrigatórias. */
  defaultValue?: ConsentValue
  /** Chamado quando uma decisão muda as preferências, com todas as categorias. */
  onChange?: (consent: ConsentValue) => void
  /**
   * Chamado a cada decisão — "Aceitar todos", "Rejeitar opcionais" ou
   * "Salvar preferências" — com o consentimento completo e a origem. Depois
   * dele, o banner fecha. É aqui que o app guarda a escolha.
   */
  onDecision?: (consent: ConsentValue, source: ConsentDecisionSource) => void
  /** Título do banner (nomeia a região). Padrão: "Cookies neste site". */
  title?: ReactNode
  /** Nível de heading do título (`2`–`6`). Padrão: `2`. */
  headingLevel?: 2 | 3 | 4 | 5 | 6
  /** Texto do banner. Padrão: um texto genérico sobre cookies necessários e opcionais. */
  children?: ReactNode
  /** Endereço da política de cookies (ou de privacidade): mostra o link no banner. */
  policyHref?: string
  /**
   * Renderiza o link da política com o componente do seu roteador:
   * `renderLink={({ href, ...p }) => <RouterLink to={href} {...p} />}`.
   */
  renderLink?: RenderLink
  /**
   * `bottom` (padrão) e `top`: fixo na borda da janela, acima do conteúdo —
   * renderizado em portal no início do `<body>`, primeiro na leitura e na
   * ordem do Tab. `inline`: no fluxo, onde foi declarado.
   */
  placement?: ConsentBannerPlacement
  /** Preferências abertas (controlado) — ex.: um link "Preferências de cookies" no rodapé. */
  preferencesOpen?: boolean
  /** Preferências abertas inicialmente (não controlado). */
  defaultPreferencesOpen?: boolean
  /** Chamado quando o diálogo de preferências abre ou fecha. */
  onPreferencesOpenChange?: (open: boolean) => void
  /**
   * Elemento que recebe o foco quando o banner fecha com o foco dentro dele
   * (ou nas preferências abertas a partir dele). Padrão: o elemento focado
   * antes de entrar no banner ou, sem ele, o próximo elemento focável depois
   * do banner na página.
   */
  finalFocus?: RefObject<HTMLElement | null>
}

const announcementKeys: Record<ConsentDecisionSource, MessageKey> = {
  'accept-all': 'consentAccepted',
  reject: 'consentRejected',
  custom: 'consentSaved',
}

/** Consentimento completo: uma chave por categoria, obrigatórias sempre `true`. */
function normalizeConsent(categories: ConsentCategory[], value: ConsentValue | undefined) {
  const result: ConsentValue = {}
  for (const category of categories)
    result[category.id] = category.required ? true : value?.[category.id] === true
  return result
}

function sameConsent(a: ConsentValue, b: ConsentValue) {
  const keys = Object.keys(a)
  return keys.length === Object.keys(b).length && keys.every((key) => a[key] === b[key])
}

/** `a` vem antes de `b` na ordem do documento. */
function isBefore(a: Node, b: Node) {
  return !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING)
}

function isVisible(el: HTMLElement) {
  return typeof el.checkVisibility === 'function' ? el.checkVisibility() : true
}

/** Ainda dá para focar? (conectado, fora de `inert`, habilitado e visível). */
function canFocus(el: HTMLElement | null | undefined): el is HTMLElement {
  return (
    !!el && el.isConnected && !el.closest('[inert]') && !el.matches(':disabled') && isVisible(el)
  )
}

/**
 * Tema do ponto onde o componente foi declarado, quando ele não alcança o
 * portal (ex.: uma área clara dentro de uma página escura). Temas no `<html>`
 * ou no `<body>` já valem para o portal.
 */
function scopedTheme(anchor: Element | null, container: Element | null) {
  const scope = anchor?.closest('[data-theme]')
  if (!scope || (container && scope.contains(container))) return undefined
  return scope.getAttribute('data-theme') ?? undefined
}

/**
 * Banner de consentimento de cookies (LGPD): título, texto, link da política e
 * três ações com o mesmo peso — "Aceitar todos", "Rejeitar opcionais" e
 * "Personalizar", que abre um Modal com uma caixa de seleção por categoria. É uma região
 * nomeada que não prende nem rouba o foco; quem guarda a decisão é o app
 * (`onDecision`) — o componente não lê nem grava cookies.
 */
export const ConsentBanner = forwardRef<HTMLDivElement, ConsentBannerProps>(function ConsentBanner(
  {
    open,
    defaultOpen = true,
    onOpenChange,
    categories,
    value,
    defaultValue,
    onChange,
    onDecision,
    title,
    headingLevel = 2,
    children,
    policyHref,
    renderLink,
    placement = 'bottom',
    preferencesOpen,
    defaultPreferencesOpen = false,
    onPreferencesOpenChange,
    finalFocus,
    className,
    onFocus,
    ...rest
  },
  ref,
) {
  const { t } = useLocale()
  const titleId = useId('or-consent-banner-title')
  const fixed = placement !== 'inline'

  const banner = useDisclosure({ open, defaultOpen, onOpenChange })
  const preferences = useDisclosure({
    open: preferencesOpen,
    defaultOpen: defaultPreferencesOpen,
    onOpenChange: onPreferencesOpenChange,
  })
  const isOpen = banner.isOpen
  const isPreferencesOpen = preferences.isOpen

  const [rawConsent, setConsent] = useControllableState<ConsentValue>({
    value,
    defaultValue: defaultValue ?? {},
    onChange,
  })
  const consent = useMemo(() => normalizeConsent(categories, rawConsent), [categories, rawConsent])

  // Rascunho das preferências: nasce do consentimento atual a cada abertura
  // e só vale ao salvar. Fechar sem salvar descarta as mudanças.
  const [draft, setDraft] = useState(consent)
  const [draftFor, setDraftFor] = useState(isPreferencesOpen)
  if (draftFor !== isPreferencesOpen) {
    setDraftFor(isPreferencesOpen)
    if (isPreferencesOpen) setDraft(consent)
  }

  /* Presença ---------------------------------------------------------------- */

  const { present, state, nodeRef } = usePresence<HTMLDivElement>(isOpen)
  /** Contêiner do portal (fixo), criado no início do `<body>` enquanto o banner existe. */
  const [container, setContainer] = useState<HTMLElement | null>(null)
  /** Região de status, sempre no lugar onde o componente foi declarado. */
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const closing = state === 'closed'
  const frameRef = useRef<HTMLDivElement | null>(null)
  const modalRef = useRef<HTMLDivElement | null>(null)
  // Inline: a moldura recolhe a altura na saída (grid 1fr → 0fr). Fixo: a própria região sai.
  const frameRefs = useMemo(
    () => mergeRefs<HTMLDivElement>(frameRef, fixed ? undefined : nodeRef),
    [fixed, nodeRef],
  )
  const regionRefs = useMemo(
    () => mergeRefs<HTMLDivElement>(ref, fixed ? nodeRef : undefined),
    [ref, fixed, nodeRef],
  )

  // Durante a saída nada dentro do banner recebe foco nem é lido.
  useIsomorphicLayoutEffect(() => {
    const node = frameRef.current
    if (!node) return
    if (closing) node.setAttribute('inert', '')
    else node.removeAttribute('inert')
  }, [closing, present, container])

  // Fixo na janela: reserva a altura do banner na rolagem do documento para
  // que o elemento focado nunca fique escondido atrás dele (WCAG 2.4.11).
  useIsomorphicLayoutEffect(() => {
    const frame = frameRef.current
    if (!fixed || !isOpen || !frame || !canUseDOM) return
    const html = document.documentElement
    const property = placement === 'top' ? 'scrollPaddingTop' : 'scrollPaddingBottom'
    const previous = html.style[property]
    const update = () => {
      const height = frame.offsetHeight
      if (height > 0)
        html.style[property] = previous ? `calc(${previous} + ${height}px)` : `${height}px`
    }
    update()
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update)
    observer?.observe(frame)
    return () => {
      observer?.disconnect()
      html.style[property] = previous
    }
  }, [fixed, isOpen, placement, present, container])

  /* Foco -------------------------------------------------------------------- */

  const finalFocusRef = useRef(finalFocus)
  finalFocusRef.current = finalFocus
  /** Elemento focado antes de entrar no banner. */
  const lastOutsideRef = useRef<HTMLElement | null>(null)
  /** Elemento focado quando as preferências abriram. */
  const openerRef = useRef<HTMLElement | null>(null)
  /** Destino do foco entregue ao Modal quando ele fecha junto com o banner. */
  const modalFinalFocusRef = useRef<HTMLElement | null>(null)
  /** A pessoa acabou de decidir (o foco pode ter caído no `<body>`). */
  const decidedRef = useRef(false)

  // Captura a origem no render em que as preferências abrem — antes que o
  // Modal mova o foco para dentro dele.
  const wasPreferencesOpenRef = useRef(isPreferencesOpen)
  if (isPreferencesOpen && !wasPreferencesOpenRef.current && canUseDOM) {
    const current = document.activeElement
    openerRef.current = current instanceof HTMLElement && current !== document.body ? current : null
    modalFinalFocusRef.current = null
  }

  const isOurs = useCallback(
    (node: unknown) =>
      node instanceof Node &&
      (!!frameRef.current?.contains(node) || !!modalRef.current?.contains(node)),
    [],
  )

  /**
   * Para onde o foco vai quando o banner fecha com o foco dentro dele:
   * `finalFocus`, quem abriu as preferências (se estiver fora do banner), o
   * elemento focado antes de entrar no banner ou, sem eles, o próximo
   * elemento focável depois do banner (o anterior, no fim da página).
   */
  const getRestoreTarget = useCallback(() => {
    const frame = frameRef.current
    const preferred = [
      finalFocusRef.current?.current,
      openerRef.current,
      lastOutsideRef.current,
    ].find((el) => canFocus(el) && !isOurs(el))
    if (preferred) return preferred
    if (!frame) return null
    const list = getFocusableElements(document.body).filter(
      (el) => el.tabIndex >= 0 && !isOurs(el) && !el.closest('[hidden]') && isVisible(el),
    )
    return (
      list.find((el) => isBefore(frame, el)) ??
      [...list].reverse().find((el) => isBefore(el, frame)) ??
      null
    )
  }, [isOurs])

  // Fechou com o foco dentro (decisão ou `open` controlado): roda no commit em
  // que `open` vira false, com o banner ainda montado para a saída animada.
  const wasOpenRef = useRef(isOpen)
  useIsomorphicLayoutEffect(() => {
    const wasOpen = wasOpenRef.current
    const wasPreferencesOpen = wasPreferencesOpenRef.current
    wasOpenRef.current = isOpen
    wasPreferencesOpenRef.current = isPreferencesOpen
    if (isOpen) {
      if (!wasOpen) lastOutsideRef.current = null
      return
    }
    if (!wasOpen) return
    const active = document.activeElement
    const lost = !active || active === document.body
    const inModal = !!active && !!modalRef.current?.contains(active)
    if (!isOurs(active) && !(lost && decidedRef.current)) return
    const target = getRestoreTarget()
    // As preferências fecham junto: o Modal devolve o foco (para `finalFocus`).
    if (inModal || (wasPreferencesOpen && !isPreferencesOpen)) {
      if (wasPreferencesOpen && !isPreferencesOpen) modalFinalFocusRef.current = target
      return
    }
    if (target) focusElement(target)
    else if (active instanceof HTMLElement && isOurs(active)) active.blur()
  }, [isOpen, isPreferencesOpen, isOurs, getRestoreTarget])

  // A marca de decisão só vale para o commit em que ela aconteceu.
  useIsomorphicLayoutEffect(() => {
    decidedRef.current = false
  })

  // Desmontado aberto com o foco dentro: a mesma regra.
  useIsomorphicLayoutEffect(
    () => () => {
      if (wasOpenRef.current && frameRef.current?.contains(document.activeElement))
        focusElement(getRestoreTarget())
    },
    [getRestoreTarget],
  )

  // Fixo: portal no início do `<body>`. Nenhum ancestral com `transform` (ex.:
  // uma transição de página) vira o bloco de contenção do `position: fixed`, e
  // o banner é o primeiro na leitura e na ordem do Tab, como no GOV.UK.
  // Declarado depois da limpeza de foco acima: ela roda antes de o nó sair.
  useIsomorphicLayoutEffect(() => {
    if (!fixed || !present || !canUseDOM) return
    const node = document.createElement('div')
    node.setAttribute('data-or-consent-banner-portal', '')
    document.body.prepend(node)
    setContainer(node)
    return () => {
      node.remove()
      setContainer(null)
    }
  }, [fixed, present])

  const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
    onFocus?.(event)
    const from = event.relatedTarget
    if (from instanceof HTMLElement && from !== document.body && !isOurs(from))
      lastOutsideRef.current = from
  }

  /* Anúncio ----------------------------------------------------------------- */

  // Região viva sempre montada, no lugar do componente: a confirmação é lida
  // mesmo depois que o banner some. Mensagens repetidas são reanunciadas.
  const [announcement, setAnnouncement] = useState('')
  const announceTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(announceTimer.current), [])
  useEffect(() => {
    if (isOpen) setAnnouncement('')
  }, [isOpen])

  /* Decisões ---------------------------------------------------------------- */

  const decide = (source: ConsentDecisionSource, next: ConsentValue) => {
    decidedRef.current = true
    if (!sameConsent(next, consent)) setConsent(next)
    onDecision?.(next, source)
    // Esvazia e preenche logo depois: o leitor de tela lê de novo uma mensagem
    // repetida, e o Modal (inert na saída) já não esconde o resto da página.
    setAnnouncement('')
    clearTimeout(announceTimer.current)
    const message = t(announcementKeys[source])
    announceTimer.current = setTimeout(() => setAnnouncement(message), 50)
    preferences.close()
    banner.close()
  }

  const acceptAll = () =>
    decide('accept-all', Object.fromEntries(categories.map((category) => [category.id, true])))
  const rejectOptional = () => decide('reject', normalizeConsent(categories, {}))
  const savePreferences = () => decide('custom', normalizeConsent(categories, draft))

  /* Render ------------------------------------------------------------------ */

  const TitleTag: ElementType = `h${headingLevel}`
  const policyLabel = t('consentPolicyLink')
  const policyLinkProps = policyHref
    ? { href: policyHref, className: linkClassName(), children: policyLabel }
    : null

  const frame = present ? (
    <div
      ref={frameRefs}
      className={cx('or-consent-banner-frame', `or-consent-banner-frame--${placement}`)}
      data-state={state}
      data-theme={fixed ? scopedTheme(anchorEl, container) : undefined}
    >
      <div className="or-consent-banner-frame__inner">
        <div
          ref={regionRefs}
          role="region"
          aria-labelledby={titleId}
          data-state={state}
          data-placement={placement}
          className={cx('or-consent-banner', `or-consent-banner--${placement}`, className)}
          onFocus={handleFocus}
          {...rest}
        >
          <div className="or-consent-banner__content">
            <TitleTag id={titleId} className="or-consent-banner__title">
              {title ?? t('consentTitle')}
            </TitleTag>
            <div className="or-consent-banner__body">{children ?? <p>{t('consentText')}</p>}</div>
            {policyLinkProps && (
              <p className="or-consent-banner__policy">
                {renderLink ? renderLink(policyLinkProps) : <a {...policyLinkProps} />}
              </p>
            )}
          </div>
          <div className="or-consent-banner__actions">
            <Button variant="secondary" onClick={acceptAll}>
              {t('consentAcceptAll')}
            </Button>
            <Button variant="secondary" onClick={rejectOptional}>
              {t('consentRejectOptional')}
            </Button>
            <Button variant="secondary" aria-haspopup="dialog" onClick={preferences.open}>
              {t('consentCustomize')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  ) : null

  return (
    <>
      {fixed ? container && createPortal(frame, container) : frame}
      <VisuallyHidden ref={setAnchorEl} role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </VisuallyHidden>
      <Modal
        ref={modalRef}
        open={isPreferencesOpen}
        onOpenChange={preferences.setOpen}
        title={t('consentPreferencesTitle')}
        description={t('consentPreferencesDescription')}
        finalFocus={modalFinalFocusRef}
        className="or-consent-preferences"
      >
        <ModalBody>
          {/* Caixas de seleção, não switches: a escolha só vale ao salvar. */}
          <CheckboxGroup
            label={t('consentCategoriesLabel')}
            variant="card"
            className="or-consent-preferences__categories"
            value={categories
              .filter((category) => category.required || draft[category.id] === true)
              .map((category) => category.id)}
            onChange={(ids) =>
              setDraft(
                Object.fromEntries(
                  categories.map((category) => [category.id, ids.includes(category.id)]),
                ),
              )
            }
            options={categories.map((category) => ({
              value: category.id,
              label: (
                <>
                  <span className="or-consent-preferences__label">{category.label}</span>
                  {category.required && (
                    <span className="or-eyebrow or-consent-preferences__always">
                      {t('consentAlwaysActive')}
                    </span>
                  )}
                </>
              ),
              description: category.description ? (
                <span className="or-consent-preferences__description">{category.description}</span>
              ) : undefined,
              disabled: category.required,
            }))}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={acceptAll}>
            {t('consentAcceptAll')}
          </Button>
          <Button variant="secondary" onClick={savePreferences}>
            {t('consentSave')}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
})
