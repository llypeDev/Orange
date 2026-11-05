import { Icon, Spinner, useTheme } from '@orangesys/ui'
import { useEffect, useRef, useState, type RefObject } from 'react'
import { useHref } from 'react-router-dom'
import { useLang, type Localized } from '../../../i18n'
import { EMBED_PARAM, READY_MESSAGE, readMessage, THEME_MESSAGE } from './embed'
import './templates.css'

type DeviceId = 'desktop' | 'tablet' | 'mobile'

/** Larguras da moldura. O iframe tem sempre a largura do aparelho; se não couber, é reduzido em escala. */
const DEVICES: { id: DeviceId; label: Localized<string>; width: number; height: number }[] = [
  { id: 'desktop', label: { pt: 'Desktop', en: 'Desktop' }, width: 1280, height: 800 },
  { id: 'tablet', label: { pt: 'Tablet', en: 'Tablet' }, width: 768, height: 900 },
  { id: 'mobile', label: { pt: 'Celular', en: 'Phone' }, width: 390, height: 780 },
]

type ThemeChoice = 'inherit' | 'dark' | 'light'

/** Largura do conteúdo (sem padding) de um elemento, atualizada no resize. */
function useContentWidth(ref: RefObject<HTMLElement | null>) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const measure = () => {
      const style = getComputedStyle(node)
      setWidth(node.clientWidth - parseFloat(style.paddingLeft || '0') - parseFloat(style.paddingRight || '0'))
    }
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [ref])
  return width
}

export interface TemplatePreviewProps {
  /** Rota do modelo, sem idioma: `/templates/dashboard`. */
  path: string
  /** Nome do modelo, para o título do iframe. */
  name: Localized<string>
}

/**
 * Prévia de página inteira: o modelo roda em um iframe com a largura de um
 * desktop, tablet ou celular, reduzido em escala quando não cabe — a moldura
 * nunca passa da largura da coluna da documentação.
 */
export function TemplatePreview({ path, name }: TemplatePreviewProps) {
  const { t } = useLang()
  const { resolvedTheme } = useTheme()
  const [deviceId, setDeviceId] = useState<DeviceId>('desktop')
  const [themeChoice, setThemeChoice] = useState<ThemeChoice>('inherit')
  const theme = themeChoice === 'inherit' ? resolvedTheme : themeChoice
  // O src não muda com o tema (isso recarregaria o iframe): trocas posteriores vão por mensagem.
  const [initialTheme] = useState(theme)
  // A interface dos modelos é em português: o iframe sempre abre a rota /pt.
  const src = useHref(`/pt${path}?${EMBED_PARAM}=1&theme=${initialTheme}`)
  const newTabHref = useHref(`/pt${path}?${EMBED_PARAM}=1&theme=${theme}`)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const available = useContentWidth(stageRef)

  const device = DEVICES.find((d) => d.id === deviceId) ?? DEVICES[0]
  const scale = available > 0 ? Math.min(1, available / device.width) : 1

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== iframeRef.current?.contentWindow) return
      if (readMessage(event.data).type === READY_MESSAGE) setReady(true)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  useEffect(() => {
    if (!ready) return
    iframeRef.current?.contentWindow?.postMessage({ type: THEME_MESSAGE, theme }, window.location.origin)
  }, [ready, theme])

  // Se a mensagem de "pronto" não chegar (ex.: erro no iframe), mostra a moldura assim mesmo.
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    if (!loaded || ready) return
    const timer = window.setTimeout(() => setReady(true), 4000)
    return () => window.clearTimeout(timer)
  }, [loaded, ready])

  const percent = Math.round(scale * 100)

  return (
    <div className="doc-example__frame tpl-preview">
      <div className="tpl-preview__toolbar">
        <p className="doc-example__label tpl-preview__readout">
          <span>{t({ pt: 'Prévia', en: 'Preview' })}</span>
          <span aria-hidden="true">·</span>
          <span>
            {device.width} × {device.height}
            {percent < 100 && (
              <>
                {' '}
                · {percent}%<span className="or-visually-hidden">{t({ pt: ' do tamanho real', en: ' of actual size' })}</span>
              </>
            )}
          </span>
        </p>
        <div className="tpl-preview__controls">
          <div className="doc-example__tools" role="group" aria-label={t({ pt: 'Largura da prévia', en: 'Preview width' })}>
            {DEVICES.map((d) => (
              <button
                key={d.id}
                type="button"
                className="doc-example__tool"
                aria-pressed={d.id === deviceId}
                onClick={() => setDeviceId(d.id)}
              >
                {t(d.label)}
              </button>
            ))}
          </div>
          <div className="doc-example__tools" role="group" aria-label={t({ pt: 'Tema da prévia', en: 'Preview theme' })}>
            {(['inherit', 'dark', 'light'] as const).map((value) => (
              <button
                key={value}
                type="button"
                className="doc-example__tool"
                aria-pressed={themeChoice === value}
                onClick={() => setThemeChoice(value)}
              >
                {value === 'inherit'
                  ? t({ pt: 'Auto', en: 'Auto' })
                  : value === 'dark'
                    ? t({ pt: 'Escuro', en: 'Dark' })
                    : t({ pt: 'Claro', en: 'Light' })}
              </button>
            ))}
          </div>
          <a className="tpl-preview__open" href={newTabHref} target="_blank" rel="noreferrer">
            {t({ pt: 'Abrir em nova aba', en: 'Open in new tab' })}
            <Icon name="arrow-up-right" size="sm" />
            <span className="or-visually-hidden">{t({ pt: '(abre em nova aba)', en: '(opens in a new tab)' })}</span>
          </a>
        </div>
      </div>
      <div ref={stageRef} className="tpl-preview__stage">
        <div
          className="tpl-preview__device"
          data-device={device.id}
          style={{ width: device.width * scale, height: device.height * scale }}
        >
          <iframe
            ref={iframeRef}
            src={src}
            title={t({ pt: `Prévia do modelo ${name.pt} (${device.width} px)`, en: `${name.en} template preview (${device.width} px)` })}
            className="tpl-preview__iframe"
            style={{ width: device.width, height: device.height, transform: scale < 1 ? `scale(${scale})` : undefined }}
            onLoad={() => setLoaded(true)}
          />
          {!ready && (
            <div className="tpl-preview__loading" role="status">
              <Spinner size="md" decorative />
              <span>{t({ pt: 'Carregando prévia…', en: 'Loading preview…' })}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
